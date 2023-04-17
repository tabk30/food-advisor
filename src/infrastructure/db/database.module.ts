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
                host: config.get('POSTGRES_HOST') || 'database-1.cadptjxhazkw.ap-southeast-1.rds.amazonaws.com',
                port: config.get('POSTGRES_PORT') || 5432,
                username: config.get('POSTGRES_USER') || 'postgres',
                password: config.get('POSTGRES_PASSWORD') || 'admin123456',
                database: config.get('POSTGRES_DB') || 'nestjs',
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
