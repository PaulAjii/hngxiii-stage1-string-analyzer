import { Controller, Post, Body, Get, Param } from '@nestjs/common';
import { StringsService } from './strings.service';
import { ResponseDto } from './dto/response.dto';

@Controller('strings')
export class StringsController {
  constructor(private readonly stringsService: StringsService) {}

  @Get()
  getHello(): string {
    return 'Hello from Strings';
  }

  @Post()
  analyzeString(@Body('value') value: string): ResponseDto {
    return this.stringsService.analyzeString(value);
  }

  @Get(':string_value')
  findOneString(@Param('string_value') string_value: string): ResponseDto {
    return this.stringsService.findOneString(string_value);
  }
}
