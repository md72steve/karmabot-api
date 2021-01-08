import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Karma, KarmaDocument } from 'src/karma/schema/karma.schema';
import { SlackUser } from 'src/slack/schema/slack-user.schema';

@Injectable()
export class KarmaPsService {
  constructor(@InjectModel(Karma.name) private karma: Model<KarmaDocument>) {}

  /**
   * Gives karma to one or more {@link SlackUser}s.
   *
   * @param giver the giving {@link SlackUser}
   * @param recipients the receiving {@link SlackUser}s
   */
  public async giveKarma(giver: SlackUser, recipients: SlackUser[]): Promise<void> {
    recipients.forEach(async (recipient) => {
      // Q1: Do we have already any karma for the recipient?
      let find = await this.karma.findOne({ 'owner._id': recipient._id });

      // A1: Nope! - We have to create a completely new entry for the receiving SlackUser
      if (!find) {
        const karma = new Karma();
        karma.owner = { _id: recipient._id, name: recipient.name };
        karma.karma = [{ giver, count: 1 }];
        await this.karma.create(karma);
        return;
      }

      // Q2: Did the recipient ever get karma from the specific giver?
      find = await this.karma.findOne({ 'owner._id': recipient._id, 'karma.giver._id': giver._id });

      // A2: Yes! - Then we have just to increment a counter.
      if (!!find) {
        await this.karma.updateOne({ 'owner._id': recipient._id, 'karma.giver._id': giver._id }, { $inc: { 'karma.$.count': 1 } });
        return;
      }

      // ... else we have to add a new karmaDetail (new giver for the recepient)
      const karmaDetail = { giver, count: 1 };
      await this.karma.updateOne({ 'owner._id': recipient._id }, { $push: { karma: karmaDetail } });
    });
  }

  /**
   * Fetches the complete list of all users with their karma points.
   */
  public async all(): Promise<{ _id: string; amount: number }[]> {
    const result = await this.karma.aggregate([
      { $group: { _id: '$owner.name', amount: { $sum: { $sum: '$karma.count' } } } },
      { $sort: { amount: -1 } },
    ]);

    return result || [];
  }

  /**
   * Fetches a list of the top five users with their karma points
   */
  public async top5(): Promise<{ _id: string; amount: number }[]> {
    const result = await this.karma.aggregate([
      { $group: { _id: '$owner.name', amount: { $sum: { $sum: '$karma.count' } } } },
      { $sort: { amount: -1 } },
      { $limit: 5 },
    ]);

    return result || [];
  }

  /**
   * Fetches the karma for the given userId
   *
   * @param ownerId Slack's userId as selecting criterion
   */
  public async me(ownerId: string): Promise<{ _id: string; amount: number }[]> {
    const result = await this.karma.aggregate([
      { $match: { 'owner._id': ownerId } },
      { $group: { _id: '$owner.name', amount: { $sum: { $sum: '$karma.count' } } } },
    ]);

    return result || [];
  }
}
