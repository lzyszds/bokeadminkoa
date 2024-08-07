import { AdminHomeType, AdminHomeTypeSql } from "../domain/AdminHomeType";
import db from "../utils/db";

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


}

export default new CommonMapper();
