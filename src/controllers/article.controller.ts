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

    //删除文章类型
    @Post("/deleteArticleType")
    public deleteArticleType(@Ctx() ctx: any) {
        return ArticleService.deleteArticleType(ctx);
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

    //删除文章
    @Post("/deleteArticle")
    public deleteArticle(@Ctx() ctx: any) {
        return ArticleService.deleteArticle(ctx);
    }
}

export default ArticleController;