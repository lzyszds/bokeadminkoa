import ApiConfig from "../domain/ApiCongfigType";
import {AdminHomeType, ProcessAdminHomeType} from "../domain/AdminHomeType";
import CommonMapper from "../mapper/common.mapper";
import ArticleMapper from "../mapper/article.mapper";


class CommonService {
    public async getWeather(ctx: any): Promise<ApiConfig<string>> {
        // 创建一个 ApiConfig 对象
        const apiConfig: ApiConfig<string> = new ApiConfig<string>();
        try {
            const ip = ctx.request.ip.replace(/::ffff:/, '');
            //本地ip
            if (ip === '::1') return apiConfig.success('localhost')
            return apiConfig.success(ip)
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
}

export default new CommonService();