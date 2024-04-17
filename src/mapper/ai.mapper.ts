//文章接口
import db from "../utils/db";
import {AiUc, AiUcKeys} from "../domain/AiType";

class AiMapper {

    //获取Ai使用次数列表总数
    public async findAiListTotal(): Promise<number> {
        let sql: string = `
            SELECT COUNT(*) as total 
            FROM wb_aiuc  
        `;
        const total = await db.query(sql, []);
        return total[0].total;
    }

    //获取Ai使用次数列表
    public async findAiList(pages: number = 1, limit: number = 10): Promise<AiUc[]> {
        let sql: string = `
                SELECT *
                FROM wb_aiuc  
                LIMIT ?, ? 
            `;
        return await db.query(sql, [(pages - 1) * limit, limit])
    }

    //获取指定Ai的key
    public async findAiKey(search: string = "%%", pages: number = 1, limit: number = 10): Promise<AiUcKeys[]> {
        let sql: string = `
            SELECT *
            FROM wb_aiuc_keys  
            WHERE id LIKE ? or keyName LIKE ? or keyValue LIKE ?
            LIMIT ?, ?
        `;
        return await db.query(sql, [search, search, search, (pages - 1) * limit, limit])

    }

    //新增Ai的key
    public async addAiKey(keyName: string, keyValue: string) {
        let sql: string = `
            INSERT INTO wb_aiuc_keys (keyName, keyValue) 
            VALUES (?, ?)
        `;
        return await db.query(sql, [keyName, keyValue]);
    }

    //插入每日Ai使用次数初始化
    public async addAiUc(): Promise<number> {
        let sql: string = ` INSERT INTO wb_aiuc () VALUES () `
        return await db.query(sql, []);
    }

    //删除Ai的key
    public async deleteAiKey(id: string) {
        let sql: string = `
            DELETE FROM wb_aiuc_keys
            WHERE id = ?
        `;
        return await db.query(sql, [id]);
    }

    //修改新增某AiKey的使用次数
    public async updateAiUc(keyName: string, created_at: string) {
        let sql: string = `
            UPDATE wb_aiuc
            SET ${keyName} = ${keyName} + 1
            where created_at like ?
        `;
        return await db.query(sql, [created_at]);
    }
}


export default new AiMapper();