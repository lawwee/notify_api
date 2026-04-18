import * as bcrypt from 'bcrypt';
import * as jwt from 'jsonwebtoken';

export const hashPassword = async (password: string): Promise<string> => {
    const saltRounds = 10;
    return await bcrypt.hash(password, saltRounds);
};

export const comparePassword = async (password: string, hash: string): Promise<boolean> => {
    return await bcrypt.compare(password, hash);
};

export const generateAccessToken = (userId: string): string => {
    const payload = { userId };
    const secret = process.env.JWT_SECRET || 'default_secret';
    const options = { expiresIn: 3600 };
    return jwt.sign(payload, secret, options);
};