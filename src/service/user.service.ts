import userMapper from "../mapper/user.mapper";
import ApiConfig from "../domain/ApiCongfigType";
import {User, UserData, UserRole, UserRoleData} from "../domain/User";
import fs from "fs";
import path from "path";
import {randomUnique, checkObj} from "../utils/common";
import {hashPassword, comparePasswords,} from "../utils/passwordUtils";
import {generateToken, verifyToken} from "../utils/authUtils";
import {dbErrorMessage} from "../utils/dbErrorMessage";
import {OkPacket} from "mysql";
import {Response} from "koa";


class UserService {

    // 定义一个控制器方法，返回类型是 Promise<ApiConfig<UserData>>
    public async getUserList(search: string = "", pages: string = "1", limit: string = "10"): Promise<ApiConfig<UserRoleData>> {
        search = `%${search}%`;
        // 调用 userMapper.getUserListTotal 方法获取符合搜索条件的用户总数
        const total: number = await userMapper.getUserListTotal(search);
        // 调用 userMapper.getUserList 方法获取符合搜索条件的用户列表
        const data: UserRole[] = await userMapper.getUserList(search, pages, limit);
        // 创建一个 ApiConfig 对象
        const apiConfig: ApiConfig<UserRoleData> = new ApiConfig<UserRoleData>();
        // 返回一个成功的 ApiConfig 对象，包含用户数据和总数
        return apiConfig.success({total: total, data});
    }


    //  获取随机头像
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

    //  获取uid用户信息
    public async getUserInfo(uid: string): Promise<ApiConfig<UserRole>> {
        // 调用 userMapper.getUserInfo 方法获取用户信息
        const user: UserRole = await userMapper.getUserInfo(uid);
        // 创建一个 ApiConfig 对象
        const apiConfig: ApiConfig<UserRole> = new ApiConfig<UserRole>();
        // 返回一个成功的 ApiConfig 对象，包含用户信息
        return apiConfig.success(user);
    }

    //  通过token获取用户信息
    public async getUserInfoToken(token: string): Promise<ApiConfig<UserRole>> {
        // 调用 userMapper.getUserInfo 方法获取用户信息
        const user: UserRole[] = await userMapper.getUserInfoToken(token);
        // 创建一个 ApiConfig 对象
        const apiConfig: ApiConfig<UserRole> = new ApiConfig<UserRole>();
        // 返回一个成功的 ApiConfig 对象，包含用户信息
        return apiConfig.success(user[0]);
    }

    // 登录
    public async login(ctx: any): Promise<ApiConfig<string>> {
        // 获取请求体中的用户名和密码
        const {username, password} = ctx.request.body;

        //检查用户名和密码是否为空
        if (!username || !password) {
            // 创建一个 ApiConfig 对象
            const apiConfig: ApiConfig<string> = new ApiConfig<string>();
            // 返回一个失败的 ApiConfig 对象，包含提示信息
            return apiConfig.fail("用户名或密码不能为空");
        }

        // 调用 userMapper.login 方法获取用户信息 通过账号获取加密后的密码
        const user: User = await userMapper.inspectUsernameGetPassword(username);
        // 比较密码是否正确
        const isMatch: boolean = await comparePasswords(password, user.password);
        // 创建一个 ApiConfig 对象
        const apiConfig: ApiConfig<string> = new ApiConfig<string>();
        // 如果用户信息存在，说明登录成功
        if (isMatch) {

            //修改用户最后登录时间
            const last_login_date = new Date().toLocaleString();
            await userMapper.updateUser({uid: user.uid, last_login_date})

            // 返回一个成功的 ApiConfig 对象，包含提示信息
            return apiConfig.success(user.activation_key);
        } else {
            // 返回一个失败的 ApiConfig 对象，包含提示信息
            return apiConfig.fail("用户名或密码错误");
        }
    }

