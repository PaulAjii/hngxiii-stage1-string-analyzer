import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { StringsModule } from './strings/strings.module';
import { StringsController } from './strings/strings.controller';
import { StringsService } from './strings/strings.service';
import { NlpService } from './strings/nlp.service';

@Module({
  imports: [StringsModule],
  controllers: [AppController, StringsController],
  providers: [AppService, StringsService, NlpService],
})
export class AppModule {}
