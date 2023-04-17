import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateRestaurantDto } from './dto/create-restaurant.dto';
import { UpdateRestaurantDto } from './dto/update-restaurant.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Restaurant } from './entities/restaurant.entity';
import { DeleteResult, Repository } from 'typeorm';

@Injectable()
export class RestaurantService {
  constructor(
    @InjectRepository(Restaurant)
    private restaurantRepository: Repository<Restaurant>
  ){}

  async create(createRestaurantDto: CreateRestaurantDto): Promise<Restaurant> {
    return this.restaurantRepository.save(
      this.restaurantRepository.create(createRestaurantDto)
    )
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

  async update(id: number, updateRestaurantDto: UpdateRestaurantDto): Promise<Restaurant> {
    await this.restaurantRepository
      .createQueryBuilder()
      .update()
      .set({ ...updateRestaurantDto })
      .where('id =:id', { id })
      .execute();
    let updatedRestaurant = await this.findOne(id);
    return updatedRestaurant
  }

  async remove(id: number): Promise<DeleteResult> {
    return await this.restaurantRepository
    .createQueryBuilder()
    .delete()
    .from(Restaurant)
    .where('id =:id', {id})
    .execute()
  }
}