    //新增用户账号 逻辑层
    public async addUser(ctx: any): Promise<ApiConfig<string>> {
        //检查 用户名、密码、权限、创建时间、最后登录时间、个性签名、头像、是否启用 是否为空
        if (checkObj(ctx.request.body, ["uname", "username", "signature", "head_img"])) {
            // 创建一个 ApiConfig 对象
            const apiConfig: ApiConfig<string> = new ApiConfig<string>();
            // 返回一个失败的 ApiConfig 对象，包含提示信息
            return apiConfig.fail("请检查内容是否填写完整");
        }
        //获取当前请求来源的ip
        ctx.request.body.create_ip = ctx.request.ip.replace(/::ffff:/, '');
        //初次创建用户，权限默认为 1 ，是否启用默认为 1 ，密码默认为 123456 密码加密
        ctx.request.body.password = await hashPassword("123456");
        ctx.request.body.power = ctx.request.body.power || 1;
        ctx.request.body.whether_use = ctx.request.body.whether_use || 1;
        //生成token
        const {uname, username} = ctx.request.body
        const activation_key = generateToken({uname, username});
        // 获取当前时间
        let create_date = new Date().toLocaleString();
        // 创建一个 ApiConfig 对象
        const apiConfig: ApiConfig<string> = new ApiConfig<string>();
        try {
            // 调用 userMapper.addUser 方法获取用户信息
            const addIfOk: OkPacket = await userMapper.addUser(
                Object.assign(ctx.request.body, {
                    create_date,
                    activation_key
                })
            );
            if (addIfOk.affectedRows >= 0) {
                // 返回一个成功的 ApiConfig 对象，包含提示信息
                return apiConfig.success("添加用户成功");
            } else {
                // 返回一个失败的 ApiConfig 对象，包含提示信息
                return apiConfig.fail("添加用户失败");
            }
        } catch (e: any) {
            const errCn = dbErrorMessage[e.code];
            // 返回一个失败的 ApiConfig 对象，包含提示信息
            return apiConfig.fail(e.code + "->添加用户失败:" + errCn);
        }

    }

    //修改用户信息(管理员) 逻辑层
    public async updateUser(ctx: any): Promise<ApiConfig<string>> {
        // 创建一个 ApiConfig 对象
        const apiConfig: ApiConfig<string> = new ApiConfig<string>();
        //检查参数是否包含 id
        if (checkObj(ctx.request.body, ["uid"], ["uname", "password", "power", "whether_use", "signature", "head_img"])) {
            // 返回一个失败的 ApiConfig 对象，包含提示信息
            return apiConfig.fail("请传入要修改的用户id");
        } else {
            try {
                // 调用 userMapper.updateUser 方法获取用户信息
                const updateIfOk: OkPacket = await userMapper.updateUser(ctx.request.body);
                if (updateIfOk.affectedRows >= 0) {
                    // 返回一个成功的 ApiConfig 对象，包含提示信息
                    return apiConfig.success("修改用户信息成功");
                } else {
                    // 返回一个失败的 ApiConfig 对象，包含提示信息
                    return apiConfig.fail("修改用户信息失败");
                }
            } catch (e: any) {
                const errCn = dbErrorMessage[e.code];
                // 返回一个失败的 ApiConfig 对象，包含提示信息
                return apiConfig.fail(e.code + "->修改用户信息失败:" + errCn);
            }
        }
    }

    //删除用户 逻辑层
    public async deleteUser(ctx: any): Promise<ApiConfig<string>> {
        // 创建一个 ApiConfig 对象
        const apiConfig: ApiConfig<string> = new ApiConfig<string>();
        //检查参数是否包含 id
        if (checkObj(ctx.request.body, ["uid"])) {
            // 返回一个失败的 ApiConfig 对象，包含提示信息
            return apiConfig.fail("请传入要删除的用户id");
        } else {
            try {
                // 调用 userMapper.deleteUser 方法获取用户信息
                const deleteIfOk: OkPacket = await userMapper.deleteUser(ctx.request.body.uid);
                if (deleteIfOk.affectedRows > 0) {
                    // 返回一个成功的 ApiConfig 对象，包含提示信息
                    return apiConfig.success("删除用户成功");
                } else {
                    // 返回一个失败的 ApiConfig 对象，包含提示信息
                    return apiConfig.fail("删除用户失败");
                }
            } catch (e: any) {
                const errCn = dbErrorMessage[e.code];
                // 返回一个失败的 ApiConfig 对象，包含提示信息
                return apiConfig.fail(e.code + "->删除用户失败:" + errCn);
            }
        }
    }

    //上传用户头像
    // public async uploadHeadImg(ctx: any): Promise<ApiConfig<string>> {
    //     // 上传图片的配置
    //     return upload(ctx.req, ctx.res)
    // }


}

export default new UserService();