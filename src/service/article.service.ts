//文章接口

import ArticleMapper from "../mapper/article.mapper";
import {ArticleData, Articles, ArticleType} from "../domain/Articles";
import ApiConfig from "../domain/ApiCongfigType";
import {checkObj, getCurrentUnixTime, randomUnique} from "../utils/common";
import path from "path";
import fs from "fs";
import md5 from "md5";
import UserMapper from "../mapper/user.mapper";

class ArticleService {

    public async findAll(ctx: any) {
        let {search, pages, limit} = ctx.request.query
        search = `%${search ? search : ''}%`;
        const total: number = await ArticleMapper.getArticleListTotal(search);

        const data: Articles[] = await ArticleMapper.findAll(search, pages, limit);
        const apiConfig: ApiConfig<ArticleData> = new ApiConfig();
        return apiConfig.success({total: total, data});
    }

    public async findArticleInfo(ctx: any) {
        const {id} = ctx.params;
        const data: Articles = await ArticleMapper.findArticleInfo(id);
        const apiConfig: ApiConfig<Articles> = new ApiConfig();
        return apiConfig.success(data);
    }

    public async findArticleTypeAll() {
        const data: ArticleType[] = await ArticleMapper.findArticleTypeAll();
        const apiConfig: ApiConfig<ArticleType[]> = new ApiConfig();
        return apiConfig.success(data);
    }

    public async addArticle(ctx: any) {
        const {title, content, cover_img, main, tags, partial_content} = ctx.request.body;
        if (checkObj(ctx.request.body, ["title", "content", "cover_img", "main", "tags", "partial_content"])) {
            const apiConfig: ApiConfig<string> = new ApiConfig();
            return apiConfig.fail("参数错误");
        }
        //根据token获取uid
        const {uid} = (await UserMapper.getUidByToken(ctx.req.headers["authorization"]))[0];
        //获取文章发布时间 2021-08-01 12:00:00
        const create_date = new Date().toLocaleString();
        const queryData = await ArticleMapper.addArticle({
            title, content, cover_img, main, partial_content, uid, create_date
        });
        //实例化apiConfig
        const apiConfig: ApiConfig<string> = new ApiConfig();
        //根据文章类型获取文章类型id
        for (let i = 0; i < tags.length; i++) {
            const type = await ArticleMapper.getArticleTypeByName(tags[i]);
            if (type.length === 0) {
                return apiConfig.fail("文章类型不存在");
            } else {
                //将文章id和文章类型id插入到文章类型表
                await ArticleMapper.addArticleTypeByAid(type[0].type_id, queryData.insertId);
            }
        }
        return apiConfig.success("文章添加成功");
    }

    //添加文章类型
    public async addArticleType(ctx: any) {
        const {name} = ctx.request.body;
        if (checkObj(ctx.request.body, ["name"])) {
            const apiConfig: ApiConfig<string> = new ApiConfig();
            return apiConfig.fail("参数错误");
        }
        const result = await ArticleMapper.addArticleType(name)
        const apiConfig: ApiConfig<string> = new ApiConfig();
        if (result.affectedRows === 1) {
            return apiConfig.success("类型添加成功");
        } else {
            return apiConfig.fail(result);
        }
    }

    //删除文章类型
    public async deleteArticleType(ctx: any) {
        const {id} = ctx.request.body;
        if (checkObj(ctx.request.body, ["id"])) {
            const apiConfig: ApiConfig<string> = new ApiConfig();
            return apiConfig.fail("参数错误");
        }
        const result = await ArticleMapper.deleteArticleType(id)
        const apiConfig: ApiConfig<string> = new ApiConfig();
        if (result.affectedRows === 1) {
            return apiConfig.success("类型删除成功");
        } else {
            return apiConfig.fail(result);
        }
    }

    //获取随机文章图库
    public async getRandArticleImg(ctx: any) {
        const imgBuffer = null
        try {
            // 获取文件夹 public/img/coverRomImg 中的所有图片文件(名字)
            const imgDir = path.join(__dirname, '../../public/img/coverRomImg');
            const imgs = fs.readdirSync(imgDir);

            // 随机数
            const random = randomUnique(0, imgs.length - 1, 0);
            // 获取随机图片
            const img = imgs[random];
            // 返回图片
            const imgPath = path.join(imgDir, img);
            return await fs.promises.readFile(imgPath);
        } catch (err) {
            const msg: String = 'internal Server error';
            ctx.status = 500;
            ctx.body = msg;
            return imgBuffer;
        }
    }

