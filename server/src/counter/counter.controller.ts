// server/src/counter/counter.controller.ts
import { Controller, Get, Req, Res } from '@nestjs/common';
import { CounterService } from './counter.service';
import type { Request, Response } from 'express'; // Измени эту строку

@Controller('counter')
export class CounterController {
    constructor(private readonly counterService: CounterService) {}

    @Get()
    getCount(@Req() request: Request, @Res() response: Response) {
        // Получаем или создаём userId из cookies
        let userId = request.cookies?.userId;

        if (!userId) {
            // Генерируем новый ID для пользователя без cookie
            userId = `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
            // Устанавливаем cookie на 30 дней
            response.cookie('userId', userId, {
                maxAge: 30 * 24 * 60 * 60 * 1000,
                httpOnly: true,
            });
        }

        const count = this.counterService.getCount(userId);

        return response.json({
            userId,
            count,
            timestamp: new Date().toISOString(),
        });
    }
}