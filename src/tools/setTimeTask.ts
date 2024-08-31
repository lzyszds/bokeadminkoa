// import {headers, parps} from "./config_Github";
import fs from "node:fs"
import path from "node:path"
import Config from "../../config";
import AiMapper from "../mapper/ai.mapper";
import dayjs from "dayjs";
import emailTools from './emailTools'
import axios from 'axios';

const { token1, token2, token3, name } = Config.githubUserConfig

const body = {
    "query": `query {
            user(login: "${name}") {
              name
              contributionsCollection {
                contributionCalendar {
                  colors
                  totalContributions
                  weeks {
                    contributionDays {
                      color
                      contributionCount
                      date
                      weekday
                    }
                    firstDay
                  }
                }
              }
            }
          }`
}
export default () => {
    //node定时任务
    const schedule = require('node-schedule');
    /*
        30 * * * *: 每小时的第30分钟执行一次
        0 /2 * * *: 每2小时执行一次
        0 9 * * *: 每天早上9点执行一次
        0 0 * * 1: 每周一的午夜执行一次
        * * * * * *   每秒
        0 * * * * * 每分钟
        0 0 * * * * 每小时
        0 0 0 * * * 每天
        0 0 0 0 * * 每月
        0 0 0 * * 0 每周
        0 0 0 0 0 * 每年
        0 10 23 * * * 23点10分0秒
    */
    schedule.scheduleJob('0 0 0 * * *', addGithubOrAiUc)  //新增 每日github贡献图数据库 和 每日ai摘要key的使用次数记录表
    schedule.scheduleJob('0 0 12 * * *', getGithubInfo)  //获取github数据 用于获取github贡献图 12点获取
    schedule.scheduleJob('0 05 18 * * *', getGithubInfo)  //获取github数据 用于获取github贡献图 18点获取
    schedule.scheduleJob('0 55 22 * * *', sendEmailWarn)  //发送邮件提醒 用于提醒每日是否有在github上提交代码

}
// 创建目录
const jsonDir = path.resolve(__dirname, '../../public/json');
//打包路径
// const jsonDir = path.resolve(__dirname, './public/json');
if (!fs.existsSync(jsonDir)) {
    fs.mkdirSync(jsonDir, { recursive: true });
}

//新增 每日github贡献图数据库 和 每日ai摘要key的使用次数记录表
async function addGithubOrAiUc() {
    try {
        await getGithubInfo()
        await addAiUc()
    } catch (e) {
        console.error("github数据获取失败", e);
    }
}


//发送邮件提醒 用于提醒每日是否有在github上提交代码
async function sendEmailWarn() {
    try {
        //获取github数据之前 先更新github数据
        await getGithubInfo();
        const githubData = fs.readFileSync(path.resolve(__dirname, '../../public/json/getGithubInfo.json'), 'utf-8');
        const data = JSON.parse(githubData)
        const weeks = data.data.user.contributionsCollection.contributionCalendar.weeks
        const newWeeks = weeks[weeks.length - 1].contributionDays
        //检查今天是否有提交
        const today = dayjs().format('YYYY-MM-DD')
        let isToday = false
        let count = 0
        newWeeks.forEach((item: any) => {
            if (item.date === today) {
                isToday = true
                count = item.contributionCount
            }
        })

        emailTools.mail(isToday ? `今天已经提交了${count}次` : '今天还没有提交哦!')
        emailTools.transporter.sendMail(emailTools.mail(), (err: any, info: any) => {
            if (err) {
                console.log(err);
                return;
            }
            console.log('邮件发送成功', info.messageId);
        });
    } catch (e) {
        console.error("邮件发送失败", e);
    }
}


async function getGithubInfo() {
    try {
        /**
         * 从GitHub API获取数据并保存到本地文件
         * @param token1 token的第一部分
         * @param token2 token的第二部分
         * @param token3 token的第三部分
         * @param jsonDir 保存json文件的目录路径
         */
        const url: string = "https://api.github.com/graphql";
        // 使用提供的token和请求体发送POST请求到GitHub GraphQL API
        const response = await axios({
            url,
            method: "POST",
            headers: {
                // 在请求头中加入Authorization信息
                "Authorization": `bearer ${token1}${token2}${token3}`,
            },
            data: JSON.stringify(body),
            //返回类型
            responseType: 'text',
        })  // 将响应内容转换为文本格式
        // 解析出getGithubInfo.json文件的完整路径
        const filePath = path.resolve(jsonDir, 'getGithubInfo.json');
        // 将获取到的数据写入到本地文件中
        fs.writeFileSync(filePath, response.data);

        console.log('github数据获取成功');
    } catch (e) {
        console.error("github数据获取失败", e);
    }
}

// 新增每日ai摘要key的使用次数记录表
async function addAiUc() {
    try {
        //先查询是否有今天的数据
        const total: number = await AiMapper.findAiUcByTime(dayjs().format('YYYY-MM-DD') + "%");
        if (total === 0) {
            await AiMapper.addAiUc()
        }
    } catch (e) {
        console.error("ai数据获取失败", e);
    }
}
