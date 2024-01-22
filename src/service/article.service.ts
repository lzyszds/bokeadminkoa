//文章接口

import ArticleMapper from "../mapper/article.mapper";
import db from "../utils/db";
import {ArticleData, Articles, ArticleType} from "../domain/Articles";
import ApiConfig from "../domain/ApiCongfigType";
import {checkObj} from "../utils/common";

class ArticleService {

    public async findAll(search: string = "", pages: string = "1", limit: string = "10") {
        search = `%${search}%`;
        const total: number = await ArticleMapper.getArticleListTotal(search);

        const data: Articles[] = await ArticleMapper.findAll(search, pages, limit);
        const apiConfig: ApiConfig<ArticleData> = new ApiConfig();
        return apiConfig.success({total: total, data});
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
        const result = await ArticleMapper.addArticle(title, content, coverImg, comNumber, main, coverContent);

        return result;
    }

    public async addArticleType(ctx: any) {
        const {name, whether_use} = ctx.request.body;
        if (checkObj(ctx.request.body, ["name", "isUse"])) {
            const apiConfig: ApiConfig<string> = new ApiConfig();
            return apiConfig.fail("参数错误");
        }
        return await ArticleMapper.addArticleType(name, whether_use);
    }

    public async updateArticle(ctx: any) {
        const {aid, title, content, coverImg, comNumber, main, wtype, coverContent} = ctx.request.body;
        if (checkObj(ctx.request.body, ["aid"], ["title", "content", "coverImg", "comNumber", "main", "wtype", "coverContent"])) {
            const apiConfig: ApiConfig<string> = new ApiConfig();
            return apiConfig.fail("参数错误");
        }
    }
}

export default new ArticleService()