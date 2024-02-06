import {Controller, Get, Post, Param, Ctx, UploadedFile} from "routing-controllers";
import userService from "../service/user.service";
import {Response} from "koa";
import fileUploadOptions from "../utils/upload";
import ApiConfig from "../domain/ApiCongfigType";

@Controller("/user")
class UserController {
    //获取用户列表
    @Get("/getUserList")
    public getAll(@Ctx() ctx: any) {
        const {search, pages, limit} = ctx.request.query
        return userService.getUserList(search, pages, limit);
    }

    //获取随机头像
    @Get("/getRandHeadImg")
    public getRandHeadImg(@Ctx() ctx: any) {
        return userService.getRandHeadImg(ctx);
    }

    //获取uid用户信息
    @Get("/getUserInfo/:uid")
    public getUserInfo(@Param("uid") uid: string) {
        return userService.getUserInfo(uid);
    }

    //获取uid用户信息
    @Get("/getUserInfoToken")
    public getUserInfoToken(@Ctx() ctx: any) {
        return userService.getUserInfoToken(ctx.req.headers["authorization"]);
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

    // //上传用户头像
    @Post("/uploadHeadImg")
    public uploadHeadImg(@UploadedFile("headImg", {
        options: fileUploadOptions("uploadHead")
    }) file: Express.Multer.File) {
        const apiConfig: ApiConfig<string> = new ApiConfig();
        return apiConfig.success("/img/uploadHead/" + file.filename);
    }
}

export default UserController;