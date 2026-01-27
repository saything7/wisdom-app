import { IsString, MinLength, MaxLength, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { VALIDATION_CONSTANTS } from '../constants/validation.constants';

export class CreateQuoteDto {
  @ApiProperty({
    description: 'Текст цитаты',
    example: 'Жизнь - это то, что происходит с тобой, пока ты строишь планы.',
    minLength: VALIDATION_CONSTANTS.QUOTE.MIN_LENGTH,
    maxLength: VALIDATION_CONSTANTS.QUOTE.MAX_LENGTH,
  })
  @IsString()
  @MinLength(VALIDATION_CONSTANTS.QUOTE.MIN_LENGTH, {
    message: VALIDATION_CONSTANTS.QUOTE.MESSAGES.MIN_LENGTH,
  })
  @MaxLength(VALIDATION_CONSTANTS.QUOTE.MAX_LENGTH, {
    message: VALIDATION_CONSTANTS.QUOTE.MESSAGES.MAX_LENGTH,
  })
  text: string;

  @ApiProperty({
    description: 'Автор цитаты',
    example: 'Альберт Эйнштейн',
    required: false,
  })
  @IsOptional()
  @IsString()
  @MaxLength(VALIDATION_CONSTANTS.AUTHOR.MAX_LENGTH, {
    message: VALIDATION_CONSTANTS.AUTHOR.MESSAGE,
  })
  author?: string;

  @ApiProperty({
    description: 'Категория цитаты',
    example: 'Мотивация',
    required: false,
  })
  @IsOptional()
  @IsString()
  @MaxLength(VALIDATION_CONSTANTS.CATEGORY.MAX_LENGTH, {
    message: VALIDATION_CONSTANTS.CATEGORY.MESSAGE,
  })
  category?: string;
}
