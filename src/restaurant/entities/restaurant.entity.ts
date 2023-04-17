import { Column, CreateDateColumn, DeleteDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
// export class Restaurant {}
export class OpeningHours {
    day_interval: string
    opening_hour: string
    closing_hour: string
}

export class Location {
    address: string
    website: string
    phone: string
}

@Entity('restaurant')
export class Restaurant {
    @PrimaryGeneratedColumn()
    id: number;

    @Column('varchar')
    name: string

    @Column('simple-array', {nullable: true, default: null})
    images?: string[]

    @Column('varchar', {nullable: true, default: null})
    slug?: string

    @Column('int')
    price: number

    @Column('text', {nullable: true, default: null})
    description?: string

    @Column('simple-json', {nullable: true, default: null})
    opening_hours?: OpeningHours[]

    @Column('simple-json', {nullable: true, default: null})
    location?: Location

    @CreateDateColumn()
    created_at: Date; // Creation date

    @UpdateDateColumn()
    updated_at?: Date; // Last updated date

    @DeleteDateColumn()
    deleted_at?: Date; // Deletion date
}
