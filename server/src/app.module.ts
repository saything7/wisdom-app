import { Module } from '@nestjs/common';
import { ThrottlerModule, ThrottlerGuard } from '@nestjs/throttler';
import { APP_GUARD } from '@nestjs/core';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { QuotesModule } from './quotes/quotes.module';
import { CounterModule } from './counter/counter.module';

@Module({
  imports: [
    ThrottlerModule.forRoot([
      {
        ttl: 30000, // 30 секунд
        limit: 333, // 333 запроса
      },
    ]),
    QuotesModule,
    CounterModule,
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
export class AppModule {}
