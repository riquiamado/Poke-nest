import { Prop, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export class Pokemon extends Document {
  @Prop({ unique: true, index: true })
  no: number;
  @Prop({ unique: true, index: true })
  name: string;
}

export const PokemonSchema = SchemaFactory.createForClass(Pokemon);
