import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { SlackUser } from 'src/slack/schema/slack-user.schema';

export type KarmaDocument = Karma & Document;

export type KarmaDetail = [{ giver: SlackUser; count: number }];

@Schema()
export class Karma {
  @Prop()
  owner: SlackUser;

  @Prop()
  karma: KarmaDetail;
}

export const KarmaSchema = SchemaFactory.createForClass(Karma);
