import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { Logger } from '@nestjs/common';
import { HttpException } from '@nestjs/common';

import { PrismaService } from '../prisma.service';

import { generateAccessToken, hashPassword } from './user.util';
import { IUser, IUserResponse } from './user.interface';
import { CreateUserDto } from './user.dto';

@Injectable()
export class UserService {
    private readonly logger = new Logger(UserService.name);

    constructor(
        private readonly prisma: PrismaService,
    ) {};

    async signup(body: CreateUserDto) {
        const { email, password, name } = body;
        try {
            const checkUser = await this.prisma.user.findUnique({ where: { email } });
            if (checkUser) {
                throw new HttpException('SIGNUP.USER_ALREADY_EXISTS', 400);
            };

            const newUser: IUser = await this.prisma.user.create({
                data: {
                    email,
                    password: await hashPassword(password),
                    ...(name ? { name } : {}),
                },
            });

            const accessToken = generateAccessToken(newUser.id);
            const user: IUserResponse = {
                id: newUser.id,
                email: newUser.email,
                name: newUser.name,
            };

            return {
                accessToken,
                user
            };

        } catch (error) {
            this.logger.error(`SIGNUP.FAILED: ${(error as Error).message}`);
            if (error instanceof HttpException) {
                throw error;
            };
            throw new InternalServerErrorException('SIGNUP.FAILED');
        };
    };
};