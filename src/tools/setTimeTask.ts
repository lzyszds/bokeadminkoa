// import {headers, parps} from "./config_Github";
import fs from "node:fs"
import path from "node:path"
import Config from "../../config";
import AiMapper from "../mapper/ai.mapper";
import dayjs from "dayjs";
import emailTools from './emailTools'

const {token1, token2, token3, name} = Config.githubUserConfig

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
         * * * * *: 每分钟执行一次
         30 * * * *: 每小时的第30分钟执行一次
         0 /2 * * *: 每2小时执行一次
         0 9 * * *: 每天早上9点执行一次
         0 0 * * 1: 每周一的午夜执行一次
    */
    schedule.scheduleJob('0 0 * * *', async function () {
        try {
            // 创建目录
            const jsonDir = path.resolve(__dirname, '../../public/json');
            //打包路径
            // const jsonDir = path.resolve(__dirname, './public/json');
            if (!fs.existsSync(jsonDir)) {
                fs.mkdirSync(jsonDir, {recursive: true});
            }

            const url: string = "https://api.github.com/graphql";
            const response = await fetch(url, {
                method: "POST",
                headers: {
                    "Authorization":
                        `bearer ${token1}${token2}${token3}`,
                }
                ,
                body: JSON.stringify(body),
            }).then(res => res.text());
            const filePath = path.resolve(jsonDir, 'getGithubInfo.json');
            fs.writeFileSync(filePath, response);
            await AiMapper.addAiUc()
        } catch (e) {
            console.error("github数据获取失败", e);
        }
    })
    //重新设置一个每日任务 时间为每天的23点10分0秒
    // schedule.scheduleJob('0 10 23 * * *', async function () {
    schedule.scheduleJob('0 10 23 * *', async function () {
        try {
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
            console.error("github数据获取失败", e);
        }
    })
}