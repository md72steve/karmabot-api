import { HttpService, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as FormData from 'form-data';
import { endpoints } from './slack.api.constants';

@Injectable()
export class SlackService {
  private slackBotToken = this.configService.get<string>('slack.token');

  constructor(
    private configService: ConfigService,
    private httpService: HttpService,
  ) {}

  public async refreshUserList(): Promise<string[]> {
    const url = endpoints.usersList;
    const formData = new FormData();
    formData.append('token', this.slackBotToken);

    const response = await this.httpService
      .post(url, formData, {
        headers: formData.getHeaders(),
      })
      .toPromise();

    return (response.data.members as any[])
      .filter((ele) => !ele.is_bot)
      .map((ele) => ele.name);
  }

  public async sendResponse(url: string, msg: string): Promise<void> {
    const message = { text: msg, response_type: 'ephemeral' };

    this.httpService.post(url, message, {
      headers: { 'Content-Type': 'application/json' },
    });
  }
}
