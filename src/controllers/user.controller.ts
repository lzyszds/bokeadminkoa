import {Controller, Get, Post, Param, Ctx} from "routing-controllers";
import userService from "../service/user.service";

@Controller("/api")
class UserController {
    //获取用户列表
    @Get("/getUserList")
    public getAll(search: string = "", pages: string = "1", limit: string = "10") {
        return userService.getUserList(search, pages, limit);
    }

    //获取随机头像
    @Get("/getRandHeadImg")
    public getRandHeadImg(@Ctx() ctx: any) {
        return userService.getRandHeadImg(ctx);
    }

    //获取用户信息
    @Get("/getUserInfo/:uid")
    public getUserInfo(@Param("uid") uid: string) {
        return userService.getUserInfo(uid);
    }

    //登录
    @Post("/login")
    public login(@Ctx() ctx: any) {
        return userService.login(ctx);
    }

}

export default UserController;