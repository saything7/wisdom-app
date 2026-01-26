import { Module, Global } from '@nestjs/common';
import { CounterModule } from '../counter/counter.module';

@Global()
@Module({
  imports: [CounterModule], // Импортируем CounterModule
  exports: [CounterModule], // Экспортируем его сервисы
})
export class SharedModule {}
