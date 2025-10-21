import {
  Injectable,
  BadRequestException,
  UnprocessableEntityException,
} from '@nestjs/common';
import { QueryParamsDto } from './dto/query-params.dto';

@Injectable()
export class NlpService {
  private detectConflicts(filters: Partial<QueryParamsDto>): string | null {
    const { min_length, max_length, word_count } = filters;

    if (
      min_length !== undefined &&
      max_length !== undefined &&
      min_length > max_length
    ) {
      return `min_length (${min_length}) is greater than max_length (${max_length})`;
    }

    if (word_count !== undefined && word_count < 0) {
      return `word_count cannot be negative`;
    }

    return null;
  }

  parseQuery(query: string): Partial<QueryParamsDto> {
    if (!query || typeof query !== 'string') {
      throw new BadRequestException('Unable to parse natural language query');
    }

    const q = query.toLowerCase().trim();
    const filters: Partial<QueryParamsDto> = {};

    // Detect Palidromic
    if (q.includes('palindrom')) {
      filters.is_palindrome = true;
    }

    if (q.includes('palindrom') && q.includes('not palindrom')) {
      throw new UnprocessableEntityException(
        'Query parsed but resulted in conflicting filters',
      );
    }

    if (q.includes('single word')) {
      filters.word_count = 1;
    }

    const longerMatch = q.match(/longer than (\d+) character/);
    if (longerMatch) {
      filters.min_length = parseInt(longerMatch[1]) + 1;
    }

    const shorterMatch = q.match(/shorter than (\d+) character/);
    if (shorterMatch) {
      filters.min_length = parseInt(shorterMatch[1]) - 1;
    }

    const letterMatch = q.match(/letter (\w)/);
    if (letterMatch) {
      filters.contains_character = letterMatch[1];
    }

    if (q.includes('first vowel')) {
      filters.contains_character = 'a';
    }

    const conflict = this.detectConflicts(filters);
    if (conflict) {
      throw new UnprocessableEntityException(
        'Query parsed but resulted in conflicting filters',
      );
    }

    if (Object.keys(filters).length === 0) {
      throw new BadRequestException('Unable to parse natural language query.');
    }

    return filters;
  }
}
