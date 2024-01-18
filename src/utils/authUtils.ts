import jwt from 'jsonwebtoken';
import {UserAny} from "../domain/User";

// 用于签名JWT的密钥，保持私密
const secretKey = 'your_secret_key';

// 生成JWT
function generateToken(userData: UserAny, expiresIn = '1h') {
    try {
        return jwt.sign(userData, secretKey, {expiresIn});
    } catch (error) {
        throw error;
    }
}

// 验证JWT
function verifyToken(token: string) {
    try {
        return jwt.verify(token, secretKey);
    } catch (error) {
        throw error;
    }
}

export {
    generateToken,
    verifyToken,
};
