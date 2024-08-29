/*
 * @Description: 全局配置信息
 */
import path from 'path';


export default {
    port: 1020, // 启动端口
    staticDir: path.join(__dirname, 'public'), // 静态文件目录
    uploadDir: path.join(__dirname, path.resolve('public/')), // 上传文件路径
    weatherKey: "78182b9b39355dc0ae4ce91dae7f0bbf",
    //根据当前文件名字的后缀名字来判断当前是开发环境还是生产环境 开发环境为.ts 生产环境为.js
    env: path.extname(__filename) === '.ts' ? 'development' : 'production',
    // 数据库连接设置
    dbConfig: {
        connectionLimit: 10,
        host: 'localhost',
        port: 3306,
        user: 'root',
        password: 'a395878870',
        database: 'lzy_admin'
    },
    //拦截器白名单
    interceptorWhiteList: [
        '/user/login',
        '/user/getRandHeadImg',
        '/article/getRandArticleImg',
        '/article/getArticleList',
        '/comment/getArticleComment',
        '/article/getArticleInfo',
        '/comment/getArticleTypeList',
        '/comment/addComment',
        '/comment/getNewComment',
        '/common/ipConfig',
        '/common/getGithubInfo',
        '/common/openai',
        '/system/getSystemConfig',
        '/system/getFooterInfo',
        '/system/getLazyLoadImage',
        '/aiService/getAifox',

    ],
    //github api密钥 配置
    githubUserConfig: {
        token1: 'github_pat_',
        token2: '11APYO7PI021pjfuHxWKPA_',
        token3: 'JBLdpwspK6s67u1P5levoDgdRxkFHhQcG6jX5q1ONRpRNUREZTPzW2kqpI7',
        name: 'lzyszds',
    },
}


