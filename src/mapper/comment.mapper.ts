import { AdminHomeType, AdminHomeTypeSql } from "../domain/AdminHomeType";
import db from "../utils/db";
import { SystemConfigType } from "../domain/CommonType";
import { OkPacket } from "mysql";
import { CommentType } from "../domain/CommentType";

class CommentMapper {
    //获取文章评论
    public async getArticleComment(id: string) {
        let sql: string = `
            SELECT *
            FROM wb_comments 
            WHERE article_id = ?
        `;
        return await db.query(sql, [id]);
    }

    //获取所有评论
    public async getAllComment(search: string, pages: string, limit: string) {
        const offset: number = (Number(pages) - 1) * Number(limit);

        let sql: string = `
            SELECT *
            FROM wb_comments
            WHERE content LIKE ? OR user_name LIKE ? OR email LIKE ? OR user_ip LiKE ?
            ORDER BY comment_id DESC LIMIT ?, ?
        `;
        return await db.query(sql, [search, search, search, search, offset, Number(limit)]);
    }

    //新增评论
    public async addComment(params: any) {
        const {
            content,
            aid,
            replyId,
            groundId,
            email,
            name,
            userIp,
            img,
            nowDate,
            deviceSystem,
            browserSystem
        } = params;
        let sql: string = `
            INSERT INTO wb_comments (content, article_id, reply_id, ground_id , email, user_name, user_ip, head_img, time,deviceSystem,browserSystem)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `;
        return await db.query(sql, [content, aid, replyId, groundId, email, name, userIp, img, nowDate, deviceSystem, browserSystem]);
    }

    //新增文章评论数
    public async addArticleCommentCount(id: string) {
        let sql: string = `
            UPDATE wb_articles
            SET comments_count = comments_count + 1
            WHERE aid = ?
        `;
        return await db.query(sql, [id]);
    }

    //删除评论
    public async deleteComment(id: string) {
        let sql: string = `
            DELETE FROM wb_comments
            WHERE cid = ?
        `;
        return await db.query(sql, [id]);
    }

    //获取最新评论
    public async getNewComment(limit: number): Promise<CommentType[]> {
        let sql: string = `
            SELECT *
            FROM wb_comments 
            ORDER BY time DESC
            LIMIT 0, ?
        `;
        return await db.query(sql, [limit]);
    }

}

export default new CommentMapper();
