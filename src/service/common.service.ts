import ApiConfig from "../domain/ApiCongfigType";
import {AdminHomeType, ProcessAdminHomeType} from "../domain/AdminHomeType";
import CommonMapper from "../mapper/common.mapper";
import ArticleMapper from "../mapper/article.mapper";
import path from "path";
import fs from "fs";
import IP2Region, {IP2RegionResult} from "ip2region"

import Config from "../../config";
import {WeatherDataType, WeatherDataTypeResponse} from "../domain/CommonType";
import dayjs from "dayjs";
import {Footer} from "../domain/FooterType";

class CommonService {
    public async getWeather(ctx: any): Promise<ApiConfig<WeatherDataType>> {
        // 创建一个 ApiConfig 对象
        const apiConfig: ApiConfig<WeatherDataType> = new ApiConfig();
        try {
            // // 获取本机所有网络接口的信息
            // const networkInterfaces = os.networkInterfaces();
            // // 找到第一个非内部接口的IP地址
            // let ipAddress = Object.values(networkInterfaces)
            //     .flat()
            //     .filter((interfaceInfo: any) => interfaceInfo.family === 'IPv4' && !interfaceInfo.internal)
            //     .map((interfaceInfo: any) => interfaceInfo.address)
            //     .shift();
            //获取当前请求的IP地址

            let ipAddress = ctx.request.headers['x-real-ip'] || ctx.request.ip.replace('::ffff:', '')

            // 创建一个 IP2Region 对象
            const query: IP2Region = new IP2Region();
            // 查询 IP 地址的归属地
            const res: IP2RegionResult | null = query.search(ipAddress);
            if (!res?.province) {
                return apiConfig.success({
                    "province": res?.country || "未知",
                    "city": "未知",
                    "adcode": "未知",
                    "weather": "未知",
                    "temperature": "未知",
                    "winddirection": "未知",
                    "windpower": "未知",
                    "humidity": "未知",
                    "reporttime": dayjs().format('YYYY-MM-DD HH:mm:ss'),
                    "temperature_float": "未知",
                    "humidity_float": "未知",
                    "ip": ipAddress,
                })
            }
            //根据地区获取当前城市编码
            const {adcode} = await CommonMapper.getCityCodeByIp(res?.city!)
            //根据城市编码获取天气预报
            const weatherData: WeatherDataTypeResponse = await fetch(`https://restapi.amap.com/v3/weather/weatherInfo?city=${adcode}&key=${Config.weatherKey}`)
                .then((res: any) => res.json())
            weatherData.lives[0].ip = ipAddress
            // weatherData.lives[0].ip = ipAddress
            return apiConfig.success(weatherData.lives[0])
        } catch (e: any) {
            console.log(e)
            return apiConfig.fail(e.message)
        }
    }


    //后台首页数据
    public async getAdminHomeData(): Promise<ApiConfig<ProcessAdminHomeType>> {
        const data: AdminHomeType = await CommonMapper.getAdminHomeData();
        //获取最新文章6篇
        const newArticle = await ArticleMapper.findAll('%%', 1, 6);
        //处理数据 不需要返回所有数据 删除对象中的content属性
        newArticle.forEach((item: any) => {
            delete item.content
            delete item.partial_content
        })
        let processData = {} as ProcessAdminHomeType
        for (let key in data) {
            if (key !== 'hotArticle') {
                processData[key] = data[key][0].total
            } else {
                processData[key] = data[key]
            }
        }
        processData.newArticle = newArticle

        const apiConfig: ApiConfig<ProcessAdminHomeType> = new ApiConfig();
        return apiConfig.success(processData);
    }

    //获取github 贡献图
    public async getGithubInfo(): Promise<ApiConfig<string>> {
        const apiConfig: ApiConfig<any> = new ApiConfig<any>();
        try {
            const filePath = path.resolve(__dirname, '../../public/json/getGithubInfo.json');
            const data = fs.readFileSync(filePath, 'utf-8');

            return apiConfig.success(JSON.parse(data).data)
        } catch (e: any) {
            console.log(e)
            return apiConfig.fail(e.message)
        }
    }

    //获取系统设置
    public async getSystemConfig(): Promise<ApiConfig<any>> {
        const apiConfig: ApiConfig<any> = new ApiConfig();
        try {
            const data = await CommonMapper.getSystemConfig();
            return apiConfig.success(data)
        } catch (e: any) {
            return apiConfig.fail(e.message)
        }
    }

    //获取loadGif图片
    public async getLoadGif(): Promise<ApiConfig<any[]>> {
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

    //新增系统设置
    public async addSystemConfig(ctx: any): Promise<ApiConfig<any>> {
        const apiConfig: ApiConfig<any> = new ApiConfig();
        try {
            const {config_key, config_value, config_desc} = ctx.request.body;
            const data = await CommonMapper.addSystemConfig(config_key, config_value, config_desc);
            return apiConfig.success(data.affectedRows === 1 ? '新增成功' : '新增失败')
        } catch (e: any) {
            return apiConfig.fail(e.message)
        }
    }

    //更新系统设置
    public async updateSystemConfig(ctx: any): Promise<ApiConfig<string>> {
        const apiConfig: ApiConfig<any> = new ApiConfig();
        try {
            const {config_key, config_value, config_id} = ctx.request.body;
            const data = await CommonMapper.updateSystemConfig(config_key, config_value, config_id);
            return apiConfig.success(data.affectedRows === 1 ? '更新成功' : '更新失败')
        } catch (e: any) {
            return apiConfig.fail(e.message)
        }
    }

    //获取页脚信息
    public async getFooterInfo(): Promise<ApiConfig<Footer[]>> {
        const apiConfig: ApiConfig<Footer[]> = new ApiConfig();
        try {
            const data = await CommonMapper.getFooterInfo();
            //处理数据
            let result: any[] = []
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


}

export default new CommonService();