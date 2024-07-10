import { AdminHomeType, AdminHomeTypeSql } from "../domain/AdminHomeType";
import db from "../utils/db";
import { SystemConfigType } from "../domain/CommonType";
import { OkPacket } from "mysql";
import { Footer } from "../domain/FooterType";

class CommonMapper {

    //根据ip地区获取具体的城市编码
    public async getCityCodeByIp(city: string): Promise<{ adcode: string }> {
        const sql: string = `SELECT adcode 
                             FROM wb_map_adcode_citycode
                             WHERE  city = ? `
        const result = await db.query(sql, [city]);
        return result[0];
    }

    //获取后台首页数据
    public async getAdminHomeData(): Promise<AdminHomeType> {
        const sqlObjeck: AdminHomeTypeSql = {
            articleCount: `SELECT COUNT(*) as total FROM wb_articles`,
            articleTypeCount: `SELECT COUNT(*) as total FROM wb_articlestype`,
            commentCount: `SELECT COUNT(*) as total FROM wb_comments`,
            articleAccess: `SELECT SUM(access_count) as total FROM wb_articles`,
            userCount: `SELECT COUNT(*) as total FROM wb_users `,
            hotArticle: `SELECT a.aid, a.create_date, a.title, a.cover_img, a.comments_count, a.partial_content,
                         a.access_count, wb_users.uname, wb_users.head_img 
                         FROM wb_articles AS a 
                         JOIN wb_users ON a.uid = wb_users.uid 
                         ORDER BY access_count DESC LIMIT 0, 6`
        }

        let result: AdminHomeType = {} as AdminHomeType;
        for (let key in sqlObjeck) {
            result[key] = await db.query(sqlObjeck[key], [])
        }

        return result;
    }


    //从数据库获取系统设置配置
    public async getSystemConfig(ids: string): Promise<SystemConfigType[]> {
        const sql: string = `SELECT * FROM wb_system_config where config_id in (?)`
        return await db.query(sql, [ids]);
    }

    //新增系统设置
    public async addSystemConfig(config_key: string, config_value: string, config_desc?: string): Promise<OkPacket> {
        const sql: string = `INSERT INTO wb_system_config (config_key, config_value, config_desc) VALUES (?, ?, ?)`
        return await db.query(sql, [config_key, config_value, config_desc]);
    }

    //更新系统设置
    public async updateSystemConfig(config_key: string, config_value: string, config_id: number): Promise<OkPacket> {
        const sql: string = `UPDATE wb_system_config SET config_value = ?, config_key = ? WHERE config_id = ?`
        return await db.query(sql, [config_value, config_key, config_id]);
    }

    //获取页脚信息
    public async getFooterInfo(): Promise<Footer[]> {
        const sql: string = `SELECT * FROM wb_footer`
        return await db.query(sql, []);
    }

    //更新页脚信息
    public async updateFooterInfo(data: Footer[]): Promise<OkPacket> {

        for (let i = 0; i < data.length; i++) {
            const sql: string = `UPDATE wb_footer SET footer_content = ? WHERE footer_id = ?`
            await db.query(sql, [data[i].footer_content, data[i].footer_id]);

        }
        const sql: string = `UPDATE wb_footer SET footer_content = ? WHERE footer_id = ?`
        return await db.query(sql, []);
    }
}

export default new CommonMapper();
