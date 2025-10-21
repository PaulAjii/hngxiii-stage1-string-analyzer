import { IsString, IsBoolean, IsNumber, IsOptional } from 'class-validator';
import { Type } from 'class-transformer';

export class QueryParamsDto {
  @IsOptional()
  @IsBoolean({ message: 'Invalid query parameter values or types' })
  @Type(() => Boolean)
  is_palindrome?: boolean;

  @IsOptional()
  @IsNumber({}, { message: 'Invalid query parameter values or types' })
  @Type(() => Number)
  min_length: number;

  @IsOptional()
  @IsNumber({}, { message: 'Invalid query parameter values or types' })
  @Type(() => Number)
  max_length: number;

  @IsOptional()
  @IsNumber({}, { message: 'Invalid query parameter values or types' })
  @Type(() => Number)
  word_count: number;

  @IsOptional()
  @IsString({ message: 'Invalid query parameter values or types' })
  contains_character: string;
}
