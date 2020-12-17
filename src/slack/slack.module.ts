import { HttpModule, Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { SlackUser, SlackUserSchema } from './schema/slack-user.schema';
import { SlackIsService } from './service/slack-is/slack-is.service';
import { SlackPsService } from './service/slack-ps/slack-ps.service';
import { SlackService } from './service/slack/slack.service';

@Module({
  imports: [HttpModule, MongooseModule.forFeature([{ name: SlackUser.name, schema: SlackUserSchema }])],
  providers: [SlackPsService, SlackIsService, SlackService],
  exports: [SlackPsService, SlackIsService, SlackService],
})
export class SlackModule {}
