import {
  Injectable,
  ConflictException,
  BadRequestException,
  UnprocessableEntityException,
  NotFoundException,
} from '@nestjs/common';
import { ResponseDto } from './dto/response.dto';
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
}
