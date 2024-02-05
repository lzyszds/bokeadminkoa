//文章接口

import ArticleMapper from "../mapper/article.mapper";
import {ArticleData, Articles, ArticleType} from "../domain/Articles";
import ApiConfig from "../domain/ApiCongfigType";
import {checkObj, randomUnique} from "../utils/common";
import path from "path";
import fs from "fs";
import md5 from "md5";

class ArticleService {

    public async findAll(ctx: any) {
        let {search, pages, limit} = ctx.request.query
        search = `%${search ? search : ''}%`;
        const total: number = await ArticleMapper.getArticleListTotal(search);

        const data: Articles[] = await ArticleMapper.findAll(search, pages, limit);
        const apiConfig: ApiConfig<ArticleData> = new ApiConfig();
        return apiConfig.success({total: total, data});
    }

    public async findArticleInfo(ctx: any) {
        const {id} = ctx.params;
        const data: Articles = await ArticleMapper.findArticleInfo(id);
        const apiConfig: ApiConfig<Articles> = new ApiConfig();
        return apiConfig.success(data);
    }

    public async findArticleTypeAll() {
        const data: ArticleType[] = await ArticleMapper.findArticleTypeAll();
        const apiConfig: ApiConfig<ArticleType[]> = new ApiConfig();
        return apiConfig.success(data);
    }

    public async addArticle(ctx: any) {
        const {title, content, coverImg, comNumber, main, wtype, coverContent} = ctx.request.body;
        if (checkObj(ctx.request.body, ["title", "content", "coverImg", "comNumber", "main", "wtype", "coverContent"])) {
            const apiConfig: ApiConfig<string> = new ApiConfig();
            return apiConfig.fail("参数错误");
        }

        return await ArticleMapper.addArticle(title, content, coverImg, comNumber, main, coverContent);
    }

    public async addArticleType(ctx: any) {
        const {name} = ctx.request.body;
        if (checkObj(ctx.request.body, ["name"])) {
            const apiConfig: ApiConfig<string> = new ApiConfig();
            return apiConfig.fail("参数错误");
        }
        const result = await ArticleMapper.addArticleType(name)
        const apiConfig: ApiConfig<string> = new ApiConfig();
        if (result.affectedRows === 1) {
            return apiConfig.success("类型添加成功");
        } else {
            return apiConfig.fail(result);
        }
    }

    public async getRandArticleImg(ctx: any) {
        const imgBuffer = null
        try {
            // 获取文件夹 public/img/coverRomImg 中的所有图片文件(名字)
            const imgDir = path.join(__dirname, '../../public/img/coverRomImg');
            const imgs = fs.readdirSync(imgDir);

            // 随机数
            const random = randomUnique(0, imgs.length - 1, 0);
            // 获取随机图片
            const img = imgs[random];
            // 返回图片
            const imgPath = path.join(imgDir, img);
            return await fs.promises.readFile(imgPath);
        } catch (err) {
            const msg: String = 'internal Server error';
            ctx.status = 500;
            ctx.body = msg;
            return imgBuffer;
        }
    }

    public async updateArticle(ctx: any) {
        const {aid, title, content, coverImg, comNumber, main, wtype, coverContent} = ctx.request.body;
        if (checkObj(ctx.request.body, ["aid"], ["title", "content", "coverImg", "comNumber", "main", "wtype", "coverContent"])) {
            const apiConfig: ApiConfig<string> = new ApiConfig();
            return apiConfig.fail("参数错误");
        }
    }

    //获取文章评论
    public async getArticleComment(ctx: any) {
        const {id} = ctx.query;
        const data: Articles = await ArticleMapper.getArticleComment(id);
        const apiConfig: ApiConfig<Articles> = new ApiConfig();
        return apiConfig.success(data);
    }

    //获取所有评论
    public async getAllComment() {
        const data: Articles = await ArticleMapper.getAllComment();
        const apiConfig: ApiConfig<Articles> = new ApiConfig();
        return apiConfig.success(data);
    }

    /**
     *  上传文章图片
     *  @param ctx 请求对象
     *  @param file 文件对象
     *  @returns 返回上传成功
     *  限制配置: 文件大小限制为10MB
     *  具体的上传图片逻辑
     *  1. 获取上传的文件 只支持图片上传 格式为: jpg, png, webp, jpeg (后续可扩展)
     *  2. 创建可读流 创建可写流
     *  3. 可读流通过管道写入可写流
     *  4. 设置图片名字  保证唯一性 文件md5 转换为16进制
     *  5. 将图片写入到指定文件夹
     *  6. 返回上传成功
     * */
    public async uploadArticleImg(ctx: any, file: any) {
        if (!file || !file.buffer) {
            const apiConfig: ApiConfig<string> = new ApiConfig();
            return apiConfig.fail("上传失败");
        }

        //文件类型判断
        const fileType = file.mimetype.split('/')[1];
        if (!['jpg', 'png', 'webp', 'jpeg'].includes(fileType)) {
            const apiConfig: ApiConfig<string> = new ApiConfig();
            return apiConfig.fail("上传失败,文件类型不支持");
        }

        //将图片的数据中的buffer转成md5
        const md5Name = md5(file.buffer);

        //图片名字
        // @ts-ignore
        const imgName = `${md5Name.toString(16)}.${fileType}`;
        const apiConfig: ApiConfig<string> = new ApiConfig();
        //
        // try {
        //     uploadArticleImg(imgName);
        // } catch (e: any) {
        //     return apiConfig.fail(e);
        // }
        return apiConfig.success("上传成功");
    }

}

export default new ArticleService()