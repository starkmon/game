import { BigNumberish, ec } from "starknet";
import starknetUtils from './starknetUtils';

export function pedersen(x: BigNumberish, y: BigNumberish) {
	return ec.starkCurve.pedersen(x, y)
}

export const creatureRevealConfig = {
	// Updated after contract call
	// export const CREATURE_SEED = "0xB1B89B84BB6F354B8568285C6ECAFED311AFF90B0A83462164ED0A7A06A6F5C1";
	SYNC: "pending",
	CREATURE_SEED: "0x11AFF90B0A83462164ED0A7A06A6F5C1",
	PROBABILITY: "0x1000", // Out of 
};

export async function fetch_creature_reveal_data() {
	if (creatureRevealConfig.SYNC != "pending") {
		return;
	}
	creatureRevealConfig.SYNC = "fetching";
	const resp = await starknetUtils.callContract(
		"CREATURE_SYSTEM",
		"creature_reveal_data"
	);

	if (resp?.result && resp?.result.length === 2) {
		creatureRevealConfig.CREATURE_SEED = resp?.result[0];
		creatureRevealConfig.PROBABILITY = resp?.result[1];
		creatureRevealConfig.SYNC = "done";
	} else {
		creatureRevealConfig.SYNC = "pending";
	}
}

/*
  let coords: u128 = x.into() * 0x100000000_u128 + y.into();
  let hash = pedersen::pedersen(seed.into(), coords.into());
  
  let mut high = 0;
  let low = match u128s_from_felt252(hash) {
	  U128sFromFelt252Result::Narrow(low) => low,
	  U128sFromFelt252Result::Wide((low, h_)) => {
		  high = h_;
		  low
	  },
  };
  
  if 1 == low % probability {
	  Option::Some(priv_reveal_creature(high))
  } else {
	  Option::None
  }
*/

export function split_hash(hash: string) {
	hash = hash.replace("0x", "");
	return {
		high: '0x' + hash.slice(0, -32),
		low: '0x' + hash.slice(-32),
	}
}

export function creatureOnCoordinatesInner(seed: BigNumberish, probability: BigNumberish, x: BigNumberish, y: BigNumberish) {
	const coords = BigInt(x) * BigInt(0x100000000) + BigInt(y);
	const hash = pedersen(BigInt(seed), coords);

	const { high, low } = split_hash(hash);

	if (BigInt(1) === BigInt(low) % BigInt(probability)) {
		return true;
	} else {
		return false;
	}
}

export function creatureOnCoordinates(x: BigNumberish, y: BigNumberish) {
	const { CREATURE_SEED, PROBABILITY } = creatureRevealConfig;
	return creatureOnCoordinatesInner(CREATURE_SEED, PROBABILITY, x, y);
}

export async function getCreatureFromContract(x: string, y: string) {
	if (creatureOnCoordinates(x, y)) {
		return await starknetUtils.callContract("CREATURE_SYSTEM", "creature_on_coordinates", [x, y])
	}
	return null;
}

export async function claimCreatureFromContract(x: string, y: string) {
	if (creatureOnCoordinates(x, y)) {
		// @TODO invoke claim transaction
		// return await starknetUtils.callContract("CREATURE_SYSTEM", "creature_on_coordinates", [x, y])
	}
}