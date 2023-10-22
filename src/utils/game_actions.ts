import { creatureOnCoordinates } from "./reveal_creatures";

export function lookup_creature_on_coordinates(x: number, y: number) {
    return creatureOnCoordinates(Math.round(x), Math.round(y));
}

export function claim_creature_on_coordinates(x: number, y: number) {
    console.log("Claiming starkmon!!");
}