/*
 * @Description: 数据库连接
 * @Author: hai-27
 * @Date: 2020-02-07 16:51:56
 * @LastEditors: hai-27
 * @LastEditTime: 2020-02-27 13:20:11
 */
import mysql from "mysql";
import Config from "../../config";

var pool: mysql.Pool = mysql.createPool(Config.dbConfig);

let db: { query: Function } = {
    query: function (sql: string, params: any) {
        return new Promise((resolve, reject) => {
            // 取出链接
            pool.getConnection(function (err: Error, connection: any) {

                if (err) {
                    reject(err);
                    return;
                }

                connection.query(sql, params, (error: any, results: any, fields: any) => {
                    // console.log(`${sql}=>${params}`);
                    // 释放连接
                    connection.release();
                    if (error) {
                        reject(error);
                        return;
                    }
                    resolve(results);
                });

            });
        });
    }
}
// 导出对象
export default db;