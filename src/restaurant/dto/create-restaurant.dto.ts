import { OpeningHour, Location } from "../entities/restaurant.entity";

export class CreateRestaurantDto {
    public name: string;
    public image?: string[];
    public slug?: string;
    public price: number;
    public description?: string;
    public opening_hours?: OpeningHour[];
    public locations?: Location[]
}
