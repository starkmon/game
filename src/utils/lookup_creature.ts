import { creatureOnCoordinates } from "./reveal_creatures";
import { BigNumberish } from "starknet";

export function lookup_creature_on_coordinates(x: number, y: number) {
    const CREATURE_SEED: BigNumberish = '0xB1B89B84BB6F354B8568285C6ECAFED311AFF90B0A83462164ED0A7A06A6F';
    const PROBABILITY: BigNumberish = '0x100000'; // Out of 1
    const xToBigInt = Math.round(x) as BigNumberish;
    const yToBigInt = Math.round(y) as BigNumberish;
    return creatureOnCoordinates(CREATURE_SEED, PROBABILITY, xToBigInt , yToBigInt);
}