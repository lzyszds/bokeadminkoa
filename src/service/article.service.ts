//文章接口

import ArticleMapper from "../mapper/article.mapper";

class ArticleService {
    public async findAll(search: string = "", pages: string = "1", limit: string = "10") {
        search = `%${search}%`;
        return ArticleMapper.findAll(search, pages, limit);
    }

}

export default new ArticleService()