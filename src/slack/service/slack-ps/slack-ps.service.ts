import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { SlackUser, SlackUserDocument } from '../../schema/slack-user.schema';

@Injectable()
export class SlackPsService {
  constructor(@InjectModel(SlackUser.name) private slackUserModel: Model<SlackUserDocument>) {}

  /**
   * Saves or updates the list of slack users in the database.
   *
   * @param users an array of slack users
   */
  public async saveSlackUsers(users: SlackUser[]): Promise<void> {
    try {
      await this.slackUserModel.insertMany(users, { ordered: false });
    } catch (ex) {
      console.warn('found duplicates, but will turn a blind eye on that');
    }
  }

  /**
   * Retrieves a slack user from the database matching a given criterion, e.g. name="schlupp2002".
   *
   * @param criterion the criterion
   * @return a slack user | null
   */
  public async getSlackUser(criterion: Partial<SlackUser>): Promise<SlackUser> {
    const result = await this.slackUserModel.findOne(criterion);

    if (!result) {
      return null;
    }

    return { _id: result._id, name: result.name };
  }
}
