import ApiConfig from "../domain/ApiCongfigType";
import {AdminHomeType, ProcessAdminHomeType} from "../domain/AdminHomeType";
import CommonMapper from "../mapper/common.mapper";
import ArticleMapper from "../mapper/article.mapper";
import path from "path";
import fs from "fs";
import IP2Region, {IP2RegionResult} from "ip2region"
import os from "os";
import Config from "../../config";
import {WeatherDataType, WeatherDataTypeResponse} from "../domain/CommonType";
import dayjs from "dayjs";

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
            console.log(res)
            if (!res?.city) {
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
                .then(res => res.json())
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
            console.log(data)
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
}

export default new CommonService();