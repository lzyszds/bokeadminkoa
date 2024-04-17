import {Controller, Ctx, Get, Post} from "routing-controllers";
import AiService from "../service/ai.service";

// import AiService from "../service/ai.service";

@Controller("/aiService")
class AiController {
    //GPT3.5开放ai
    @Get("/getAifox")
    public getAifox(@Ctx() ctx: any) {
        return AiService.getAifox(ctx);
    }

    //获取ai key列表
    @Get("/getAiKeysList")
    public getAiKeysList(@Ctx() ctx: any) {
        return AiService.getAiKeysList(ctx);
    }

    //新增ai key
    @Post("/addAiKey")
    public addAiKey(@Ctx() ctx: any) {
        return AiService.addAiKey(ctx);
    }

    //删除ai key
    @Post("/deleteAiKey")
    public deleteAiKey(@Ctx() ctx: any) {
        return AiService.deleteAiKey(ctx);
    }


}

export default AiController;