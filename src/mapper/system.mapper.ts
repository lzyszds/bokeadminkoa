import { AdminHomeType } from "../domain/AdminHomeType";
import db from "../utils/db";
import { SystemConfigType } from "../domain/CommonType";
import { OkPacket } from "mysql";
import { Footer } from "../domain/FooterType";

class SystemMapper {
  //从数据库获取系统设置配置
  public async getSystemConfig(ids: string): Promise<SystemConfigType[]> {
    const sqlAfter: string = `WHERE config_id IN (${ids})`
    let sql: string = `SELECT * FROM wb_system_config ` + (ids == 'admin' ? '' : sqlAfter);
    return await db.query(sql, []);
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

  //获取系统公告
  public async getNotification(title: string = '', way_type: string = ''): Promise<AdminHomeType[]> {
    const sql: string = `SELECT * FROM wb_system_notifications WHERE title = ? or way_type = ? ORDER BY create_time DESC`
    return await db.query(sql, [title, way_type]);
  }

  //新增系统公告
  public async addFooterInfo(footer_type: string, footer_content: string = '', footer_url: string = '', footer_order: Number): Promise<OkPacket> {
    const sql: string = `INSERT INTO wb_footer (footer_type, footer_content, footer_url, footer_order) VALUES (?,?,?,?)`
    return await db.query(sql, [footer_type, footer_content, footer_url, footer_order]);
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

export default new SystemMapper();
