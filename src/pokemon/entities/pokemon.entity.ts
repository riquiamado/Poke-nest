import { Prop, SchemaFactory, Schema } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema()
export class Pokemon extends Document {
  @Prop({ required: true, unique: true, index: true })
  no: number;
  @Prop({ required: true, unique: true, index: true })
  name: string;
}

export const PokemonSchema = SchemaFactory.createForClass(Pokemon);
