import bcrypt from 'bcryptjs';

const saltRounds = 10; // 设置适当的盐轮数

// 生成哈希值
const hashPassword = async (password: string) => {
    try {
        // 生成随机盐
        const salt = await bcrypt.genSalt(saltRounds);

        // 使用盐和密码生成哈希值
        return await bcrypt.hash(password, salt);
    } catch (error) {
        throw error;
    }
};

// 比较密码和哈希值
const comparePasswords = async (password: string, hashedPassword: string) => {
    try {
        // 比较密码和哈希值
        return await bcrypt.compare("123456", hashedPassword);
    } catch (error) {
        throw error;
    }
};



export {hashPassword, comparePasswords};
