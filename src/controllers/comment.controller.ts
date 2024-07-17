import { Controller, Ctx, Get, Post } from "routing-controllers";
import CommentService from "../service/comment.service";

@Controller("/comment")
class CommentController {


    //获取指定文章评论
    @Get("/getArticleComment")
    public getArticleComments(@Ctx() ctx: any) {
        return CommentService.getArticleComment(ctx);
    }

    //获取当前系统所有评论
    @Get("/getAllComment")
    public getAllComment(@Ctx() ctx: any) {
        const { search, pages, limit } = ctx.request.query
        return CommentService.getAllComment(search, pages, limit);
    }

    //新增评论
    @Post("/addComment")
    public addComment(@Ctx() ctx: any) {
        return CommentService.addComment(ctx);
    }

    //删除评论
    @Post("/deleteComment")
    public deleteComment(@Ctx() ctx: any) {
        return CommentService.deleteComment(ctx);
    }

    //获取最新评论
    @Get("/getNewComment")
    public async getWeather(@Ctx() ctx: any) {
        return CommentService.getNewComment(ctx);
    }
}

export default CommentController;
