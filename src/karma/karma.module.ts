import { Module } from '@nestjs/common';
import { SlackModule } from 'src/slack/slack.module';
import { KarmaController } from './karma.controller';
import { KarmaService } from './karma.service';

@Module({
  imports: [SlackModule],
  controllers: [KarmaController],
  providers: [KarmaService],
})
export class KarmaModule {}
