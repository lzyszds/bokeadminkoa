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

interface Connection {
    query(sql: string, params: any, callback: (error: any, results: any, fields: any) => void): void;

    release(): void;
}

interface Database {
    query(sql: string, params: any): Promise<any>;
}

interface DatabasePool {
    getConnection(callback: (err: Error, connection: Connection) => void): void;
}


/**
 * fieldCount: 表示返回的字段数。
 * affectedRows: 表示受查询影响的行数。
 * insertId: 如果查询包含插入操作，并且插入的表具有自增主键，insertId 将包含插入的最后一行的自增ID。
 * serverStatus: 表示 MySQL 服务器的状态。
 * warningCount: 表示服务器返回的警告数量。
 * */
const db: Database = {
    query: function (sql: string, params: any): Promise<any> {
        return new Promise((resolve, reject) => {
            // 取出链接
            pool.getConnection(function (err: Error, connection: Connection) {

                if (err) {
                    reject(err);
                    return;
                }

                connection.query(sql, params, (error: any, results: any, fields: any) => {
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