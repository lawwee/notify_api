import { Injectable } from '@nestjs/common';
import { Logger } from '@nestjs/common';

import { PrismaService } from '../prisma.service';

@Injectable()
export class UserService {
    private readonly logger = new Logger(UserService.name);

    constructor(
        private readonly prisma: PrismaService,
    ) {};

    async signup(email: string, password: string) {
        try {
            const checkUser = await this.prisma.user.findUnique({ where: { email } });
            if (checkUser) {
                throw new Error('SIGNUP.USER_ALREADY_EXISTS');
            };

            const user = await this.prisma.user.create({
                data: {
                    email,
                    password,
                },
            });
            
            return user;

        } catch (error) {
            this.logger.error(`SIGNUP.FAILED: ${(error as Error).message}`);
            throw error;
        };
    };
};