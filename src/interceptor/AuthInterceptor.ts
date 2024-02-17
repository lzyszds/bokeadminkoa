// interceptor/AuthInterceptor.ts

import {Interceptor, InterceptorInterface, Action, UnauthorizedError} from "routing-controllers";
import userMapper from "../mapper/user.mapper";
import Config from "../../config"

@Interceptor()
export class AuthInterceptor implements InterceptorInterface {

    async intercept(action: Action, result: any): Promise<any> {
        // 在这里进行身份验证逻辑
        // 检查请求头或参数中是否包含有效的Token


        //获取当前请求的接口url
        const url = action.request.url
        //设置不需要拦截token验证的接口
        const notIntercept = Config.interceptorWhiteList
        // 判断当前请求的接口是否需要验证token
        if (!notIntercept.includes(url)) {
            //获取当前用户的token
            const authorization = action.request.headers["authorization"]
            if (!authorization) {
                return "未登录"
            }
            const token = authorization.replace("Bearer ", "");
            if (!token) {
                return {
                    code: 401,
                    msg: "未登录"
                }
            } else {
                const user = await userMapper.verifyToken(token)
                if (!user) {
                    return {
                        code: 401,
                        msg: "登录过期"
                    }
                } else {
                    return result
                }
            }
        }

        // 如果验证通过，可以继续处理请求
        return result
    }
}
