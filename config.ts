/*
 * @Description: 全局配置信息
 */
import path from 'path';


export default {
    port: 1020, // 启动端口
    staticDir: path.resolve('./public'), // 静态资源路径
    uploadDir: path.join(__dirname, path.resolve('public/')), // 上传文件路径
    weatherKey: "78182b9b39355dc0ae4ce91dae7f0bbf",
    // 数据库连接设置
    dbConfig: {
        connectionLimit: 10,
        host: 'localhost',
        port: 3306,
        user: 'root',
        password: '123456',
        database: 'lzy_admin'
    },
    //拦截器白名单
    interceptorWhiteList: [
        '/user/login',
        '/user/getRandHeadImg',
        '/article/getRandArticleImg',
        '/article/getArticleList',
        '/article/getArticleInfo',
        '/article/getArticleTypeList',
        '/common/ipConfig'
    ],
    //github api密钥 配置
    githubUserConfig: {
        token1: 'github_pat_',
        token2: '11APYO7PI021pjfuHxWKPA_',
        token3: 'JBLdpwspK6s67u1P5levoDgdRxkFHhQcG6jX5q1ONRpRNUREZTPzW2kqpI7',
        name: 'lzyszds',
    },
}


