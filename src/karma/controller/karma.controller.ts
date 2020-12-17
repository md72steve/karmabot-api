import { Body, Controller, Post } from '@nestjs/common';
import { ApiOperation } from '@nestjs/swagger';
import { SlackDto } from '../dto/slack.dto';
import { KarmaService } from '../service/karma/karma.service';

@Controller('karma')
export class KarmaController {
  constructor(private karmaService: KarmaService) {}

  @Post()
  @ApiOperation({ summary: 'An endpoint which enables Slack to give karma' })
  public async slackIt(@Body() payload: SlackDto): Promise<void> {
    this.karmaService.handleSlackRequest(payload);
  }
}
