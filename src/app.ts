import "reflect-metadata"
import {useKoaServer} from "routing-controllers"
import Config from "../config"
import koa = require('koa')
import KoaStatic from 'koa-static'
import mount from 'koa-mount'
import session from 'koa-session'
import CONFIG from "./utils/session";

// const socket = require('socket.io')(1022, {cors: true})


//执行定时任务 获取github数据
import __src_utils_setTimeTask from "./tools/setTimeTask";
import path from "path";
import chatGpt from "./utils/chatGpt";

__src_utils_setTimeTask();

const app = new koa()


app.keys = ['session app keys'];
app.use(session(CONFIG, app));

//@ts-ignore
global.config = Config

//根据当前文件名字的后缀名字来判断当前是开发环境还是生产环境 开发环境为.ts 生产环境为.js
const currentEnv = path.extname(__filename)

useKoaServer(app, {
    controllers: [__dirname + "/controllers/*" + currentEnv],
    middlewares: [__dirname + "/middlewares/*" + currentEnv],
    interceptors: [__dirname + "/interceptor/*" + currentEnv],
})

//默认路由 /
app.use(async (ctx, next) => {
    if (ctx.url === '/') {
        //返回holloworld
        ctx.body = "hello world"
    } else {
        await next()
    }
})

// const userSocket = new Map()

// // 监听用户连接
// socket.on('connection', (client: any) => {
//     console.log('用户已连接');
//
//     // 监听用户发送的消息
//     client.on('message', (msg: any) => {
//         console.log('收到消息:', msg);
//
//         // 向所有连接的用户发送消息
//         socket.emit('message', msg);
//
//         //记录用户首次连接
//         userSocket.set(msg, client.id)
//         console.log(userSocket)
//     });
//
//     // 用户断开连接时
//     client.on('disconnect', () => {
//         console.log('用户已断开连接');
//     });
// });

chatGpt().then(res => {
    return res.json()
}).then(res => {
    console.log(res)
})
console.log()

// 静态资源
app.use(mount("/public", KoaStatic(Config.staticDir)))


app.listen(Config.port, () => {
    console.log("server is running at http://localhost:1020")
})
