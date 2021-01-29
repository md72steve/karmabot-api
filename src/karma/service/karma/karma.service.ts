import { Injectable } from '@nestjs/common';
import { Block } from '@slack/bolt';
import { KarmaResult } from 'src/karma/dto/karma-result.dto';
import { SlackUser } from 'src/slack/schema/slack-user.schema';
import { BlockKitBuilderService } from 'src/slack/service/block-kit-builder/block-kit-builder.service';
import { SlackIsService } from 'src/slack/service/slack-is/slack-is.service';
import { SlackPsService } from 'src/slack/service/slack-ps/slack-ps.service';
import { SlackService } from 'src/slack/service/slack/slack.service';
import { SlackDto } from '../../dto/slack.dto';
import { KarmaPsService } from '../karma-ps/karma-ps.service';

@Injectable()
export class KarmaService {
  constructor(
    private slackService: SlackService,
    private slackPs: SlackPsService,
    private karmaPs: KarmaPsService,
    private slackIs: SlackIsService,
  ) {}

  public async handleSlackRequest(payload: SlackDto): Promise<void> {
    // gives a "Thank-You" to all mentioned users
    const thanksGiven = await this.giveThankYou(payload);

    // executes all given commands
    this.executeCommands(payload, thanksGiven);
  }

  /**
   * Sends a thank-you to a single user or a list of users, depending on the submitted {@link SlackDto}
   *
   * @param slackDto The original {@link SlackDto} supplied by Slack
   * @return true, if at least one thank-you was given
   */
  private async giveThankYou(slackDto: SlackDto): Promise<boolean> {
    const recognisedRecipientNames = this.extractUsers(slackDto.text, slackDto.user_name);

    // if we haven't to say thank you ..
    if (recognisedRecipientNames.length === 0) {
      return false;
    }

    // get an array of valid Slack users (valid means a) the user must exists b) the user is not the giver itself)
    const recipients = (await this.getSlackUsersByNames(recognisedRecipientNames)).filter(Boolean);

    // we have no valid user
    if (recipients.length === 0) {
      return false;
    }

    const giver = await this.slackPs.getSlackUser({ name: slackDto.user_name });
    await this.karmaPs.giveKarma(giver, recipients);

    this.announceDonation(slackDto, giver, recipients);

    return true;
  }

  /**
   * Executes the commands extracted from the {@link SlackDto}
   * Shows a help message, if no command is supplied and no thank-yous were given.
   *
   * @param slackDto The original {@link SlackDto} supplied by Slack
   * @param thanksGiven if true, at least one thank-you was given and we don't have to show a help message
   */
  private executeCommands(slackDto: SlackDto, thanksGiven: boolean): Promise<void> {
    const commands = this.extractCommands(slackDto.text);

    // nothing to do and no thank-you was given
    if (commands.length === 0 && !thanksGiven) {
      this.showHelp(slackDto);
      return;
    }

    commands.forEach((cmd) => {
      switch (cmd) {
        case 'all':
          this.showAll(slackDto);
          break;
        case 'top5':
          this.showTop5(slackDto);
          break;
        case 'me':
          this.showMe(slackDto);
          break;
        default:
        case 'help':
          this.showHelp(slackDto);
          break;
      }
    });
  }

  /**
   * Gets a list of actually existing {@link SlackUser} for given username
   *
   * @param usernames a list of names of potentials Slack user
   * @return a list of known {@link SlackUser} matching the given names
   */
  private getSlackUsersByNames(usernames: string[]): Promise<SlackUser[]> {
    const result = usernames
      .filter(async (name) => (await this.slackService.isUserKnown(name)) || (await this.slackService.isUserKnown(name, true)))
      .map((name) => this.slackPs.getSlackUser({ name }));

    return Promise.all(result);
  }

  /**
   * Extracts all users from payload's text and removes certain users from the result.
   *
   * @param payload the Slack payload containing the users, e.g. @users @user2 ...
   * @param sender the sender of the Slack request
   * @return a sanitized list of thank-you receipients.
   */
  private extractUsers(payload: string, sender: string): string[] {
    // here, everyone and channel are Slack users and the sender itself is not allowed as receipient
    const ignoredUsers = ['here', 'everyone', 'channel', sender];
    // accepts @user, but not demo@example.com
    const userRegex = /(^@\w*)|((?<=\s)@\w*)/g;
    const result = payload.match(userRegex);

    if (!result) {
      return [];
    }

    const processed =
      result
        .map((user) => user.substr(1)) // ... but we don't need the @
        .filter((user) => !ignoredUsers.includes(user)) || [];

    // eliminate duplicates
    return [...new Set(processed)];
  }

  // extracts commands from payload's text
  private extractCommands(payload: string): string[] {
    const cmdRegex = /\b(all|top5|me|help)\b/g; // accept only certain keywords
    const result = payload.match(cmdRegex) || [];

    return result;
  }

  // chat.postMessage
  private async announceDonation(slackDto: SlackDto, giver: SlackUser, recipients: SlackUser[]): Promise<void> {
    const text = `*${giver.name}* gives a thank-you to *${recipients.map((recipient) => `@${recipient.name}`).join(', ')}*`;
    const blocks = [];

    blocks.push(BlockKitBuilderService.createMarkdown(text));
    this.slackIs.chatPostMessage(blocks, slackDto);
  }

  // chat.postEphemeral
  private async showAll(slackDto: SlackDto): Promise<void> {
    const karmaResult: KarmaResult[] = await this.karmaPs.all();

    if (karmaResult.length > 0) {
      this.slackIs.chatPostEphemeral(this.buildBlocks('All users', karmaResult), slackDto);
      return;
    }
  }

  // chat.postEphemeral
  private async showTop5(slackDto: SlackDto): Promise<void> {
    const karmaResult: KarmaResult[] = await this.karmaPs.top5();

    if (karmaResult.length > 0) {
      this.slackIs.chatPostEphemeral(this.buildBlocks('Top5', karmaResult), slackDto);
      return;
    }
  }

  // chat.postEphemeral
  private async showMe(slackDto: SlackDto): Promise<void> {
    const karmaResult: KarmaResult[] = await this.karmaPs.me(slackDto.user_id);

    if (karmaResult.length > 0) {
      this.slackIs.chatPostEphemeral(this.buildBlocks('Your stats', karmaResult), slackDto);
      return;
    }
  }

  // chat.postEphemeral
  private async showHelp(slackDto: SlackDto): Promise<void> {
    this.slackIs.chatPostEphemeral(BlockKitBuilderService.createHelp(), slackDto);
  }

  private buildBlocks(title: string, content: KarmaResult[]): Block[] {
    const blocks = [];
    blocks.push(BlockKitBuilderService.createHeader(title));
    content.forEach((res) => blocks.push(BlockKitBuilderService.createMarkdown(`*${res._id}*: ${res.amount}`)));
    return blocks;
  }
}
