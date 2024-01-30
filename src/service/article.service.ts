//文章接口

import ArticleMapper from "../mapper/article.mapper";
import db from "../utils/db";
import {ArticleData, Articles, ArticleType} from "../domain/Articles";
import ApiConfig from "../domain/ApiCongfigType";
import {checkObj, randomUnique} from "../utils/common";
import path from "path";
import fs from "fs";
import * as buffer from "buffer";

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
        const {name, whether_use} = ctx.request.body;
        if (checkObj(ctx.request.body, ["name", "whether_use"])) {
            const apiConfig: ApiConfig<string> = new ApiConfig();
            return apiConfig.fail("参数错误");
        }
        const result = await ArticleMapper.addArticleType(name, whether_use)
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
}

export default new ArticleService()