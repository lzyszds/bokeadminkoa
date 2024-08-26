import { Controller, Get, Post, Param, Ctx, UploadedFile } from "routing-controllers";
import userService from "../service/user.service";
import { Response } from "koa";
import fileUploadOptions from "../utils/upload";
import ApiConfig from "../domain/ApiCongfigType";
import SystemService from "../service/system.service";

@Controller("/system")
class UserController {

    //获取系统配置
    @Get("/getSystemConfig")
    public getSystemConfig(@Ctx() ctx: any) {
        return SystemService.getSystemConfig(ctx.query.type);
    }

    //新增系统配置
    @Post("/addSystemConfig")
    public addSystemConfig(@Ctx() ctx: any) {
        return SystemService.addSystemConfig(ctx);
    }

    //更新系统配置
    @Post("/updateSystemConfig")
    public updateSystemConfig(@Ctx() ctx: any) {
        return SystemService.updateSystemConfig(ctx);
    }

    //系统公告
    @Get("/getNotification")
    public getNotification() {
        return SystemService.getNotification();
    }

    @Post("/addFooterInfo")
    public addFooterInfo(@Ctx() ctx: any) {
        return SystemService.addFooterInfo(ctx);
    }

    //获取页脚信息数据
    @Get("/getFooterInfo")
    public getFooterInfo() {
        return SystemService.getFooterInfo();
    }

    //更新页脚信息
    @Post("/updateFooterInfo")
    public updateFooterInfo(@Ctx() ctx: any) {
        return SystemService.updateFooterInfo(ctx);
    }

    //获取系统加载图片列表
    @Get("/getSystemLoadImages")
    public getSystemLoadImages() {
        return SystemService.getSystemLoadImages();
    }

    //获取当前系统选择的加载图片 图片懒加载的loadGif图片
    @Get("/getLazyLoadImage")
    public async getLazyLoadImage(@Ctx() ctx: any) {
        const imgBuffer = await SystemService.getLazyLoadImage(ctx);
        ctx.set('Content-Type', 'image/jpeg');
        ctx.body = imgBuffer;
        return ctx;
    }


}

export default UserController;
