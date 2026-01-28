// src/config/throttler.config.ts
import { ConfigService } from '@nestjs/config';
import { ThrottlerModuleOptions } from '@nestjs/throttler';

export const getThrottlerConfig = (
  configService: ConfigService,
): ThrottlerModuleOptions => [
  {
    ttl: configService.get<number>('rateLimit.ttl') || 3600000,
    limit: configService.get<number>('rateLimit.limit') || 3,
  },
];
