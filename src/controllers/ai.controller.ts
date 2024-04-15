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

}

export default AiController;