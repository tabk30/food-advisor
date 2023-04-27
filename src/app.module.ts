import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { RestaurantModule } from './restaurant/restaurant.module';
import { ConfigModule } from '@nestjs/config';
import * as Joi from '@hapi/joi';
import { DatabaseModule } from './infrastructure';

@Module({
  imports: [
    ConfigModule.forRoot({
      validationSchema: Joi.object({
        dbhost: Joi.string().required(),
        dbport: Joi.number().required(),
        dbusername: Joi.string().required(),
        dbpassword: Joi.string().required(),
        dbname: Joi.string().required(),
        PORT: Joi.number(),
      }),
    }),
    DatabaseModule,
    RestaurantModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
