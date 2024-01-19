import ApiConfig from "../domain/ApiCongfigType";


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
}

export default new CommonService();