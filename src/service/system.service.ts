import ApiConfig from "../domain/ApiCongfigType";
import SystemMapper from "../mapper/system.mapper";
import ArticleMapper from "../mapper/article.mapper";
import path from "path";
import fs from "fs";

import { WeatherDataType, WeatherDataTypeResponse } from "../domain/CommonType";
import dayjs from "dayjs";
import { Footer, FooterPrincipal, FooterSecondary } from "../domain/FooterType";



class SystemService {

  //新增系统设置
  public async addSystemConfig(ctx: any): Promise<ApiConfig<any>> {
    const apiConfig: ApiConfig<any> = new ApiConfig();
    try {
      const { config_key, config_value, config_desc } = ctx.request.body;
      const data = await SystemMapper.addSystemConfig(config_key, config_value, config_desc);
      return apiConfig.success(data.affectedRows === 1 ? '新增成功' : '新增失败')
    } catch (e: any) {
      return apiConfig.fail(e.message)
    }
  }

  //更新系统设置
  public async updateSystemConfig(ctx: any): Promise<ApiConfig<string>> {
    const apiConfig: ApiConfig<any> = new ApiConfig();
    try {
      const { config_key, config_value, config_id } = ctx.request.body;
      const data = await SystemMapper.updateSystemConfig(config_key, config_value, config_id);
      return apiConfig.success(data.affectedRows === 1 ? '更新成功' : '更新失败')
    } catch (e: any) {
      return apiConfig.fail(e.message)
    }
  }

  //获取系统设置
  public async getSystemConfig(type: string): Promise<ApiConfig<any>> {
    const params: any = {
      "admin": "admin", //获取所有
      "reception": '4,5', //前台
    }

    const apiConfig: ApiConfig<any> = new ApiConfig();
    try {
      const data = await SystemMapper.getSystemConfig(params[type]);
      return apiConfig.success(data)
    } catch (e: any) {
      return apiConfig.fail(e.message)
    }
  }
  //获取系统公告
  public async getNotification(): Promise<ApiConfig<any>> {
    const apiConfig: ApiConfig<any> = new ApiConfig();
    try {
      const data = await SystemMapper.getNotification();
      return apiConfig.success(data)
    } catch (e: any) {
      return apiConfig.fail(e.message)
    }
  }

  //新增页脚信息
  public async addFooterInfo(ctx: any): Promise<ApiConfig<string>> {
    const apiConfig: ApiConfig<string> = new ApiConfig();
    try {
      const { footer_type, footer_content, footer_url, footer_order } = ctx.request.body;
      const data = await SystemMapper.addFooterInfo(footer_type, footer_content, footer_url, footer_order);
      return apiConfig.success(data.affectedRows === 1 ? '新增成功' : '新增失败')
    } catch (e: any) {
      return apiConfig.fail(e.message)
    }
  }

  //获取页脚信息
  public async getFooterInfo(): Promise<ApiConfig<FooterSecondary[]>> {
    const apiConfig: ApiConfig<FooterSecondary[]> = new ApiConfig();
    try {
      const data = await SystemMapper.getFooterInfo();
      //处理数据
      let result: FooterSecondary[] = []
      let arr: string[] = data.map((item: Footer) => item.footer_type)
      let set = new Set(arr)
      set.forEach((item: string) => {
        let children = data.filter((child: Footer) => child.footer_type === item)
        result[children[0].footer_order] = {
          footer_id: children[0].footer_id,
          footer_content: children[0].footer_type,
          footer_order: children[0].footer_order,
          children: children
        }
      })

      // console.log(result)
      return apiConfig.success(result)
    } catch (e: any) {
      return apiConfig.fail(e.message)
    }
  }

  //更新页脚信息
  public async updateFooterInfo(ctx: any): Promise<ApiConfig<string>> {
    const apiConfig: ApiConfig<string> = new ApiConfig();
    try {
      const { children } = ctx.request.body;
      let arr: Footer[] = []
      children.forEach((item: FooterSecondary) => {
        item.children.forEach((child: Footer) => {
          arr.push(child)
        })
      })
      const data = await SystemMapper.updateFooterInfo(arr);
      return apiConfig.success("更新成功")
    } catch (e: any) {
      return apiConfig.fail(e.message)
    }
  }

  //获取loadGif图片
  public async getSystemLoadImages(): Promise<ApiConfig<any[]>> {
    const apiConfig: ApiConfig<any[]> = new ApiConfig();
    let data: any[] = []
    try {
      //获取loading数据图片
      let result = fs.readdirSync(path.resolve(__dirname, '../../public/img/loadGif'))
      result = result.sort((a: string, b: string) => {
        return parseInt(a.split('.')[0].replace('loading', '')) - parseInt(b.split('.')[0].replace('loading', ''))
      })
      data = result.map((item: string) => "/public/img/loadGif/" + item)

      return apiConfig.success(data)
    } catch (e: any) {
      return apiConfig.fail(e.message)
    }
  }

  public async getLazyLoadImage(ctx: any): Promise<any> {
    try {
      const data = await SystemMapper.getSystemConfig('admin');
      const gifValue = data.filter((item: any) => item.config_key === "load_animation_gif")[0].config_value
      const imgBuffer = fs.readFileSync(path.resolve(__dirname, '../..' + gifValue));
      console.log(path.resolve(__dirname, '../..' + gifValue));
      return imgBuffer
    } catch (e) {
      return e
    }
  }
}

export default new SystemService();