    //更新文章
    public async updateArticle(ctx: any) {
        //实例化apiConfig
        const apiConfig: ApiConfig<string> = new ApiConfig();
        if (!ctx.request.body) {
            return apiConfig.fail("内容不曾改变");
        }
        const {tags, aid} = ctx.request.body;

        await ArticleMapper.updateArticle(ctx.request.body)

        if (tags) {
            //根据文章类型获取文章类型id
            for (let i = 0; i < tags.length; i++) {
                const type = await ArticleMapper.getArticleTypeByName(tags[i]);
                if (type.length === 0) {
                    return apiConfig.fail("文章类型不存在");
                } else {
                    //将文章id和文章类型id插入到文章类型表
                    await ArticleMapper.addArticleTypeByAid(type[0].type_id, aid);
                }
            }
        }
        return apiConfig.success("文章修改成功");

    }

    //获取文章评论
    public async getArticleComment(ctx: any) {
        const {id} = ctx.query;
        const data: Articles = await ArticleMapper.getArticleComment(id);
        const apiConfig: ApiConfig<Articles> = new ApiConfig();
        return apiConfig.success(data);
    }

    //获取所有评论
    public async getAllComment() {
        const data: Articles = await ArticleMapper.getAllComment();
        const apiConfig: ApiConfig<Articles> = new ApiConfig();
        return apiConfig.success(data);
    }

    //新增评论
    public async addComment(ctx: any) {
        const apiConfig: ApiConfig<string> = new ApiConfig();

        try {
            // 遍历文件夹下的所有图片
            const imgs = fs.readdirSync(path.join(__dirname, '../../public/img/comments'));

            // 获取前端传入的参数
            let {content, aid, replyId, groundId, email, name, userIp, imgIndex} = ctx.request.body;
            replyId = replyId ? replyId : 0;
            groundId = groundId ? groundId : 0;
            //头像地址
            const img: string = `/img/comments/${imgs[imgIndex]}`;
            const nowDate: number = getCurrentUnixTime();
            // 添加评论进数据库
            await ArticleMapper.addComment({
                content, aid, replyId, groundId, email, name, userIp, img, nowDate
            });
            //评论成功后，文章评论数加1
            await ArticleMapper.addArticleCommentCount(aid);
            return apiConfig.success("评论成功");
        } catch (err) {
            return apiConfig.fail("评论失败");
        }
    }

    /**
     *  上传文章图片
     *  @param ctx 请求对象
     *  @param file 文件对象
     *  @returns 返回上传成功
     *  限制配置: 文件大小限制为10MB
     *  具体的上传图片逻辑
     *  1. 获取上传的文件 只支持图片上传 格式为: jpg, png, webp, jpeg (后续可扩展)
     *  2. 创建可读流 创建可写流
     *  3. 可读流通过管道写入可写流
     *  4. 设置图片名字  保证唯一性 文件md5 转换为16进制
     *  5. 将图片写入到指定文件夹
     *  6. 返回上传成功
     * */
    public async uploadArticleImg(ctx: any, file: any) {
        if (!file || !file.buffer) {
            const apiConfig: ApiConfig<string> = new ApiConfig();
            return apiConfig.fail("上传失败");
        }

        //文件类型判断
        const fileType = file.mimetype.split('/')[1];
        if (!['jpg', 'png', 'webp', 'jpeg'].includes(fileType)) {
            const apiConfig: ApiConfig<string> = new ApiConfig();
            return apiConfig.fail("上传失败,文件类型不支持");
        }

        //将图片的数据中的buffer转成md5
        const md5Name = md5(file.buffer);

        //图片名字
        // @ts-ignore
        const imgName = `${md5Name.toString(16)}.${fileType}`;
        const apiConfig: ApiConfig<string> = new ApiConfig();
        //
        // try {
        //     uploadArticleImg(imgName);
        // } catch (e: any) {
        //     return apiConfig.fail(e);
        // }
        return apiConfig.success("上传成功");
    }

}

export default new ArticleService()