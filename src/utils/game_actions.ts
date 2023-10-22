import { BigNumberish } from "starknet";
import { claimCreatureFromContract, creatureOnCoordinates, getCreatureFromContract } from "./reveal_creatures";

window.creature_on_coordinates = claim_creature_on_coordinates;
export function creature_on_coordinates(x: number, y: number) {
    return creatureOnCoordinates(Math.round(x), Math.round(y));
}

window.creature_details_on_coordinates = creature_details_on_coordinates;
export async function creature_details_on_coordinates(x: BigNumberish, y: BigNumberish) {
    if (typeof x !== "string") {
        x = x.toString();
    }
    if (typeof y !== "string") {
        y = y.toString();
    }
    return await getCreatureFromContract(x, y)
}

export function claim_creature_on_coordinates(x: BigNumberish, y: BigNumberish) {
    console.log("Claiming starkmon at ", x, y);
    if (typeof x !== "string") {
        x = x.toString();
    }
    if (typeof y !== "string") {
        y = y.toString();
    }
    if (creatureOnCoordinates(Math.round(x), Math.round(y))) {
        return claimCreatureFromContract(x, y)
    }

    return false;
}