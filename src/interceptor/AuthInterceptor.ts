// interceptor/AuthInterceptor.ts

import {Interceptor, InterceptorInterface, Action} from "routing-controllers";

@Interceptor()
export class AuthInterceptor implements InterceptorInterface {

    intercept(action: Action, result: any): any | Promise<any> {
        // 在这里进行身份验证逻辑
        // 检查请求头或参数中是否包含有效的Token

        const token = action.request.headers["authorization"];
        // console.log(token)
        // 在这里可以进行Token验证逻辑，例如检查Token的有效性
        // 如果验证失败，可以抛出一个异常，例如 UnauthorizedError
        // if (!isValidToken(token)) {
        //    throw new UnauthorizedError("Invalid Token");
        // }

        // 如果验证通过，可以继续处理请求
        return result;
    }
}
