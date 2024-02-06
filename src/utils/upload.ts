import path from 'path';
import * as uuid from 'uuid';
import multer, {Options} from 'multer';

// 允许上传的图片类型
const allowImgType = ['image/jpg', 'image/jpeg', 'image/png', 'image/gif', 'image/bmp', 'image/webp', 'image/svg+xml'];

// 文件存储的基础路径
const baseStoragePath = path.join(__dirname, '../../public/img/');

/**
 * 检查文件类型是否允许上传
 *
 * @param {string} mimetype - 文件的 MIME 类型
 * @returns {boolean} 是否允许上传
 */
const isAllowedFileType = (mimetype: string): boolean => allowImgType.includes(mimetype);

/**
 *  根据mime类型生成文件扩展名
 *
 *  @param {string} mimetype - 文件的 MIME 类型
 *  @returns {string} 文件扩展名
 */
const generateFileExtname = (mimetype: string): string => {
    const extname = mimetype.split('/')[1];
    return "." + (extname === 'svg+xml' ? 'svg' : extname);
}


/**
 * 生成用于文件上传的 Multer 配置选项
 *
 * @param {string} region - 文件存储的区域信息
 * @returns {Options} Multer 配置选项
 */
const fileUploadOptions = (region: string): Options => {
    // 文件存储位置
    const storage_path = path.join(baseStoragePath, region);

    // 限制信息
    const fileSizeLimit = 1024 * 1024 * 2; // 2MB
    const filesLimit = 1;

    return {
        storage: multer.diskStorage({
            destination: storage_path,
            filename: (req, file, cb) => {
                // 使用 uuid 生成唯一文件名
                const filename = isAllowedFileType(file.mimetype) ? uuid.v4() + generateFileExtname(file.mimetype) : '';
                cb(null, filename);
            }
        }),
        limits: {
            fileSize: fileSizeLimit,
            files: filesLimit,
        }
    };
};


export default fileUploadOptions;