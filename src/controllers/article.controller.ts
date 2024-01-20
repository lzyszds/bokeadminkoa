//文章接口

import {Controller, Get, Param} from "routing-controllers";
import {BaseContext} from "koa";
import ArticleService from "../service/article.service";

@Controller("/article")
class ArticleController {

    @Get("/getArticleList")
    public async findAll(@Param("ctx") ctx: BaseContext) {
        return ArticleService.findAll(ctx);
    }
}

export default ArticleController;