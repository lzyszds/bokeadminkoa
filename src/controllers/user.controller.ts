import {Controller, Get, Post, Param, Ctx} from "routing-controllers";
import userService from "../service/user.service";
import {Response} from "koa";

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

    //新增用户账号
    @Post("/addUser")
    public addUser(@Ctx() ctx: any) {
        return userService.addUser(ctx);
    }

    //修改用户信息
    @Post("/updateUser")
    public updateUser(@Ctx() ctx: any) {
        // return ""
        return userService.updateUser(ctx);
    }

    //删除用户
    @Post("/deleteUser")
    public deleteUser(@Ctx() ctx: any) {
        return userService.deleteUser(ctx);
    }

    //上传用户头像
    @Post("/uploadHeadImg")
    public uploadHeadImg(@Ctx() ctx: Response) {
        return userService.uploadHeadImg(ctx);
    }


}

export default UserController;