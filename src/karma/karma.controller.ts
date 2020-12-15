import { Body, Controller, Post } from '@nestjs/common';
import { ApiOperation } from '@nestjs/swagger';
import { SlackDto } from './dto/slack.dto';
import { KarmaService } from './karma.service';

@Controller('karma')
export class KarmaController {
  constructor(private karmaService: KarmaService) {}

  @Post()
  @ApiOperation({ summary: 'A simple hello-world-endpoint' })
  public async slackIt(@Body() payload: SlackDto): Promise<void> {
    this.karmaService.handleSlackRequest(payload);
  }
}
