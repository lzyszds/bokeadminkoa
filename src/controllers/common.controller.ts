import {Controller, Ctx, Get, Post} from "routing-controllers";
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
    public getSystemConfig() {
        return CommonService.getSystemConfig();
    }

    //新增系统配置
    @Post("/addSystemConfig")
    public addSystemConfig(@Ctx() ctx: any) {
        return CommonService.addSystemConfig(ctx);
    }

    //获取页脚信息数据
    @Get("/getFooterInfo")
    public getFooterInfo() {
        return CommonService.getFooterInfo();
    }

    //GPT3.5开放ai
    // @Post("/getAifox")
    // public getAifox(@Ctx() ctx: any) {
    //     return CommonService.getAifox(ctx);
    // }

}

export default CommonController;