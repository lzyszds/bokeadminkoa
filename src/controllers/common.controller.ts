import {Controller, Ctx, Get} from "routing-controllers";
import CommonService from "../service/common.service";

@Controller("/common")
class CommonController {

//天气预报以及ip地址查询
    @Get("/jinrishici/info")
    public async getWeather(@Ctx() ctx: any) {
        return CommonService.getWeather(ctx);
    }
}

export default CommonController;