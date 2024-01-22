//文章接口

import {Controller, Get, Param} from "routing-controllers";
import {BaseContext} from "koa";
import db from "../utils/db";

class ArticleMapper {

    public async getArticleListTotal(search: string): Promise<number> {
        let sql: string = `
            SELECT COUNT(*) as total 
            FROM wb_articles 
            WHERE title LIKE ? OR  partial_content LIKE ? 
        `;
        const total = await db.query(sql, [search, search, search]);
        return total[0].total;
    }

    public async findAll(search: string, pages: string, limit: string) {
        let sql: string = `
            SELECT *
            FROM wb_articles 
            WHERE title LIKE ?  OR partial_content LIKE ? 
            ORDER BY uid LIMIT ?, ?
        `;
        const offset: number = (Number(pages) - 1) * Number(limit);
        return await db.query(sql, [search, search, offset, Number(limit)]);
    }

    public async findArticleTypeAll() {
        let sql: string = `
            SELECT *
            FROM wb_articlestype 
            WHERE whether_use = 1
        `;
        return await db.query(sql, []);
    }

    public async addArticle(title: string, content: string, coverImg: string, comNumber: string, main: string, partial_content: string) {
        let sql: string = `
            INSERT INTO wb_articles (title, content, coverImg, comNumber, main,  partial_content) 
            VALUES (?, ?, ?, ?, ?, ?, ?)
        `;
        return await db.query(sql, [title, content, coverImg, comNumber, main, partial_content]);
    }

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
}


export default new ArticleMapper();