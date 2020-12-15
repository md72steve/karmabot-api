import { Injectable } from '@nestjs/common';
import { SlackService } from 'src/slack/slack.service';
import { SlackDto } from './dto/slack.dto';

@Injectable()
export class KarmaService {
  constructor(private slackService: SlackService) {}

  public async handleSlackRequest(payload: SlackDto): Promise<void> {
    console.log('payload: ', payload);

    // gives a "Thank-You" to all mentioned users
    this.giveThankYou(payload);

    // executes all given commands
    this.executeCommands(payload);
  }

  private async giveThankYou(payload: SlackDto): Promise<void> {
    const recognisedUsers = await this.extractUsers(payload.text, payload.user_name);

    // no Thank-You to give ...
    if (recognisedUsers.length === 0) {
      return;
    }

    // TODO give the Thank-Yous
    console.log('Thank-Yous go to: ', recognisedUsers.join(', '));
  }

  private async executeCommands(payload: SlackDto): Promise<void> {
    const commands = await this.extractCommands(payload.text);

    // nothing to do ...
    if (commands.length === 0) {
      return;
    }

    // TODO execute the command
    console.log('commands to execute: ', commands.join(', '));
  }

  // extracts users from payload's text and filters out certain users
  private async extractUsers(payload: string, sender: string): Promise<string[]> {
    const ignoredUsers = ['here', 'everyone', 'channel', sender];
    // const userRegex = /@\w*/g; // usernames start with @
    const userRegex = /(^@\w*)|((?<=\s)@\w*)/g;
    const result =
      payload
        .match(userRegex)
        .map((user) => user.substr(1)) // ... but we don't need the @
        .filter((user) => !ignoredUsers.includes(user)) || [];

    return result;
  }

  // extracts commands
  private async extractCommands(payload: string): Promise<string[]> {
    const cmdRegex = /\b(top10|help)\b/g; // accept only certain keywords
    const result = payload.match(cmdRegex) || [];

    return result;
  }
}
