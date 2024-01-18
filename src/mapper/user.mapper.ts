import db from "../utils/db";
import {User, UserAny, UserRole} from "../domain/User";
import {OkPacket} from "mysql";
import JoinSQL from "../utils/JoinSQL";


class UserMapper {

    private joinSQL = new JoinSQL();

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
    public async getUserList(search: string, pages: string, limit: string): Promise<UserRole[]> {
        const offset: number = (Number(pages) - 1) * Number(limit);
        let sql: string = `
            SELECT  
            FROM userlist 
            WHERE uname LIKE ? OR username LIKE ? OR power LIKE ? OR perSign LiKE ? 
            ORDER BY uid LIMIT ?, ?
        `;
        return await db.query(sql, [search, search, search, search, offset, Number(limit)]);
    }

    // 获取用户信息
    public async getUserInfo(uid: string): Promise<UserRole> {
        let sql: string = `
            SELECT uid, uname, username, power, createDate, lastLoginDate, perSign, headImg, isUse
            FROM userlist 
            WHERE uid = ?
        `;
        return await db.query(sql, [uid]);
    }

    // 检查用户名获取密码
    public async inspectUsernameGetPassword(username: string): Promise<User> {
        let sql: string = `
            SELECT *
            FROM wb_users 
            WHERE username = ? 
        `;
        return (await db.query(sql, [username]))[0];
    }

    // 新增用户
    public async addUser(user: User): Promise<OkPacket> {
        //函数式处理sql语句
        const sqlArr: string[] = ["uname", "username", "password", "power", "create_date",
            "signature", "head_img", "whether_use", "activation_key", "create_ip"];
        const queryArr = this.joinSQL.INSERT(user, sqlArr, "wb_users");
        return await db.query(queryArr[0], queryArr[1]);
    }

    //检验token
    public async verifyToken(activation_key: string): Promise<User> {
        let sql: string = `
            SELECT *
            FROM wb_users 
            WHERE activation_key = ? 
        `;
        return (await db.query(sql, [activation_key]));
    }

    // 修改用户信息(根据uid，可以指定修改某一属性)
    public async updateUser(user: UserAny): Promise<OkPacket> {
        //函数式处理sql语句
        const query = this.joinSQL.UPDATE(user, "wb_users", "uid");
        return await db.query(query[0], query[1]);
    }
}

export default new UserMapper();