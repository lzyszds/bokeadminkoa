//文章接口

import {Controller, Ctx, Get, Post, UploadedFile,} from "routing-controllers";
import ArticleService from "../service/article.service";
import fileUploadOptions from "../utils/upload";
import ApiConfig from "../domain/ApiCongfigType";

@Controller("/article")
class ArticleController {

    //获取文章列表
    @Get("/getArticleList")
    public findAll(@Ctx() ctx: any) {
        return ArticleService.findAll(ctx);
    }

    //根据id获取文章详情
    @Get("/getArticleInfo/:id")
    public findArticleInfo(@Ctx() ctx: any) {
        return ArticleService.findArticleInfo(ctx);
    }

    //新增文章
    @Post("/addArticle")
    public addArticle(@Ctx() ctx: any) {
        return ArticleService.addArticle(ctx);
    }

    //获取文章类型列表
    @Get("/getArticleTypeList")
    public getArticleTypeList(@Ctx() ctx: any) {
        return ArticleService.findArticleTypeAll();
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

    //获取当前系统所有评论
    @Get("/getAllComment")
    public getAllComment() {
        return ArticleService.getAllComment();
    }

    //上传图片
    @Post('/uploadArticleImg')
    public upload(@UploadedFile('upload-image', {
        options: fileUploadOptions("articleImages")
    }) file: Express.Multer.File) {
        const apiConfig: ApiConfig<string> = new ApiConfig();
        //获取文件路径
        if (file.filename) {
            return apiConfig.success("/img/articleImages/" + file.filename);
        } else {
            return apiConfig.fail("上传失败");
        }
    }
}

export default ArticleController;