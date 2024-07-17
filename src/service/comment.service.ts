import ApiConfig from "../domain/ApiCongfigType";
import path from "path";
import fs from "fs";
import IP2Region, { IP2RegionResult } from "ip2region"

import { ArticleData, Articles } from "../domain/Articles";
import { getCurrentUnixTime, parseUserAgent } from "../utils/common";
import CommentMapper from "../mapper/comment.mapper";
import { CommentType } from "../domain/CommentType";

class CommentService {

    //获取文章评论
    public async getArticleComment(ctx: any) {
        const { id } = ctx.query;
        const data: Articles = await CommentMapper.getArticleComment(id);
        const apiConfig: ApiConfig<Articles> = new ApiConfig();
        return apiConfig.success(data);
    }

    //获取所有评论
    public async getAllComment(search: string, pages: string, limit: string) {
        search = `%${search}%`;

        const data: CommentType[] = await CommentMapper.getAllComment(search, pages, limit);
        const apiConfig: ApiConfig<ArticleData<CommentType[]>> = new ApiConfig();
        return apiConfig.success({ total: data.length, data });
    }

    //新增评论
    public async addComment(ctx: any) {
        const apiConfig: ApiConfig<string> = new ApiConfig();

        try {
            // 遍历文件夹下的所有图片
            const imgs = fs.readdirSync(path.join(__dirname, '../../public/img/comments'));

            // 获取前端传入的参数
            let { content, aid, replyId, groundId, email, name, imgIndex } = ctx.request.body;
            // 获取用户ip
            const userIp = ctx.request.headers['x-real-ip'] || ctx.request.ip.replace('::ffff:', '')
            //根据用户ip获取用户地址
            // 创建一个 IP2Region 对象
            const query: IP2Region = new IP2Region();
            // 查询 IP 地址的归属地
            const res: IP2RegionResult | null = query.search(userIp);

            //获取评论人的系统信息
            const agent = ctx.request.headers['user-agent'];
            //获取设备系统
            const { browserSystem, deviceSystem } = parseUserAgent(agent);
            replyId = replyId ? replyId : 0;
            groundId = groundId ? groundId : 0;
            //头像地址
            const img: string = `/img/comments/${imgs[imgIndex]}`;
            const nowDate: number = getCurrentUnixTime();
            // 添加评论进数据库
            await CommentMapper.addComment({
                content, aid, replyId, groundId, email, name, userIp: res?.province + "" + res?.city, img, nowDate,
                deviceSystem, browserSystem
            });
            //评论成功后，文章评论数加1
            await CommentMapper.addArticleCommentCount(aid);
            return apiConfig.success("评论成功");
        } catch (err) {
            return apiConfig.fail("评论失败");
        }
    }

    //删除评论
    public async deleteComment(ctx: any) {
        const apiConfig: ApiConfig<string> = new ApiConfig();
        try {
            const { ids } = ctx.request.body;
            // 删除评论
            await CommentMapper.deleteComment(ids);
            return apiConfig.success("删除成功");
        } catch (e: any) {
            return apiConfig.fail(e.message);
        }
    }

    public async getNewComment(ctx: any): Promise<ApiConfig<CommentType[]>> {
        // 创建一个 ApiConfig 对象
        const apiConfig: ApiConfig<CommentType[]> = new ApiConfig();
        try {
            const { limit } = ctx.query;
            // 获取最新评论
            const data: CommentType[] = await CommentMapper.getNewComment(Number(limit));

            return apiConfig.success(data)
        } catch (e: any) {
            console.log(e)
            return apiConfig.fail(e.message)
        }
    }
}

export default new CommentService();
