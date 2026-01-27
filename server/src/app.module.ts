import { Module, NestModule, MiddlewareConsumer } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ThrottlerModule, ThrottlerGuard } from '@nestjs/throttler';
import { APP_GUARD } from '@nestjs/core';
<<<<<<< Updated upstream
=======

>>>>>>> Stashed changes
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { QuotesModule } from './quotes/quotes.module';
import { CounterModule } from './counter/counter.module'; // Добавил если есть
import { SharedModule } from './shared/shared.module';
import { UserIdMiddleware } from './middleware/user-id.middleware';
import configuration from './config/configuration';
import { getThrottlerConfig } from './config/throttler.config';

@Module({
  imports: [
    ConfigModule.forRoot({
      load: [configuration],
      isGlobal: true,
    }),
    ThrottlerModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
<<<<<<< Updated upstream
      useFactory: (configService: ConfigService) => [
        {
          ttl: configService.get<number>('rateLimit.ttl') || 30000,
          limit: configService.get<number>('rateLimit.limit') || 333,
        },
      ],
=======
      useFactory: getThrottlerConfig,
>>>>>>> Stashed changes
    }),
    QuotesModule,
    CounterModule, // Если у вас есть модуль counter
    SharedModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(UserIdMiddleware).forRoutes('*');
  }
}
