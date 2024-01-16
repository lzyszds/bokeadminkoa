interface User {
    uid: number,
    uname: string,
    username: string,
    power: string,
    createDate: string,
    lastLoginDate: string,
    headImg: string,
    isUse: string,
    perSign: string,
}

interface UserData {
    total: number,
    data: User[],
}

export {
    User,
    UserData
}