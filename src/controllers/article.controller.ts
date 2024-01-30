//文章接口

import {Controller, Ctx, Get, Post,} from "routing-controllers";
import {BaseContext} from "koa";
import ArticleService from "../service/article.service";

@Controller("/article")
class ArticleController {

    //获取文章列表
    @Get("/getArticleList")
    public findAll(@Ctx() ctx: any) {
        return ArticleService.findAll(ctx);
    }

    @Get("/getArticleInfo/:id")
    public findArticleInfo(@Ctx() ctx: any) {
        return ArticleService.findArticleInfo(ctx);
    }

    //获取文章类型列表
    @Get("/getArticleTypeList")
    public getArticleTypeList(@Ctx() ctx: any) {
        return ArticleService.findArticleTypeAll();
    }

    //新增文章
    @Post("/addArticle")
    public addArticle(@Ctx() ctx: any) {
        return ArticleService.addArticle(ctx);
    }

    //新增文章类型
    @Post("/addArticleType")
    public addArticleType(@Ctx() ctx: any) {
        return ArticleService.addArticleType(ctx);
    }

    // 随机文章图库
    @Get("/getRandArticleImg")
    public async getRandArticleImg(@Ctx() ctx: any) {
        const imgBuffer = await ArticleService.getRandArticleImg(ctx);
        ctx.set('Content-Type', 'image/jpeg');
        ctx.body = imgBuffer;
        return ctx;
    }


    //修改文章
    @Post("/updateArticle")
    public updateArticle(@Ctx() ctx: any) {
        return ArticleService.updateArticle(ctx);
    }

    //获取指定文章评论
    @Get("/getArticleComment")
    public getArticleComments(@Ctx() ctx: any) {
        return ArticleService.getArticleComment(ctx);
    }


}

export default ArticleController;