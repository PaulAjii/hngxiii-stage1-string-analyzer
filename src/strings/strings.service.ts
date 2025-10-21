import {
  Injectable,
  ConflictException,
  BadRequestException,
  UnprocessableEntityException,
  NotFoundException,
} from '@nestjs/common';
import { ResponseDto } from './dto/response.dto';
import { QueryParamsDto } from './dto/query-params.dto';
import { sha256Hash, isPalindrome, uniqueCharacters, wordCount } from './utils';
import { AnalyzedString } from './interfaces/strings.interface';

@Injectable()
export class StringsService {
  private analyzedStrings: AnalyzedString[] = [];
  private characterFrequencyMap = (str: string) => {
    const frequencyMap = new Map<string, number>();

    for (const char of str) {
      frequencyMap.set(char, (frequencyMap.get(char) || 0) + 1);
    }
    return Object.fromEntries(frequencyMap);
  };

  analyzeString(value: string) {
    if (!value) {
      throw new BadRequestException(
        'Invalid request body or missing "value" field',
      );
    }

    if (typeof value !== 'string') {
      throw new UnprocessableEntityException(
        'Invalid data type for "value" (must be string)',
      );
    }

    const existingString = this.analyzedStrings.find(
      (str) => str.value === value,
    );
    if (existingString) {
      throw new ConflictException('String already exists in the system');
    }

    const id = sha256Hash(value.trim());

    const analyzedString: ResponseDto = {
      id,
      value,
      properties: {
        length: value.length,
        is_palindrome: isPalindrome(value),
        unique_characters: uniqueCharacters(value),
        word_count: wordCount(value),
        sha256_hash: id,
        character_frequency_map: this.characterFrequencyMap(value),
      },
      created_at: new Date().toISOString(),
    };

    this.analyzedStrings.push(analyzedString);

    return analyzedString;
  }

  findOneString(value: string): ResponseDto {
    const stringData = this.analyzedStrings.find((str) => str.value === value);

    if (!stringData) {
      throw new NotFoundException('String does not exist in the system');
    }

    return stringData as ResponseDto;
  }

  filterAll(query: QueryParamsDto) {
    let filteredStrings = [...this.analyzedStrings];

    if (query.is_palindrome !== undefined) {
      filteredStrings = filteredStrings.filter(
        (s) => s?.properties?.is_palindrome === query.is_palindrome,
      );
    }

    if (query.max_length !== undefined) {
      filteredStrings = filteredStrings.filter(
        (s) => s?.properties?.length <= query.max_length,
      );
    }

    if (query.min_length !== undefined) {
      filteredStrings = filteredStrings.filter(
        (s) => s?.properties?.length >= query.min_length,
      );
    }

    if (query.word_count !== undefined) {
      filteredStrings = filteredStrings.filter(
        (s) => s?.properties?.word_count === query.word_count,
      );
    }

    if (query.contains_character !== undefined) {
      filteredStrings = filteredStrings.filter((s) =>
        s?.value.toLowerCase().includes(query.contains_character.toLowerCase()),
      );
    }

    return {
      data: filteredStrings,
      count: filteredStrings.length,
      filters_applied: { ...query },
    };
  }

  deleteString(value: string): void {
    const stringIndex = this.analyzedStrings.findIndex(
      (s) => s.value === value,
    );

    if (stringIndex === -1) {
      throw new NotFoundException('String does not exist in the system');
    }

    this.analyzedStrings.splice(stringIndex, 1);
  }
}
