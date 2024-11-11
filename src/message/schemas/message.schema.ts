import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type MessageDocument = HydratedDocument<Message>

@Schema()
export class Message {
  @Prop({required:true})
  sender: string;

  @Prop({required:true})
  room: string;

  @Prop({required:true})
  message:string;
}

export const MessageSchema = SchemaFactory.createForClass(Message)