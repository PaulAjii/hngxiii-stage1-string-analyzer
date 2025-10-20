import { IsString, IsNotEmpty } from 'class-validator';

export class CreateValueDto {
  @IsString()
  @IsNotEmpty()
  value: string;
}
