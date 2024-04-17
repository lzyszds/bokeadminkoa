import fs from "fs";
import * as https from "https";
import path from "node:path";
import dayjs from "dayjs";

/**
 * 通用键值对象接口
 */
interface MapObject {
    [key: string]: any;
}

/**
 * 将对象转换成键值数组
 * @param value 需要转换的对象
 * @returns 转换后的键值数组
 */
const mapGather = (value: MapObject): MapObject[] => {
    return Object.keys(value).map((key: any) => {
        return {
            [key]: value[key],
        };
    }) || [];
};


/**
 * 数据截取函数
 * @param data 原始数据数组
 * @param pages 当前页数
 * @param limit 每页条数
 * @returns 截取后的数据数组和数据总数
 */
const sliceData = <T>(data: T[], pages: number, limit: number): { data: T[], total: number } => {
    // 计算数据总数
    const total = data.length;
    // 计算当前页数
    const page = Number(pages);
    // 计算当前页数的起始位置
    const start = (page - 1) * Number(limit);
    // 计算当前页数的结束位置
    const end = page * Number(limit);
    // 截取当前页数的数据
    data = data.slice(start, end);

    return {data, total};
};

/**
 * 生成在指定范围内不重复的随机数
 * @param min 最小值（包含）
 * @param max 最大值（包含）
 * @param random 上一次的随机数
 * @returns 不重复的随机数
 */
const randomUnique = (min: number, max: number, random: number): number => {
    /* 获取随机数并且不和上一次的随机数一样获取最小值和最大值之间的随机数 */
    let num: number = Math.floor(Math.random() * (max - min + 1) + min);
    // 如果数字与随机数相同，请重试
    if (num == random) {
        return randomUnique(min, max, num);
    }
    // 否则返回数字
    return num;
};

/**
 * 图片代理函数
 * @param url 图片 URL
 * @returns 图片的 base64 编码字符串
 */
const imgProxy = async (url: string): Promise<string> => {
    // 将网络图片转换成 base64
    return new Promise((resolve, reject) => {
        https.get(url, (res: any) => {
            let chunks: any = [];
            res.on('data', (chunk: any) => {
                chunks.push(chunk);
            });
            res.on('end', () => {
                let data: Buffer = Buffer.concat(chunks);
                let base64Img: string = data.toString('base64');
                const img: string = 'data:image/jpeg;base64,' + base64Img;
                resolve(img);
            });
        });
    });
};

/**
 * 处理文件内容，去除重复字符后再写入文件
 */
const processFileContent = (): void => {
    try {
        const filePath = path.resolve(__dirname, '../../utilsPublic/font.txt');
        const text = fs.readFileSync(filePath, "utf-8");
        // 去重处理
        const arr = text.split("");
        const newArr = [...new Set(arr)];
        const newStr = newArr.join("");
        // 将文件内容更新
        fs.writeFileSync(filePath, newStr);

        console.log("文件内容去重成功");
        // // 结束进程
        // process.exit(0);
    } catch (error) {
        console.error("文件内容去重失败:", error);
    }
};

/**
 * 将字符串中所有的单引号转换成双引号
 * @param str 需要转换的字符串或字符串数组
 * @returns 转换后的字符串或字符串数组
 */
