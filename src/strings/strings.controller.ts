import {
  Controller,
  Post,
  Body,
  Get,
  Param,
  Query,
  Delete,
  HttpCode,
} from '@nestjs/common';
import { StringsService } from './strings.service';
import { NlpService } from './nlp.service';
import { ResponseDto } from './dto/response.dto';
import { QueryParamsDto } from './dto/query-params.dto';

@Controller('strings')
export class StringsController {
  constructor(
    private readonly stringsService: StringsService,
    private readonly nlpService: NlpService,
  ) {}

  @Post()
  analyzeString(@Body('value') value: string): ResponseDto {
    return this.stringsService.analyzeString(value);
  }

  @Get()
  filterAll(@Query() query: QueryParamsDto) {
    return this.stringsService.filterAll(query);
  }

  @Get('filter-by-natural-language')
  filterByNlp(@Query('query') query: string) {
    const parsedQuery = this.nlpService.parseQuery(query);
    const filters = this.filterAll(parsedQuery as QueryParamsDto);

    return {
      data: filters.data,
      count: filters.count,
      interpreted_query: {
        original: query,
        parsed_filters: parsedQuery,
      },
    };
  }

  @Get(':string_value')
  findOneString(@Param('string_value') string_value: string): ResponseDto {
    return this.stringsService.findOneString(string_value);
  }

  @Delete(':string_value')
  @HttpCode(204)
  deleteString(@Param('string_value') string_value: string): void {
    return this.stringsService.deleteString(string_value);
  }
}
