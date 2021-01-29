import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Block, WebClient } from '@slack/web-api';
import { SlackDto } from 'src/karma/dto/slack.dto';
import { SlackUser } from '../../schema/slack-user.schema';

@Injectable()
export class SlackIsService {
  /** Slack's official {@link WebClient} */
  private slackClient = new WebClient(this.configService.get<string>('slack.token'));

  constructor(private configService: ConfigService) {}

  /**
   * Retrieves a list of users for the Slack workspace associated with the slackToken
   * and converts them to a list of simplified {@link SlackUser}s
   *
   * @return a (possibly empty) list of {@link SlackUser}s
   */
  public async usersList(): Promise<SlackUser[]> {
    try {
      const result = await this.slackClient.users.list();
      return (result.members as any[]).filter((ele) => !ele.is_bot).map((ele) => ({ _id: ele.id, name: ele.name }));
    } catch (err) {
      console.error(err);
    }
    return [];
  }

  /**
   * Sends a message visible for all users of a channel
   *
   * @param blocks the message blocks
   * @param slackDto the {@link SlackDto} supplies the channel_id
   */
  public async chatPostMessage(blocks: Block[], slackDto: SlackDto): Promise<void> {
    try {
      await this.slackClient.chat.postMessage({ channel: slackDto.channel_id, text: '', blocks });
    } catch (err) {
      console.log(err);
    }
  }

  /**
   * Sends a message visible only for a specific user
   *
   * @param blocks the message blocks
   * @param slackDto the {@link SlackDto} supplies the channel_id and the user_id
   */
  public async chatPostEphemeral(blocks: Block[], slackDto: SlackDto) {
    const message = { text: '', channel: slackDto.channel_id, user: slackDto.user_id, blocks };

    try {
      await this.slackClient.chat.postEphemeral(message);
    } catch (err) {
      console.error(err);
    }
  }

  public async usersInfo(userId: string): Promise<{ real_name: string; image_link: string }> {
    let result;

    try {
      result = await this.slackClient.users.info({ user: userId });
      console.log('result:', result);
      return null;
    } catch (err) {
      console.error(err);
    }
  }
}
