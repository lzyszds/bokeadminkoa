//文章接口

import {Controller, Ctx, Get,} from "routing-controllers";
import {BaseContext} from "koa";
import ArticleService from "../service/article.service";

@Controller("/article")
class ArticleController {

    @Get("/getArticleList")
    public findAll(@Ctx() ctx: any) {
        const {search, pages, limit} = ctx.request.query

        return ArticleService.findAll(search, pages, limit);
    }
}

export default ArticleController;