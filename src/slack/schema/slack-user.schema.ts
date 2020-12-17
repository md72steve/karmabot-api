import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type SlackUserDocument = SlackUser & Document;

@Schema()
export class SlackUser {
  /**
   * The Slack id of the user, e.g. 'U01HK1J97T2'
   */
  @Prop()
  _id: string;

  /**
   * The Slack name of the user, e.g. 'schlupp2002_dto'
   */
  @Prop()
  name: string;
}

export const SlackUserSchema = SchemaFactory.createForClass(SlackUser);
