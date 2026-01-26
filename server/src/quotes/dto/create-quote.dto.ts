import { IsString, MinLength, MaxLength, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateQuoteDto {
  @ApiProperty({
    description: 'Текст цитаты',
    example: 'Жизнь - это то, что происходит с тобой, пока ты строишь планы.',
    minLength: 5,
    maxLength: 500,
  })
  @IsString()
  @MinLength(5, { message: 'Цитата должна содержать минимум 5 символов' })
  @MaxLength(500, { message: 'Цитата не должна превышать 500 символов' })
  text: string;

  @ApiProperty({
    description: 'Автор цитаты',
    example: 'Альберт Эйнштейн',
    required: false,
  })
  @IsOptional()
  @IsString()
  @MaxLength(100, { message: 'Имя автора не должно превышать 100 символов' })
  author?: string;

  @ApiProperty({
    description: 'Категория цитаты',
    example: 'Мотивация',
    required: false,
  })
  @IsOptional()
  @IsString()
  @MaxLength(50, { message: 'Категория не должна превышать 50 символов' })
  category?: string;
}
