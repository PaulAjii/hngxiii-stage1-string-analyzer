import { Controller, Post, Body, Get } from '@nestjs/common';

@Controller('strings')
export class StringsController {
  @Get()
  getHello(): string {
    return 'Hello from Strings';
  }

  @Post()
  analyzeString(@Body('value') value: string): string {
    return `Received string: ${value}`;
  }
}
