import { Injectable } from '@nestjs/common';
import { SlackUser } from 'src/slack/schema/slack-user.schema';
import { SlackPsService } from 'src/slack/service/slack-ps/slack-ps.service';
import { SlackService } from 'src/slack/service/slack/slack.service';
import { SlackDto } from '../../dto/slack.dto';
import { KarmaPsService } from '../karma-ps/karma-ps.service';

@Injectable()
export class KarmaService {
  constructor(private slackService: SlackService, private slackPs: SlackPsService, private karmaPs: KarmaPsService) {}

  public async handleSlackRequest(payload: SlackDto): Promise<void> {
    // gives a "Thank-You" to all mentioned users
    await this.giveThankYou(payload);

    // executes all given commands
    await this.executeCommands(payload);
  }

  private async giveThankYou(payload: SlackDto): Promise<void> {
    const recognisedRecipientNames = this.extractUsers(payload.text, payload.user_name);

    // if we haven't to say thank you ..
    if (recognisedRecipientNames.length === 0) {
      return;
    }

    const recipients = (await this.getSlackUsersByNames(recognisedRecipientNames)).filter(Boolean);
    const giver = await this.slackPs.getSlackUser({ name: payload.user_name });

    await this.karmaPs.giveKarma(giver, recipients);
  }

  /**
   * Gets a list of actually existing {@link SlackUser} for given username
   *
   * @param usernames a list of names of potentials Slack user
   * @returns a list of known {@link SlackUser} matching the given names
   */
  private async getSlackUsersByNames(usernames: string[]): Promise<SlackUser[]> {
    const result = usernames
      .filter(async (name) => (await this.slackService.isUserKnown(name)) || (await this.slackService.isUserKnown(name, true)))
      .map((name) => this.slackPs.getSlackUser({ name }));

    return Promise.all(result);
  }

  private executeCommands(payload: SlackDto): Promise<void> {
    const commands = this.extractCommands(payload.text);

    // nothing to do ...
    if (commands.length === 0) {
      return;
    }

    // TODO execute the command
    console.log('commands to execute: ', commands.join(', '));
  }

  // extracts users from payload's text and filters out certain users
  private extractUsers(payload: string, sender: string): string[] {
    const ignoredUsers = ['here', 'everyone', 'channel', sender];
    const userRegex = /(^@\w*)|((?<=\s)@\w*)/g;
    const result =
      payload
        .match(userRegex)
        .map((user) => user.substr(1)) // ... but we don't need the @
        .filter((user) => !ignoredUsers.includes(user)) || [];

    // eliminate duplicates
    return [...new Set(result)];
  }

  // extracts commands from payload's text
  private extractCommands(payload: string): string[] {
    const cmdRegex = /\b(top10|help)\b/g; // accept only certain keywords
    const result = payload.match(cmdRegex) || [];

    return result;
  }
}
