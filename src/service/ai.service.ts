import ApiConfig from "../domain/ApiCongfigType";
import ArticleMapper from "../mapper/article.mapper";
import stream from "stream";




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

        //根据文章id获取文章内容
        const articleInfo = await ArticleMapper.findArticleInfo(aid)


        // 创建一个可写流
        const writableStream = new stream.Writable({
            write(chunk, encoding, callback) {
                ctx.res.write(chunk, encoding);
                callback();
            }
        });

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
                'Authorization': `Bearer sk-vPMwI4Qv32xSXutKVpJ0xsoL9yEoKMEjki8UOrszoq2MHk6j`
            },
        });
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
                partialData = lines.pop() || ''; // 获取新数据中的不完整行，并保存到 partialData 中
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

}

export default new AiService();