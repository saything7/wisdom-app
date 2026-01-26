import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

// Интерфейс для Request с userId
interface RequestWithUserId extends Request {
  userId?: string;
}

@Injectable()
export class UserIdMiddleware implements NestMiddleware {
  use(req: RequestWithUserId, res: Response, next: NextFunction) {
    // Безопасное получение куки
    const cookies = req.cookies as Record<string, string> | undefined;
    let userId = cookies?.userId;

    if (typeof userId !== 'string' || !userId) {
      userId =
        'user_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
      res.cookie('userId', userId, {
        maxAge: 30 * 24 * 60 * 60 * 1000,
        httpOnly: true,
        sameSite: 'lax' as const,
      });
    }

    req.userId = userId;
    next();
  }
}
