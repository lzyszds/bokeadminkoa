//文章接口
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
    public findAll(search: string = "%%", pages: string | number = 1, limit: string | number = 10) {
        return new Promise<any>(async (resolve, reject) => {
            let sql: string = `
            SELECT a.aid, a.create_date, a.title,  a.modified_date, a.cover_img, a.comments_count, a.partial_content, a.access_count, wb_users.uname, wb_users.head_img
            FROM wb_articles AS a
            JOIN wb_users ON a.uid = wb_users.uid
            WHERE a.title LIKE ?  OR a.partial_content LIKE ? 
            ORDER BY aid DESC
            LIMIT ?, ? 
        `;
            const offset: number = (Number(pages) - 1) * Number(limit);
            try {
                const result = await db.query(sql, [search, search, offset, Number(limit)]);
                if (result.length === 0) resolve([])
                else {
                    result.forEach((item: any, index: number) => {
                        //将时间转换为时间戳
                    })
                }
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
                        item.tags = a.map((item: any) => item.name)
                        if (index === result.length - 1) resolve(result)
                    })
                })
            } catch (e) {
                reject(e)
            }
        })
    }

    //获取文章信息
    public async findArticleInfo(id: string) {
        return new Promise<any>(async (resolve, reject) => {
            //更新文章访问量
            const sqlAccess: string = `
                UPDATE wb_articles
                SET access_count = access_count + 1
                WHERE aid = ?
            `
            await db.query(sqlAccess, [id]);
            let sql: string = `
                SELECT a.aid, a.create_date, a.title, a.content,a.main, a.modified_date, a.cover_img, a.comments_count,
                a.partial_content, a.access_count, wb_users.uname, wb_users.head_img, wb_users.create_date,
                wb_users.signature
                FROM wb_articles AS a
                JOIN wb_users ON a.uid = wb_users.uid
                WHERE a.aid = ?
            `;
            const result = await db.query(sql, [id, id]);
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
                    result[0].tags = a.map((item: any) => item.name)
                    resolve(result[0])
                })
            }
        })

    }

    // //更新文章访问量
    // public async updateArticleAccessCount(id: string) {
    //     let sql: string = `
    //         UPDATE wb_articles
    //         SET access_count = access_count + 1
    //         WHERE aid = ?
    //     `;
    //     return await db.query(sql, [id]);
    // }

    //获取文章类型列表
    public async findArticleTypeAll() {
        let sql: string = `
            SELECT *
            FROM wb_articlestype 
            WHERE whether_use = 1
        `;
        return await db.query(sql, []);
    }

    //根据文章类型获取文章类型id
    public async getArticleTypeByName(name: string) {
        let sql: string = `
            SELECT type_id
            FROM wb_articlestype 
            WHERE name = ?
        `;
        return await db.query(sql, [name]);
    }

    //将文章id和文章类型id插入到文章类型表
    public async addArticleTypeByAid(type_id: string, aid: string) {
        let sql: string = `
            INSERT INTO wb_articles_types (type_id, aid) 
            VALUES (?, ?)
        `;
        return await db.query(sql, [type_id, aid]);
    }

    //新增文章
    public async addArticle(params: any) {
        const {title, content, cover_img, main, partial_content, uid, create_date} = params;
        let sql: string = `
            INSERT INTO wb_articles (title, content, cover_img, main, partial_content, uid, create_date) 
            VALUES (?, ?, ?, ?, ?, ?, ?)
        `;
        return await db.query(sql, [title, content, cover_img, main, partial_content, uid, create_date]);
    }

    //修改文章
    public async updateArticle(params: any) {
        let sqlSetFieldArr: string[] = []
        let sqlQueryArr: string[] = []
        Object.keys(params).forEach((key: string) => {
            if (params[key] == undefined || !params[key] || key === 'tags') {
                delete params[key]
            } else {
                //修改了什么就更新什么
                sqlSetFieldArr.push(`${key} = ?`)
                sqlQueryArr.push(params[key])
            }
        })
        let sqlSetField: string = sqlSetFieldArr.join(',')
        //修改时间
        sqlSetField += ', modified_date = NOW()'
        let sql: string = `
            UPDATE wb_articles
            SET ${sqlSetField}
            WHERE aid = ?
        `;
        sqlQueryArr.push(params.aid)
        return await db.query(sql, sqlQueryArr);
    }

    //新增文章类型
    public async addArticleType(name: string) {
        let sql: string = `
            INSERT INTO wb_articlestype (name, whether_use) 
            VALUES (?, ?)
        `;
        let result
        try {
            result = await db.query(sql, [name, 1]);
        } catch (e) {
            result = e
        }
        return result;
    }

    //删除文章类型
    public async deleteArticleType(type_id: string) {
        let sql: string = `
            DELETE FROM wb_articlestype
            WHERE type_id = ?
        `;
        return await db.query(sql, [type_id]);
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

    //获取所有评论
    public async getAllComment() {
        let sql: string = `
            SELECT *
            FROM wb_comments 
        `;
        return await db.query(sql, []);
    }

    //新增评论
    public async addComment(params: any) {
        const {content, aid, replyId, groundId, email, name, userIp, img, nowDate} = params;
        let sql: string = `
            INSERT INTO wb_comments (content, article_id, reply_id, ground_id , email, user_name, user_ip, head_img, time)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
        `;
        return await db.query(sql, [content, aid, replyId, groundId, email, name, userIp, img, nowDate]);
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
}


export default new ArticleMapper();