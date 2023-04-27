import { Module } from "@nestjs/common"
import { TypeOrmModule } from "@nestjs/typeorm";
import { ConfigModule, ConfigService } from '@nestjs/config'

@Module({
    imports: [
        TypeOrmModule.forRootAsync({
            imports: [ConfigModule],
            inject: [ConfigService],
            useFactory: (config: ConfigService) => ({
                type: 'postgres',
                host: config.get('dbhost'),
                port: config.get('dbport'),
                username: config.get('dbusername'),
                password: config.get('dbpassword'),
                database: config.get('dbname'),
                entities: [
                    __dirname + '/../../**/**/*.entity.{js,ts}'
                    // Restaurant
                ],
                synchronize: true,
            })
        })
    ]
})
export class DatabaseModule{}
