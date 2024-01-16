//文章接口

import {Controller, Get, Param} from "routing-controllers";
import {BaseContext} from "koa";

@Controller()
class ArticleController {
    @Get("/list")
    public async getAll() {
        return "This action returns all articles"
    }
}

export default ArticleController;