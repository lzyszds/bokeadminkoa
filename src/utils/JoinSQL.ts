class JoinSQL {
    public INSERT(obj: any, sqlArr: string[], tableName: string): any[] {
        //函数式处理sql语句
        const sqlValue: any[] = [];
        const sqlParams: any[] = [];
        for (let key of sqlArr) {
            sqlValue.push(`?`);
            sqlParams.push(obj[key]);
        }

        let sql: string = `
            INSERT INTO ${tableName} (${sqlArr.join(",")})
            VALUES (${sqlValue.join(",")})
        `;
        return [sql, sqlParams];
    }

    public UPDATE(obj: any, tableName: string, key: string): any[] {
        //如果某些字段为空，则不修改 拼接sql语句
        const sqlArr: string[] = [];
        const sqlParams: any[] = [];
        for (let key in obj) {
            if (obj[key] !== undefined && obj[key] !== null) {
                sqlArr.push(`${key} = ?`);
                sqlParams.push(obj[key]);
            }
        }
        sqlParams.push(obj[key]);
        let sql: string = `
            UPDATE wb_users 
            SET  ${sqlArr.join(", ")}
            WHERE uid = ?
        `
        return [sql, sqlParams];
    }
}

export default JoinSQL;