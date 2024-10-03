import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { isValidObjectId, Model } from 'mongoose';
import { Pokemon } from './entities/pokemon.entity';
import { CreatePokemonDto } from './dto/create-pokemon.dto';
import { UpdatePokemonDto } from './dto/update-pokemon.dto';

@Injectable()
export class PokemonService {
  constructor(
    @InjectModel(Pokemon.name)
    private readonly pokemonModel: Model<Pokemon>,
  ) {}

  async create(createPokemonDto: CreatePokemonDto) {
    createPokemonDto.name = createPokemonDto.name.toLowerCase();
    try {
      const pokemon = await this.pokemonModel.create(createPokemonDto);
      return pokemon;
    } catch (error) {
      this.handleErrorExeption(error);
    }
  }

  findAll() {
    return `This action returns all pokemon`;
  }

  async findOne(term: string) {
    let pokemon: Pokemon;

    if (!isNaN(+term)) {
      pokemon = await this.pokemonModel.findOne({ no: term });
    }
    if (!pokemon && isValidObjectId(term)) {
      pokemon = await this.pokemonModel.findById(term);
    }

    if (!pokemon)
      pokemon = await this.pokemonModel.findOne({
        name: term.toLowerCase().trim(),
      });

    if (!pokemon)
      throw new BadRequestException(
        `Pokemon with id,name or no "${term}" not found`,
      );

    return pokemon;
  }

  async update(term: string, updatePokemonDto: UpdatePokemonDto) {
    const pokemon = await this.findOne(term);
    try {
      if (updatePokemonDto.name) {
        updatePokemonDto.name = updatePokemonDto.name.toLowerCase().trim();
      }
      await this.pokemonModel.updateOne(updatePokemonDto);
      return { ...pokemon.toJSON(), ...updatePokemonDto };
    } catch (error) {
      this.handleErrorExeption(error);
    }
  }

  async remove(_id: string) {
    // const pokemon = await this.findOne(term);
    // await pokemon.deleteOne();
    // const result = await this.pokemonModel.deleteOne({ _id: term})
    const { deletedCount } = await this.pokemonModel.deleteOne({ _id });
    if (deletedCount === 0)
      throw new BadRequestException(`Pokemon with id "${_id}" not found`);
    return;
  }

  private handleErrorExeption(error: any) {
    if (error.code === 11000) {
      throw new BadRequestException(
        `Pokemon exist in db ${JSON.stringify(error.keyValue)}`,
      );
    }
    throw new InternalServerErrorException(
      `Can't create Pokemon - Check server logs`,
    );
  }
}
