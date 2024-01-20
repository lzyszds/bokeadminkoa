interface Articles {
    aid: number;
    uid: number;
    createTime: number;
    title: string;
    content: string;
    modified: number;
    coverImg: string;
    comNumber: string;
    main: string;
    wtype: string;
    coverContent: string;
    accessCount: number;
}

//连接用户表
interface ArticleUser {
    uid: number;
    uname: string;
    head_img: string;
    create_ip: string;
    aid: number;
    createTime?: number;
    title: string;
    content: string;
    modified?: number;
    coverImg?: string;
    comNumber?: string;
    main?: string;
    wtype?: string;
    coverContent?: string;
    accessCount: number;
}

export {
    Articles,
};