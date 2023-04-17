import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateRestaurantDto } from './dto/create-restaurant.dto';
import { UpdateRestaurantDto } from './dto/update-restaurant.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Restaurant } from './entities/restaurant.entity';
import { Repository } from 'typeorm';

@Injectable()
export class RestaurantService {
  constructor(
    @InjectRepository(Restaurant)
    private restaurantRepository: Repository<Restaurant>
  ){}

  create(createRestaurantDto: CreateRestaurantDto) {
    return 'This action adds a new restaurant';
  }

  async findAll(): Promise<Restaurant[]> {
    const restaurants = await this.restaurantRepository.find()
    return restaurants
  }

  async findOne(id: number): Promise<Restaurant> {
    console.log("findOne", id)
    const restaurant = await this.restaurantRepository.findOne({
      where: {
        id: id
      }
    })
    if(restaurant) return restaurant
    throw new NotFoundException('Could not find the restaurant')
  }

  update(id: number, updateRestaurantDto: UpdateRestaurantDto) {
    return `This action updates a #${id} restaurant`;
  }

  remove(id: number) {
    return `This action removes a #${id} restaurant`;
  }
}
