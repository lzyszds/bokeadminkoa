//文章接口

import {Controller, Get, Param} from "routing-controllers";
import {BaseContext} from "koa";
import db from "../utils/db";

class ArticleMapper {

    //获取文章列表总数
    public async getArticleListTotal(search: string): Promise<number> {
        let sql: string = `
            SELECT COUNT(*) as total 
            FROM wb_articles 
            WHERE title LIKE ? OR  partial_content LIKE ? 
        `;
        const total = await db.query(sql, [search, search, search]);
        return total[0].total;
    }

    //获取文章列表
    public findAll(search: string, pages: string, limit: string) {
        return new Promise<any>(async (resolve, reject) => {
            let sql: string = `
            SELECT a.aid, a.create_date, a.title, a.content, a.modified_date, a.cover_img, a.comments_count, a.partial_content, a.access_count, wb_users.uname, wb_users.head_img, wb_users.create_date
            FROM wb_articles AS a
            JOIN wb_users ON a.uid = wb_users.uid
            WHERE a.title LIKE ?  OR a.partial_content LIKE ? 
            ORDER BY aid LIMIT ?, ?
        `;
            const offset: number = (Number(pages) - 1) * Number(limit);
            const result = await db.query(sql, [search, search, offset, Number(limit)]);
            result.forEach((item: any, index: number) => {
                //根据文章aid查询文章类型
                let sqlChild: string = `
                    SELECT wb_articlestype.name
                    FROM wb_articles_types
                    JOIN wb_articlestype ON wb_articles_types.type_id = wb_articlestype.type_id
                    WHERE wb_articles_types.aid = ?
                `
                //获取文章类型
                db.query(sqlChild, [item.aid]).then(a => {
                    item.wtype = a.map((item: any) => item.name)
                    if (index === result.length - 1) resolve(result)
                })
            })
        })
    }

    //获取文章信息
    public async findArticleInfo(id: string) {
        return new Promise<any>(async (resolve, reject) => {
            let sql: string = `
                SELECT a.aid, a.create_date, a.title, a.content,a.main, a.modified_date, a.cover_img, a.comments_count,
                a.partial_content, a.access_count, wb_users.uname, wb_users.head_img, wb_users.create_date,
                wb_users.signature
                FROM wb_articles AS a
                JOIN wb_users ON a.uid = wb_users.uid
                WHERE a.aid = ?
            `;
            const result = await db.query(sql, [id]);
            if (result.length === 0) {
                resolve(null)
            } else {
                //根据文章aid查询文章类型
                let sqlChild: string = `
                    SELECT wb_articlestype.name
                    FROM wb_articles_types
                    JOIN wb_articlestype ON wb_articles_types.type_id = wb_articlestype.type_id
                    WHERE wb_articles_types.aid = ?
                `
                //获取文章类型
                db.query(sqlChild, [id]).then(a => {
                    result[0].wtype = a.map((item: any) => item.name)
                    resolve(result[0])
                })
            }
        })

    }

    //获取文章类型列表
    public async findArticleTypeAll() {
        let sql: string = `
            SELECT *
            FROM wb_articlestype 
            WHERE whether_use = 1
        `;
        return await db.query(sql, []);
    }

    //新增文章
    public async addArticle(title: string, content: string, coverImg: string, comNumber: string, main: string, partial_content: string) {
        let sql: string = `
            INSERT INTO wb_articles (title, content, coverImg, comNumber, main,  partial_content) 
            VALUES (?, ?, ?, ?, ?, ?, ?)
        `;
        return await db.query(sql, [title, content, coverImg, comNumber, main, partial_content]);
    }

    //新增文章类型
    public async addArticleType(name: string, whether_use: string) {
        let sql: string = `
            INSERT INTO wb_articlestype (name, whether_use) 
            VALUES (?, ?)
        `;
        let result
        try {
            result = await db.query(sql, [name, whether_use]);
        } catch (e) {
            result = e
        }
        return result;
    }

    //获取文章评论
    public async getArticleComment(id: string) {
        let sql: string = `
            SELECT *
            FROM wb_comments 
            WHERE article_id = ?
        `;
        return await db.query(sql, [id]);
    }
}


export default new ArticleMapper();