//文章接口

import ArticleMapper from "../mapper/article.mapper";
import db from "../utils/db";
import {ArticleData, Articles} from "../domain/Articles";
import ApiConfig from "../domain/ApiCongfigType";

class ArticleService {

    public async findAll(search: string = "", pages: string = "1", limit: string = "10") {
        search = `%${search}%`;
        const total: number = await ArticleMapper.getArticleListTotal(search);

        const data: Articles[] = await ArticleMapper.findAll(search, pages, limit);
        const apiConfig: ApiConfig<ArticleData> = new ApiConfig();
        return apiConfig.success({total: total, data});
    }

}

export default new ArticleService()