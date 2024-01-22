//文章接口

import {Controller, Ctx, Get, Post,} from "routing-controllers";
import {BaseContext} from "koa";
import ArticleService from "../service/article.service";

@Controller("/article")
class ArticleController {

    @Get("/getArticleList")
    public findAll(@Ctx() ctx: any) {
        const {search, pages, limit} = ctx.request.query

        return ArticleService.findAll(search, pages, limit);
    }

    @Get("/getArticleTypeList")
    public getArticleTypeList(@Ctx() ctx: any) {
        return ArticleService.findArticleTypeAll();
    }

    @Post("/addArticle")
    public addArticle(@Ctx() ctx: any) {
        return ArticleService.addArticle(ctx);
    }

    @Post("/addArticleType")
    public addArticleType(@Ctx() ctx: any) {
        return ArticleService.addArticle(ctx);
    }

    @Post("/updateArticle")
    public updateArticle(@Ctx() ctx: any) {
        return ArticleService.updateArticle(ctx);
    }
}

export default ArticleController;