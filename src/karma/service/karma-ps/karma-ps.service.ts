import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Karma, KarmaDocument } from 'src/karma/schema/karma.schema';
import { SlackUser } from 'src/slack/schema/slack-user.schema';

@Injectable()
export class KarmaPsService {
  constructor(@InjectModel(Karma.name) private karma: Model<KarmaDocument>) {}

  public async giveKarma(giver: SlackUser, recipients: SlackUser[]): Promise<void> {
    recipients.forEach(async (recipient) => {
      // do we have already any karma for the recipient
      let find = await this.karma.findOne({ 'owner._id': recipient._id });

      // ...nope!
      if (!find) {
        const karma = new Karma();
        karma.owner = { _id: recipient._id, name: recipient.name };
        karma.karma = [{ giver, count: 1 }];
        await this.karma.create(karma);
        return;
      }

      // did the recipient ever get karma from the specific giver?
      find = await this.karma.findOne({ 'owner._id': recipient._id, 'karma.giver._id': giver._id });

      // ... yes! -> just increment the counter
      if (!!find) {
        await this.karma.updateOne({ 'owner._id': recipient._id, 'karma.giver._id': giver._id }, { $inc: { 'karma.$.count': 1 } });
        return;
      }

      // ... else we have to add a new karmaDetail (new giver for the recepient)
      const karmaDetail = { giver, count: 1 };
      await this.karma.updateOne({ 'owner._id': recipient._id }, { $push: { karma: karmaDetail } });
    });
  }
}
