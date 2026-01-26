import { Module } from '@nestjs/common';
import { CounterController } from './counter.controller';
import { CounterService } from './counter.service';

@Module({
  controllers: [CounterController],
  providers: [
    CounterService,
    {
      provide: 'ICounterService',
      useExisting: CounterService,
    },
  ],
  exports: ['ICounterService'],
})
export class CounterModule {}
