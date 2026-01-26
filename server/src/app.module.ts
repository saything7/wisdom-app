// server/src/app.module.ts
import { Module, NestModule, MiddlewareConsumer } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ThrottlerModule, /*ThrottlerGuard*/ } from '@nestjs/throttler';
import { /*APP_GUARD*/ } from '@nestjs/core';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { QuotesModule } from './quotes/quotes.module';
import { SharedModule } from './shared/shared.module'; // Добавить
import { UserIdMiddleware } from './middleware/user-id.middleware';
import configuration from './config/configuration';

@Module({
  imports: [
    ConfigModule.forRoot({
      load: [configuration],
      isGlobal: true,
    }),
    ThrottlerModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => [
        {
          ttl: configService.get<number>('rateLimit.ttl') || 3600000,
          limit: configService.get<number>('rateLimit.limit') || 300,
        },
      ],
    }),
    QuotesModule,
    SharedModule, // Добавить сюда
  ],
  controllers: [AppController],
  providers: [
    AppService,
    /*{
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },*/
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(UserIdMiddleware).forRoutes('*');
  }
}
