import dotenv from 'dotenv';

dotenv.config();

export const throwIfUndefined = (name: any, value: any) => {
    if (!value) {
        throw new Error(`Environment variable ${name} cannot be undefined`);
    };

    return value;
};

export const Environment = {
    PORT: process.env.PORT || 3000,
    JWT_SECRET: throwIfUndefined('JWT_SECRET', process.env.JWT_SECRET),
    DATABASE_URL: throwIfUndefined('DATABASE_URL', process.env.DATABASE_URL),
};

