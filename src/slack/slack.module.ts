import { HttpModule, Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { SlackUser, SlackUserSchema } from './schema/slack-user.schema';
import { BlockKitBuilderService } from './service/block-kit-builder/block-kit-builder.service';
import { SlackIsService } from './service/slack-is/slack-is.service';
import { SlackPsService } from './service/slack-ps/slack-ps.service';
import { SlackService } from './service/slack/slack.service';

@Module({
  imports: [HttpModule, MongooseModule.forFeature([{ name: SlackUser.name, schema: SlackUserSchema }])],
  providers: [SlackPsService, SlackIsService, SlackService, BlockKitBuilderService],
  exports: [SlackPsService, SlackIsService, SlackService, BlockKitBuilderService],
})
export class SlackModule {}
