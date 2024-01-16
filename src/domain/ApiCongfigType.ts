interface ApiConfig<T> {
    code: number,
    msg: string,
    data: T | null,
}

class ApiConfig<T> {
    //请求成功
    success(data: T) {
        this.code = 200;
        this.msg = 'success';
        this.data = data;
        return this
    }

    //请求失败
    fail(msg: string) {
        this.code = 500;
        this.msg = msg;
        this.data = null;
        return this
    }

    //参数错误
    paramsError(msg: string) {
        this.code = 400;
        this.msg = msg;
        this.data = null;
        return this
    }

    //没有登录
    noLogin(msg: string) {
        this.code = 401;
        this.msg = msg;
        this.data = null;
        return this
    }

    //没有权限
    noPower(msg: string) {
        this.code = 403;
        this.msg = msg;
        this.data = null;
        return this
    }

    //没有找到
    notFound(msg: string) {
        this.code = 404;
        this.msg = msg;
        this.data = null;
        return this
    }

}


export default ApiConfig;
