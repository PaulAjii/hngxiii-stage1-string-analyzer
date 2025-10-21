import { Module } from '@nestjs/common';
import { StringsController } from './strings.controller';
import { StringsService } from './strings.service';
import { NlpService } from './nlp.service';

@Module({
  controllers: [StringsController],
  providers: [StringsService, NlpService],
})
export class StringsModule {}
