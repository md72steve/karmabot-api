import { HttpService, HttpStatus, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as FormData from 'form-data';
import { endpoints } from '../../common/slack.api.constants';
import { SlackUser } from '../../schema/slack-user.schema';

@Injectable()
export class SlackIsService {
  private slackBotToken = this.configService.get<string>('slack.token');

  constructor(private configService: ConfigService, private httpService: HttpService) {}

  /**
   * Retrieves a list of users for the Slack workspace associated with the slackBotToken
   * and converts them to a list of simplified {@link SlackUser}s
   *
   * @returns a (possibly empty) list of {@link SlackUser}s
   */
  public async getSlackUserList(): Promise<SlackUser[]> {
    const url = endpoints.usersList;
    const formData = new FormData();
    formData.append('token', this.slackBotToken);

    const response = await this.httpService
      .post(url, formData, {
        headers: formData.getHeaders(),
      })
      .toPromise();

    switch (response.status) {
      case HttpStatus.OK:
        return (response.data.members as any[]).filter((ele) => !ele.is_bot).map((ele) => ({ _id: ele.id, name: ele.name }));
      default:
      case HttpStatus.NOT_FOUND:
        return [];
    }
  }

  // TODO
  public async sendResponse(url: string, msg: string): Promise<void> {
    const message = { text: msg, response_type: 'ephemeral' };

    await this.httpService
      .post(url, message, {
        headers: { 'Content-Type': 'application/json' },
      })
      .toPromise()
      .catch((err) => console.error(err));
  }

  /**
   * Retrieves a single {@link SlackUser} from the Slack workspace
   *
   * @param username as selectiong criterion
   * @returns the {@link SlackUser} or null
   */
  public async getSlackUserByName(username: string): Promise<SlackUser> {
    const result = (await this.getSlackUserList()).filter((user) => user.name === username);

    if (result.length === 0) {
      return null;
    }

    return result[0];
  }
}
