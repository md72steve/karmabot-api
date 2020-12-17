import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { SlackModule } from 'src/slack/slack.module';
import { KarmaController } from './controller/karma.controller';
import { Karma, KarmaSchema } from './schema/karma.schema';
import { KarmaPsService } from './service/karma-ps/karma-ps.service';
import { KarmaService } from './service/karma/karma.service';

@Module({
  imports: [SlackModule, MongooseModule.forFeature([{ name: Karma.name, schema: KarmaSchema }])],
  controllers: [KarmaController],
  providers: [KarmaService, KarmaPsService],
})
export class KarmaModule {}
