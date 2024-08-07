import Locations from "@/mongoose/locations/model";
import {
    FilterWishlistType,
    FilterLocationType,
} from "@/mongoose/locations/custom";
import { LocationType } from "@/mongoose/locations/schema";
import { QueryOptions } from "mongoose";

async function findLocations(
    filter: FilterLocationType | FilterWishlistType | {}
): Promise<LocationType[] | []> {
    try {
        let result: Array<LocationType | undefined> = await Locations.find(
            filter
        );
        return result as LocationType[];
    } catch (err) {
        console.log(err);
    }
    return [];
}

export async function findAllLocations(): Promise<LocationType[] | []> {
    let filter = {};
    return await findLocations(filter);
}

export async function findLocationsById(
    location_ids: string[]
): Promise<LocationType[] | []> {
    let filter = { location_id: location_ids };
    return await findLocations(filter);
}

export async function onUserWishlist(
    user_id: string
): Promise<LocationType[] | []> {
    let filter: FilterWishlistType = {
        on_wishlist: {
            $in: [user_id],
        },
    };
    return await findLocations(filter);
}

export async function updateWishlist(
    location_id: string,
    user_id: string,
    action: string
): Promise<LocationType | null | {}> {
    let filter = { location_id: location_id };
    let options: QueryOptions = { upsert: true, returnDocument: "after" };
    let update = {};
    switch (action) {
        case "add":
            update = { $push: { on_wishlist: user_id } };
            break;
        case "remove":
            update = { $pull: { on_wishlist: user_id } };
            break;
    }
    try {
        let result: LocationType | null = await Locations.findOneAndUpdate(
            filter,
            update,
            options
        );
        return result;
    } catch (err) {
        console.log(err);
    }
    return {};
}