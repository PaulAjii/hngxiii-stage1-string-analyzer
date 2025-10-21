import { IsAlpha, IsBoolean, IsNumber, IsOptional } from 'class-validator';

export class QueryParamsDto {
  @IsOptional()
  @IsBoolean()
  is_palindrome: boolean;

  @IsOptional()
  @IsNumber()
  min_length: number;

  @IsOptional()
  @IsNumber()
  max_length: number;

  @IsOptional()
  @IsNumber()
  word_count: number;

  @IsOptional()
  @IsAlpha()
  contains_character: string;
}
