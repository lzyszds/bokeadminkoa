import ApiConfig from "../domain/ApiCongfigType";
import ArticleMapper from "../mapper/article.mapper";
import { Readable } from "stream";
import AiMapper from "../mapper/ai.mapper";
import { AiUc, AiUcKeys } from "../domain/AiType";
import { DataTotal } from "../domain/DataTotal";
import dayjs from "dayjs";
import handleAiFox from "../utils/handleAiFox";

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

    // GPT-3.5 OpenAI
    // GPT-3.5 OpenAI
    public async getAifox(ctx: any) {
        let strConnect = '';
        let strAll = '';
        let partialData = ''; // 声明 partialData 变量

        // 处理流式请求
        ctx.respond = false; // 禁用 Koa 的内置响应处理
        ctx.type = 'text/plain'; // 设置响应头为文本类型
        ctx.set('Content-Type', 'text/plain');
        ctx.set('Transfer-Encoding', 'chunked'); // 设置传输编码为分块传输

        // 获取文章 ID
        const aid: any = ctx.query.aid;
        let articleInfo: any;

        try {
            // 根据文章 ID 获取文章内容
            articleInfo = await ArticleMapper.findArticleInfo(aid);
        } catch (e) {
            ctx.res.end('无法获取文章内容');
            return;
        }

        const [key, keyName] = await SelkeysBasedOnUsageFrequency();
        const url: string = 'https://api.chatanywhere.com.cn/v1/chat/completions/';

        let result: any;

        const getResultData = async () => {
            try {
                result = await handleAiFox.getAiList(url, articleInfo.content, key);
            } catch (error) {
                return await getResultData()
            }
        }
        await getResultData()
        // 更新 AI 使用次数
        await AiMapper.updateAiUc(keyName, dayjs().format('YYYY-MM-DD') + "%");

        const textDecoder = new TextDecoder();
        const stream: Readable = result.data;

        // 流处理逻辑
        stream.on('data', async (chunk: Buffer) => {
            let text = textDecoder.decode(chunk)
            //将text文本中出现的多个/转换成一个/
            text = text.replace(/\/+/g, '/')

            const lines = (partialData + text).split('\n'); // 将部分数据与新数据合并后再按行分割

            partialData = lines.pop() || ''; // 更新 partialData 为剩余部分

            for (let line of lines) { // 逐行处理数据
                try {
                    if (strConnect !== '') {
                        line = strConnect + line;
                        strConnect = '';
                    }
                    if (line.includes("[DONE]")) continue; // 如果包含 "[DONE]" 字符串则跳过该行

                    const resJson: any = JSON.parse(line.replace('data: ', ''));
                    console.log(resJson.choices[0].delta.content)
                    let str = resJson.choices[0].delta.content.replaceAll('�', '').replaceAll('\\n', '<br/>'); // 去除特殊字符
                    if (str) {
                        // 返回数据
                        ctx.res.write(`${str}\n`);
                        strAll += str;
                    }
                } catch (e) {
                    // 处理异常
                    strConnect = line;
                }
            }
        });

        stream.on('end', () => {
            ctx.res.end(); // 结束响应
            if (strAll.length > 0) {
                // 写入文件
                handleAiFox.writeAiTextStore(strAll, aid);
            }
        });

        stream.on('error', (err) => {
            console.error('Stream error:', err);
            ctx.res.end('服务器错误'); // 错误时返回明确的内容
        });
    }
    //获取ai列表
    public async getAiList(ctx: any): Promise<ApiConfig<DataTotal<AiUc>>> {

        const apiConfig = new ApiConfig<DataTotal<AiUc>>();
        const { pages, limit } = ctx.query;
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
        let { search, pages, limit } = ctx.query;
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
        const { keyName, keyValue } = ctx.request.body;
        const list = await AiMapper.addAiKey(keyName, keyValue);
        apiConfig.success(list)
        return apiConfig
    }

    //删除Ai的key
    public async deleteAiKey(ctx: any): Promise<ApiConfig<any>> {
        const apiConfig = new ApiConfig<any>();
        const { id } = ctx.request.body;
        const list = await AiMapper.deleteAiKey(id);
        if (list.affectedRows > 0) {
            apiConfig.success("删除成功")
        }
        return apiConfig
    }


}

export default new AiService();
