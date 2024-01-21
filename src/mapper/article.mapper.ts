//文章接口

import {Controller, Get, Param} from "routing-controllers";
import {BaseContext} from "koa";
import db from "../utils/db";

class ArticleMapper {

    public async getArticleListTotal(search: string): Promise<number> {
        let sql: string = `
            SELECT COUNT(*) as total 
            FROM wb_articles 
            WHERE title LIKE ? OR wtype LIKE ? OR coverContent LIKE ? 
        `;
        const total = await db.query(sql, [search, search, search, search]);
        return total[0].total;
    }

    public async findAll(search: string, pages: string, limit: string) {
        let sql: string = `
            SELECT *
            FROM wb_articles 
            WHERE title LIKE ? OR wtype LIKE ? OR coverContent LIKE ? 
            ORDER BY uid LIMIT ?, ?
        `;
        const offset: number = (Number(pages) - 1) * Number(limit);
        return await db.query(sql, [search, search, search, offset, Number(limit)]);
    }


}

export default new ArticleMapper();