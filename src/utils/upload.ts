import multer, {Options} from "koa-multer";
import mime from "mime";
import {Request, Response} from "express";
import path from "node:path";
import crypto from "crypto";
// 允许存储的文件类型
const allowImgType = [
    'image/jpg',
    'image/jpeg',
    'image/png',
    'image/gif',
    'image/bmp',
    'image/webp',
    'image/svg+xml',
    'image/x-icon',
];

// 文件存储位置
const storage_path = path.join(__dirname, '../../public/img/articleImages');

const fileUploadOptions: Options = {
    storage: multer.diskStorage({
        destination: storage_path,
        filename: function (req: Request, file, cb) {
            if (allowImgType.includes(file.mimetype)) {
                cb(null, file.fieldname);
            } else {
                const err = new Error('当前文件暂不支持上传,暂时只支持jpg.jpeg,png,gif,bmp,webp,svg,icon等图片。');
                cb(err, file.fieldname);
            }
        }
    }),
    limits: {
        fileSize: 1024 * 1024 * 2, // 1024字节=1kb, 1024kb=1MB
        files: 1, // 一次上传一张
    },

}


export default fileUploadOptions;