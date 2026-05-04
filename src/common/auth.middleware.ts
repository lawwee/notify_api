import { Injectable, NestMiddleware, UnauthorizedException } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import * as jwt from 'jsonwebtoken';

import { PrismaService } from '../prisma.service';
import { IUser } from '../user/user.interface';
import { Environment } from '../config/env.config';

@Injectable()
export class AuthMiddleware implements NestMiddleware {
    constructor(private readonly prisma: PrismaService) {}

    async use(request: Request & { user?: IUser }, response: Response, next: NextFunction): Promise<void> {
        const authHeader = request.headers.authorization;

        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            throw new UnauthorizedException('AUTH.TOKEN_MISSING');
        };

        const token = authHeader.split(' ')[1];

        let payload: { userId: string };
        try {
            payload = jwt.verify(
                token,
                Environment.JWT_SECRET,
            ) as { userId: string };
        } catch {
            throw new UnauthorizedException('AUTH.TOKEN_INVALID');
        };

        const user = await this.prisma.user.findUnique({ where: { id: payload.userId } });
        if (!user) {
            throw new UnauthorizedException('AUTH.USER_NOT_FOUND');
        };

        request.user = user;
        next();
    };
};
