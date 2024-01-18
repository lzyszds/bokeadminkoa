interface UserRole {
    [key: string]: any;

    uid: number;
    uname: string;
    username: string;
    power?: number | null; // '?' denotes optional field
    create_date: string; // Assuming string for simplicity, you might want to use Date type
    last_login_date?: string | null; // Assuming string for simplicity, you might want to use Date type
    head_img: string;
    whether_use?: number | null; // '?' denotes optional field
    signature?: string | null; // '?' denotes optional field
    activation_key: string;
    create_ip?: string;
    last_login_ip?: string;
}


interface UserAny {
    [key: string]: any;

    uid?: number;
    uname?: string;
    username?: string;
    password?: string;
    power?: number; // '?' denotes optional field
    create_date?: string; // Assuming string for simplicity, you might want to use Date type
    last_login_date?: string; // Assuming string for simplicity, you might want to use Date type
    head_img?: string;
    whether_use?: number; // '?' denotes optional field
    signature?: string; // '?' denotes optional field
    activation_key?: string;
    create_ip?: string;
    last_login_ip?: string;
}


interface User {
    [key: string]: any;

    uid?: number;
    uname: string;
    username: string;
    password: string;
    power?: number | null; // '?' denotes optional field
    create_date: string; // Assuming string for simplicity, you might want to use Date type
    last_login_date?: string | null; // Assuming string for simplicity, you might want to use Date type
    head_img: string;
    whether_use?: number | null; // '?' denotes optional field
    signature?: string | null; // '?' denotes optional field
    activation_key: string;
    create_ip?: string;
    last_login_ip?: string;
}


interface UserData {
    total: number,
    data: User[],
}

interface UserRoleData {
    total: number,
    data: UserRole[],
}


export {
    User,
    UserData,
    UserRole,
    UserRoleData,
    UserAny
}