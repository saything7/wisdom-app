// counter/dto/counter-response.dto.ts
import { ApiProperty } from '@nestjs/swagger';

export class CounterResponseDto {
  @ApiProperty({ description: 'ID пользователя' })
  userId: string;

  @ApiProperty({ description: 'Количество запросов в текущей сессии' })
  count: number;

  @ApiProperty({ description: 'Общее количество запросов за всё время' })
  totalCount: number;

  @ApiProperty({
    description: 'Время последнего запроса',
    required: false,
  })
  lastRequestTime?: Date;

  @ApiProperty({ description: 'Время формирования ответа' })
  timestamp: string;
}

export class AllStatsResponseDto {
  @ApiProperty({ description: 'Общее количество пользователей' })
  totalUsers: number;

  @ApiProperty({
    description: 'Статистика по всем пользователям',
    type: 'object',
    additionalProperties: {
      type: 'object',
      properties: {
        userId: { type: 'string' },
        count: { type: 'number' },
        totalCount: { type: 'number' },
        lastRequestTime: { type: 'string', format: 'date-time' },
      },
    },
  })
  counters: Record<string, unknown>;

  @ApiProperty({ description: 'Время формирования ответа' })
  timestamp: string;
}
