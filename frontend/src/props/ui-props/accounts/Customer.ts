import { AccountModel } from "@/models/AccountModel";
import { LocationCityModel } from "@/models/LocationCityModel";
import { LocationDistrictModel } from "@/models/LocationDistrictModel";
import { LocationWardModel } from "@/models/LocationWardModel";


export interface UICustomer {
     birthday: string;
     phone: string;
     email: string;
     name: string;
     avatarUrl: string;
     gender: boolean;
     account: AccountModel | null;
     ward: LocationWardModel | null;
     district: LocationDistrictModel | null;
     city: LocationCityModel | null;
}