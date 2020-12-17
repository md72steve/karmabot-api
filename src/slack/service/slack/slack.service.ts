import { Injectable } from '@nestjs/common';
import { SlackIsService } from '../slack-is/slack-is.service';
import { SlackPsService } from '../slack-ps/slack-ps.service';

@Injectable()
export class SlackService {
  constructor(private slackIs: SlackIsService, private slackPs: SlackPsService) {}

  /**
   * Searches for a {@link SlackUser} matching the given username and returns whether this user could be found or not.
   *
   * @param username the name of the user as search criterion
   * @param forceRefresh if true the list of {@link SlackUser} in the database will be refreshed
   * @returns true if a {@link SlackUser} could be found else false
   */
  public async isUserKnown(username: string, forceRefresh = false): Promise<boolean> {
    if (forceRefresh) {
      await this.refreshSlackUserList();
    }
    const result = await this.slackPs.getSlackUser({ name: username });

    return !!result;
  }

  private async refreshSlackUserList(): Promise<void> {
    const users = await this.slackIs.getSlackUserList();
    this.slackPs.saveSlackUsers(users);
  }
}
