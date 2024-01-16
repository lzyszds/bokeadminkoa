let CONFIG: any = {
    key: 'koa:session',
    maxAge: 86400000,
    autoCommit: true,
    overwrite: true,
    httpOnly: true,
    signed: true,
    rolling: false,
    renew: false,
    sameSite: null,
}

export default CONFIG;