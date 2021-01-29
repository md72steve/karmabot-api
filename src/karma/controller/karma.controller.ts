import { Body, Controller, Post } from '@nestjs/common';
import { ApiOperation } from '@nestjs/swagger';
import { SlackDto } from '../dto/slack.dto';
import { KarmaService } from '../service/karma/karma.service';

/**
 * The KarmaController offers the endpoint for Slack
 *
 * @author Steffen Bauer (IBM CIC Germany GmbH)
 */
@Controller('karma')
export class KarmaController {
  constructor(private karmaService: KarmaService) {}

  @Post()
  @ApiOperation({ summary: 'An endpoint which enables Slack to give karma' })
  public async slackIt(@Body() slackDto: SlackDto): Promise<void> {
    this.karmaService.handleSlackRequest(slackDto);
  }
}
