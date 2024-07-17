import { Controller, Ctx, Get, Post } from "routing-controllers";
import CommonService from "../service/common.service";

@Controller("/common")
class CommonController {

    //天气预报以及ip地址查询
    @Get("/ipConfig")
    public async getWeather(@Ctx() ctx: any) {
        return CommonService.getWeather(ctx);
    }

    //后台首页数据
    @Get("/getAdminHomeData")
    public getAdminHomeData() {
        return CommonService.getAdminHomeData();
    }

    //获取github 贡献图
    @Get("/getGithubInfo")
    public getGithubInfo() {
        return CommonService.getGithubInfo();
    }

    //获取系统配置
    @Get("/getSystemConfig")
    public getSystemConfig(@Ctx() ctx: any) {
        return CommonService.getSystemConfig(ctx.query.type);
    }
    //获取系统中全部的loadGif图片
    @Get("/getLoadGif")
    public getLoadGif() {
        return CommonService.getLoadGif();
    }
    //图片懒加载的loadGif图片
    @Get("/getLazyLoadGif")
    public async getLazyLoadGif(@Ctx() ctx: any) {
        const imgBuffer = await CommonService.getLazyLoadGif(ctx);;
        ctx.set('Content-Type', 'image/jpeg');
        ctx.body = imgBuffer;
        return ctx;
    }

    //新增系统配置
    @Post("/addSystemConfig")
    public addSystemConfig(@Ctx() ctx: any) {
        return CommonService.addSystemConfig(ctx);
    }

    //更新系统配置
    @Post("/updateSystemConfig")
    public updateSystemConfig(@Ctx() ctx: any) {
        return CommonService.updateSystemConfig(ctx);
    }

    //获取页脚信息数据
    @Get("/getFooterInfo")
    public getFooterInfo() {
        return CommonService.getFooterInfo();
    }

    //更新页脚信息
    @Post("/updateFooterInfo")
    public updateFooterInfo(@Ctx() ctx: any) {
        return CommonService.updateFooterInfo(ctx);
    }


}

export default CommonController;
