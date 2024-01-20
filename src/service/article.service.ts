//文章接口

import ArticleMapper from "../mapper/article.mapper";

class ArticleService {
    public async findAll(ctx: any) {
        const {search, pages, limit} = ctx.request.body
        return ArticleMapper.findAll(search, pages, limit);
    }

}

export default new ArticleService()