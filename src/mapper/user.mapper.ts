import db from "../utils/db";
import {User} from "../domain/User";


class UserMapper {


    // 获取符合搜索条件的记录总数
    public async getUserListTotal(search: string): Promise<number> {
        let sql: string = `
            SELECT COUNT(*) as total 
            FROM userlist 
            WHERE uname LIKE ? OR username LIKE ? OR power LIKE ? OR perSign LiKE ?
        `;
        const total = await db.query(sql, [search, search, search, search]);
        return total[0].total;
    }

    // 获取符合搜索条件的记录,获取分页的用户列表
    public async getUserList(search: string, pages: string, limit: string): Promise<User[]> {
        const offset: number = (Number(pages) - 1) * Number(limit);
        let sql: string = `
            SELECT uid, uname, username, power, createDate, lastLoginDate, perSign, headImg, isUse
            FROM userlist 
            WHERE uname LIKE ? OR username LIKE ? OR power LIKE ? OR perSign LiKE ? 
            ORDER BY uid LIMIT ?, ?
        `;
        return await db.query(sql, [search, search, search, search, offset, Number(limit)]);
    }

    // 获取用户信息
    public async getUserInfo(uid: string): Promise<User> {
        let sql: string = `
            SELECT uid, uname, username, power, createDate, lastLoginDate, perSign, headImg, isUse
            FROM userlist 
            WHERE uid = ?
        `;
        return await db.query(sql, [uid]);
    }

    // 登录
    public async login(username: string, password: string): Promise<User> {
        let sql: string = `
            SELECT uid
            FROM userlist 
            WHERE username = ? AND password = ?
        `;
        return await db.query(sql, [username, password]);
    }

}

export default new UserMapper();