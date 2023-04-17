import { MigrationInterface, QueryRunner } from "typeorm";

export class InitMigration implements MigrationInterface {
    name?: string;
    transaction?: boolean;
    async up(queryRunner: QueryRunner): Promise<any> {
        //todo do some up
    }
    async down(queryRunner: QueryRunner): Promise<any> {
        //todo do some down
    }

}