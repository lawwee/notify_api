import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { Logger } from '@nestjs/common';
import { HttpException } from '@nestjs/common';

import { PrismaService } from '../prisma.service';

import { comparePassword, generateAccessToken, hashPassword } from './user.util';
import { IUser, IUserResponse } from './user.interface';
import { CreateUserDto, LoginDto, UserResponseDto } from './user.dto';

@Injectable()
export class UserService {
    private readonly logger = new Logger(UserService.name);

    constructor(
        private readonly prisma: PrismaService,
    ) {};

    async signup(body: CreateUserDto): Promise<
        { accessToken: string, user: UserResponseDto }
    > {
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
            const user: UserResponseDto = {
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

    async login(body: LoginDto): Promise<
        { accessToken: string, user: UserResponseDto }
    > {
        try {
            const { email, password } = body;
            const user = await this.prisma.user.findUnique({ where: { email } });
            if (!user) {
                throw new HttpException('LOGIN.EMAIL_NOT_FOUND', 400);
            };

            const isPasswordValid = await comparePassword(password, user.password);
            if (!isPasswordValid) {
                throw new HttpException('LOGIN.INVALID_CREDENTIALS', 400);
            };

            const accessToken = generateAccessToken(user.id);
            const userResponse: UserResponseDto = {
                id: user.id,
                email: user.email,
                name: user.name,
            };

            return {
                accessToken,
                user: userResponse,
            };

        } catch (error) {
            this.logger.error(`LOGIN.FAILED: ${(error as Error).message}`);
            if (error instanceof HttpException) {
                throw error;
            };
            throw new InternalServerErrorException('LOGIN.FAILED');
        };
    };
};