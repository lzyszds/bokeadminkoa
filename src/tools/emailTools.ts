import nodemailer from 'nodemailer';

var emailHtml = (message: string = '你今天还未在github上提交代码') => {
    return `
        <div class="emailitem">
        <span class="icon">👨‍💻</span>
        <div class="card" style="color: #fff;">
          <p>･*･ ∧,,∧ ∧_∧ ･*･ </p>
          <p>'.　( ｡･ω･)(･ω･｡ ) .'</p>
          <p>'･. | つ♥と | .･' </p>
          <p>*ﾟ' ･｡｡･ﾟ '* </p>
          <p>τнänκ чöü</p>
        </div>
        <h1 style="text-align: center;font-size: 3rem;">🔔消息提醒</h1>
        <h1 class="btn">${message}</h1>
        <a style="text-align: center;color: #fff;" href="https://github.com/lzyszds">快去查看github吧！</a>
        <style>
          .emailitem {
            margin: 0 auto;
            width: 65%;
            height: 400px;
            min-width: 800px;
            background-color: #5161ce;
            box-shadow: 0px 0px 10px 1px #999;
            border-radius: 10px;
            display: grid;
            justify-content: end;
            align-items: center;
            padding: 40px 0;
            padding-right: 150px;
            position: relative;
            overflow: hidden;
          }
    
          .emailitem .icon {
            font-size: 18rem;
            position: absolute;
            bottom: 0;
            transform: scale(1.5);
          }
    
          .emailitem h1 {
            color: #fff;
            font-size: 24px;
            margin-bottom: 20px;
          }
    
          .emailitem p {
            margin: 0;
            text-align: center;
          }
    
          .emailitem .btn {
            color: #5161ce;
            background-color: #fff;
            padding: 20px;
            border-radius: 10px;
          }
        </style>
      </div>
    `
}


const myEmail = 'lzyszds@outlook.com'
const myName = '高贵的lzyszds来信啦！！'

// 创建一个SMTP客户端配置
const config = {
    service: "outlook",
    auth: {
        // 发件人邮箱账号
        user: myEmail,
        //发件人邮箱的授权码 这里可以通过qq邮箱获取 并且不唯一
        pass: 'zkssuybfuuqsfohy'  //mthbvhdnfivzvnfj谷歌邮箱
    }
}

const transporter = nodemailer.createTransport(config)

const mail = (message?: string) => {
    return {
        // 发件人 邮箱  '昵称<发件人邮箱>'
        from: `${myName}<${myEmail}>`,
        // 主题
        subject: 'lzy每日提醒',
        // 收件人 的邮箱 可以是其他邮箱 不一定是qq邮箱
        to: 'lzyszds@qq.com',
        //这里可以添加html标签
        html: emailHtml(message),

    }
}

export default {
    transporter,
    mail
}