const replaceSingleQuotes = (str: string | string[]): string | string[] => {
    if (typeof str === 'string') return str.replace(/'/g, '"');
    return str.map((item: string) => {
        return item.replace(/'/g, '"');
    });
};

/**
 * 判断传入的参数是否是英文和数字组成的字符串
 * @param val 需要判断的字符串或字符串数组
 * @returns 如果所有参数都是由英文字母和数字组成的，返回 true；否则返回 false
 */
function toValidEnglishNumber(val: string | string[]): boolean {
    const reg = /^[a-zA-Z0-9]{3,16}$/; // 匹配由英文字母和数字组成，且长度为3到16位的字符串
    if (typeof val === 'string') return reg.test(val);
    return val.every((item: string) => {
        return reg.test(item);
    });
}

/**
 * 获取当前时间的时间戳
 * @returns 当前时间的时间戳
 */
const getCurrentUnixTime = (): number => {
    return dayjs().unix();
};

/**
 * 检查给定的对象是否包含指定的键，或者只有一个存在的键，如果存在的键的值为空，则返回真。
 *
 * @param {any}        obj            需要检查的对象
 * @param {string[]}   keys           需要检查的键的列表
 * @param {string[]}   onlyOneExists  只需要存在一个的键的列表，是可选参数
 *
 * @return {boolean}   如果对象不包含指定的键，或者指定的键的值为空，则返回真；否则返回假。
 */
const checkObj = (obj: any, keys: string[], onlyOneExists?: string[]): boolean => {
    if (!obj) return true
    for (let key of keys) {
        // 如果属性为空（null、undefined、空字符串或空数组），则：
        if (obj[key] === null || obj[key] === undefined || obj[key] === '' || obj[key].length === 0) {

            // 如果设置了 `onlyOneExists` 数组，则：
            if (onlyOneExists) {

                // 遍历 `onlyOneExists` 数组，检查其中是否有属性存在且非空：
                let flag = false
                for (let onlyOneExist of onlyOneExists) {
                    if (obj[onlyOneExist] !== null && obj[onlyOneExist] !== undefined && obj[onlyOneExist] !== '' && obj[onlyOneExist].length > 0) {
                        flag = true
                        break
                    }
                }

                // 如果 `flag` 为 false（表示 `onlyOneExists` 中的所有属性都为空），则返回 false
                if (!flag) return false

                // 否则，返回 true
            } else {
                return true
            }
        }
    }
    return false
}

//提取出你需要的信息，比如浏览器名称、版本号以及操作系统等
function parseUserAgent(userAgent: any) {
    var browserName = "Unknown";
    var browserVersion = "Unknown";
    var os = "Unknown";
    if (!userAgent) return {browserSystem: "Unknown", browserVersion, deviceSystem: os};
    // 浏览器信息
    if (userAgent.indexOf("Firefox") > -1) {
        browserName = "Firefox";
        browserVersion = userAgent.match(/Firefox\/([\d.]+)/)[1];
    } else if (userAgent.indexOf("Chrome") > -1) {
        browserName = "Chrome";
        browserVersion = userAgent.match(/Chrome\/([\d.]+)/)[1];
    } else if (userAgent.indexOf("Safari") > -1) {
        browserName = "Safari";
        browserVersion = userAgent.match(/Version\/([\d.]+)/)[1];
    } else if (userAgent.indexOf("MSIE") > -1) {
        browserName = "Internet Explorer";
        browserVersion = userAgent.match(/MSIE ([\d.]+)/)[1];
    }

    // 操作系统信息
    if (userAgent.indexOf("Windows NT 10.0") != -1) os = "Windows 10";
    else if (userAgent.indexOf("Windows NT 6.2") != -1) os = "Windows 8";
    else if (userAgent.indexOf("Windows NT 6.1") != -1) os = "Windows 7";
    else if (userAgent.indexOf("Windows NT 6.0") != -1) os = "Windows Vista";
    else if (userAgent.indexOf("Windows NT 5.1") != -1) os = "Windows XP";
    else if (userAgent.indexOf("Macintosh") != -1) os = "MacOS";
    else if (userAgent.indexOf("Linux") != -1) os = "Linux";
    else if (userAgent.indexOf("Android") != -1) os = "Android";
    else if (userAgent.indexOf("like Mac OS X") != -1) {
        os = "iOS";
        // 可以进一步解析iOS的版本
    }

    return {browserSystem: browserName + browserVersion, deviceSystem: os};
}



export {
    mapGather,
    sliceData,
    randomUnique,
    imgProxy,
    processFileContent,
    replaceSingleQuotes,
    toValidEnglishNumber,
    getCurrentUnixTime,
    checkObj,
    parseUserAgent
};