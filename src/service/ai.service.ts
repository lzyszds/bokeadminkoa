import ApiConfig from "../domain/ApiCongfigType";
import ArticleMapper from "../mapper/article.mapper";
import stream from "stream";
import AiMapper from "../mapper/ai.mapper";
import {AiUc, AiUcKeys} from "../domain/AiType";
import {DataTotal} from "../domain/DataTotal";
import dayjs from "dayjs";


/*
    * 获取ai的key方法
    * 1.根据使用次数排序
    * 2.使用次数最小的key先使用 让其使用次数增加
    * 3.确保每次使用的key使用次数都是最小的
    * 4.这样可以保证每个key的使用次数都是平均的
    * */
async function SelkeysBasedOnUsageFrequency(): Promise<string[]> {
    const aiuc = (await AiMapper.findAiList(1, 10000))[0]
    let list: any = [];
    for (let key in aiuc) {
        if (key == 'id' || key == 'created_at') continue;
        //@ts-ignore
        if (list.length != 0 && aiuc[key] < aiuc[list[0]] && aiuc[key] < 150) {
            list.unshift(key)
        } else {
            list.push(key)
        }
    }
    const aiucKey = await AiMapper.findAiKey(list[0])
    return [aiucKey[0].keyValue, aiucKey[0].keyName]
}

class AiService {


    //GPT3.5开放ai
    public async getAifox(ctx: any) {
        let strConnect = ''

        // 处理流式请求
        ctx.respond = false; // 禁用Koa的内置响应处理
        // 设置响应头
        ctx.type = 'text/plain';

        //拿到文章id
        const aid: any = ctx.query.aid
        let articleInfo: any;
        try {
            //根据文章id获取文章内容
            articleInfo = await ArticleMapper.findArticleInfo(aid)
        } catch (e) {
            ctx.res.end('无法获取文章内容')
            return
        }


        // 创建一个可写流
        const writableStream = new stream.Writable({
            write(chunk, encoding, callback) {
                ctx.res.write(chunk, encoding);
                callback();
            }
        });
        const [key, keyName] = await SelkeysBasedOnUsageFrequency()
        const url: string = 'https://api.chatanywhere.com.cn/v1/chat/completions/';
        const result = await fetch(url, {
            method: 'POST',
            body: JSON.stringify({
                model: "gpt-3.5-turbo-0125",
                messages: [
                    {
                        role: "user",
                        content: "帮我对下面的文章内容进行一个摘要。" + articleInfo.content
                    }
                ],
                presence_penalty: 0,
                stream: true,
                temperature: 0.5,
                top_p: 1
            }),
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${key}`
            },
        });

        // 在ai使用次数表中增加使用次数
        await AiMapper.updateAiUc(keyName, dayjs().format('YYYY-MM-DD') + "%")

        const textDecoder = new TextDecoder()
        const reader = result.body?.getReader()!

        await slowLoop();

        async function slowLoop() {
            let partialData = ''; // 保存部分数据
            while (true) {
                const {done, value} = await reader.read()
                if (done) {
                    ctx.res.end(); // 结束响应
                    break
                }

                const text = textDecoder.decode(value)
                const lines = (partialData + text).split('\n'); // 将部分数据与新数据合并后再按行分割
                for (let line of lines) { // 逐行处理数据
                    try {
                        if (strConnect != '') {
                            line = strConnect + line
                            strConnect = ''
                        }
                        if (line.includes("[DONE]")) continue; // 如果包含 "[DONE]" 字符串则跳过该行
                        const resObj: any = JSON.parse(line.replace('data: ', ''));
                        const str = resObj.choices[0].delta.content;
                        if (str) {
                            // 返回数据
                            writableStream.write(`${str}\n`, 'utf-8');
                        }
                    } catch (e) {
                        // 处理异常
                        strConnect = line
                    }
                }
            }
        }

    }

    //获取ai列表
    public async getAiList(ctx: any): Promise<ApiConfig<DataTotal<AiUc>>> {

        const apiConfig = new ApiConfig<DataTotal<AiUc>>();
        const {pages, limit} = ctx.query;
        const total = await AiMapper.findAiListTotal();
        const list = await AiMapper.findAiList(Number(pages), Number(limit));
        apiConfig.success({
            data: list,
            total
        })
        return apiConfig
    }

    //获取指定Ai的key
    public async getAiKeysList(ctx: any): Promise<ApiConfig<AiUcKeys[]>> {
        const apiConfig = new ApiConfig<AiUcKeys[]>();
        let {search, pages, limit} = ctx.query;
        search = search || ''
        pages = pages || 1
        limit = limit || 10

        const list = await AiMapper.findAiKey('%' + search + '%', Number(pages), Number(limit));
        apiConfig.success(list)
        return apiConfig
    }

    //新增Ai的key
    public async addAiKey(ctx: any): Promise<ApiConfig<string>> {
        const apiConfig = new ApiConfig<string>();
        const {keyName, keyValue} = ctx.request.body;
        const list = await AiMapper.addAiKey(keyName, keyValue);
        apiConfig.success(list)
        return apiConfig
    }

    //删除Ai的key
    public async deleteAiKey(ctx: any): Promise<ApiConfig<any>> {
        const apiConfig = new ApiConfig<any>();
        const {id} = ctx.request.body;
        const list = await AiMapper.deleteAiKey(id);
        if (list.affectedRows > 0) {
            apiConfig.success("删除成功")
        }
        return apiConfig
    }


}

export default new AiService();