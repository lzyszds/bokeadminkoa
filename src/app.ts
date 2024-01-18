import "reflect-metadata"
import {useKoaServer} from "routing-controllers"
import Config from "../config"
import koa = require('koa')
import KoaStatic from 'koa-static'
import mount from 'koa-mount'
import session from 'koa-session'
import CONFIG from "./utils/session";


const app = new koa()

app.keys = ['session app keys'];
app.use(session(CONFIG, app));


useKoaServer(app, {
    controllers: [__dirname + "/controllers/*.ts"],
    middlewares: [__dirname + '/middlewares/**/*.ts'],
    interceptors: [__dirname + '/interceptor/**/*.ts'],
})
// 静态资源
app.use(mount("/public", KoaStatic(Config.staticDir)))


app.listen(Config.Port, () => {
    console.log("server is running at http://localhost:1020")
})
