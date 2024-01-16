import {Middleware, ExpressErrorMiddlewareInterface} from 'routing-controllers';

//在错误之后执行
@Middleware({type: 'after'})
export class CustomErrorHandler implements ExpressErrorMiddlewareInterface {
    error(error: any, request: any, response: any, next: (err: any) => any) {
        console.log('do something...');
        // 你可以在这里做任何事情 例如记录错误日志等等
        next(error);
    }
}


