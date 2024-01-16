import userMapper from "../mapper/user.mapper";
import ApiConfig from "../domain/ApiCongfigType";
import {User, UserData} from "../domain/User";
import fs from "fs";
import path from "path";
import {randomUnique} from "../utils/common";
import c from "koa-session/lib/context";


class UserService {

    // 定义一个控制器方法，返回类型是 Promise<ApiConfig<UserData>>
    public async getUserList(search: string, pages: string, limit: string): Promise<ApiConfig<UserData>> {
        // 调用 userMapper.getUserListTotal 方法获取符合搜索条件的用户总数
        const total: number = await userMapper.getUserListTotal("%" + search + "%");
        // 调用 userMapper.getUserList 方法获取符合搜索条件的用户列表
        const data: User[] = await userMapper.getUserList("%" + search + "%", pages, limit);
        // 创建一个 ApiConfig 对象
        const apiConfig: ApiConfig<UserData> = new ApiConfig<UserData>();
        // 返回一个成功的 ApiConfig 对象，包含用户数据和总数
        return apiConfig.success({total: total, data});
    }


    // 定义一个控制器方法，返回类型是 Promise<ApiConfig<string>>
    public async getRandHeadImg(ctx: any): Promise<ApiConfig<string>> {
        // 从会话中获取上次保存的随机数，默认为1
        let randomName = ctx.session.randomName || 1;
        // 获取文件夹 public/img/updateImg 中的所有文件
        const files = fs.readdirSync(path.join(__dirname, '../../public/img/updateImg'));
        // 随机获取一张图片，但是要确保和上一次的随机数不一样
        let random = randomUnique(1, files.length - 1, randomName);
        const img = files[random];
        // 记录当前返回的图片的随机数，以便下次不重复
        ctx.session.randomName = random;
        // 创建一个 ApiConfig 对象
        const apiConfig: ApiConfig<string> = new ApiConfig<string>();
        // 返回一个成功的 ApiConfig 对象，包含图片的路径
        return apiConfig.success('/img/updateImg/' + img);
    }

    // 定义一个控制器方法，返回类型是 Promise<ApiConfig<User>>
    public async getUserInfo(uid: string): Promise<ApiConfig<User>> {
        // 调用 userMapper.getUserInfo 方法获取用户信息
        const user: User = await userMapper.getUserInfo(uid);
        // 创建一个 ApiConfig 对象
        const apiConfig: ApiConfig<User> = new ApiConfig<User>();
        // 返回一个成功的 ApiConfig 对象，包含用户信息
        return apiConfig.success(user);
    }

    // 定义一个控制器方法，返回类型是 Promise<ApiConfig<string>>
    public async login(ctx: any): Promise<ApiConfig<string>> {
        // 获取请求体中的用户名和密码
        const {username, password} = ctx.request.body;
        // 调用 userMapper.login 方法获取用户信息
        const user: User = await userMapper.login(username, password);
        // 创建一个 ApiConfig 对象
        const apiConfig: ApiConfig<string> = new ApiConfig<string>();
        // 如果用户信息存在，说明登录成功
        if (user) {
            // 将用户信息保存到会话中
            ctx.session.userInfo = user;
            // 返回一个成功的 ApiConfig 对象，包含提示信息
            return apiConfig.success("登录成功");
        } else {
            // 返回一个失败的 ApiConfig 对象，包含提示信息
            return apiConfig.fail("用户名或密码错误");
        }
    }
}

export default new UserService();