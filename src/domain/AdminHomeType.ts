import {Articles} from "./Articles";

export interface AdminHomeTypeSql {
    [key: string]: string;
}

type TotalType = {
    total: number;
};

export interface AdminHomeType {
    articleCount: TotalType[];
    articleTypeCount: TotalType[];
    commentCount: TotalType[];
    articleAccess: TotalType[];
    userCount: TotalType[];
    hotArticle: Articles[];

    [key: string]: any; // 添加这行
}

export interface ProcessAdminHomeType {
    articleCount: number;
    articleTypeCount: number;
    commentCount: number;
    articleAccess: number;
    userCount: number;
    hotArticle: Articles[];

    [key: string]: any; // 添加这行
}