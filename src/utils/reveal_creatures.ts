import snjs, { BigNumberish, ec } from "starknet";

export function pedersen(x: BigNumberish, y: BigNumberish) {
	return ec.starkCurve.pedersen(x, y)
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

export function revealCreature(seed) {
	// @TODO: Return a creature randomly.

	const creatures = data.creatures();
	const creaturesLen = creatures.length;
	const creatureIndex = seed % creaturesLen;
	const name = creatures[creatureIndex];

	const hash = pedersen(BigInt(seed), 1);
	let tierSeed = 0;
	let statSeed;

	const { Narrow, Wide } = split_hash(hash);
	if (Narrow) {
		statSeed = Narrow;
	} else if (Wide) {
		const [low, high] = Wide;
		tierSeed = high;
		statSeed = low;
	}

	const { tiersManager, tiers } = data.TiersManager.get();
	const tierDraw = BigInt(tierSeed) % BigInt(tiersManager.probability);
	let i = 0;

	while (tierDraw < tiers[i].prob_max) {
		i++;
	}
	const tier = tiers[i];

	let stat = BigInt(tier.mult_min) + BigInt(tier.mult_max) - BigInt(tier.mult_min);
	stat += statSeed % (BigInt(tier.mult_max - tier.mult_min)); // Add random stat

	return {
		id: { high: 0, low: BigInt(seed) },
		name,
		stat: Number(stat),
	};
}

export function split_hash(hash: string): string[] {
	hash = hash.replace("0x", "");
	return [
		hash.slice(0, 32),
		hash.slice(32),
	]
}

export function creatureOnCoordinates(seed: BigNumberish, probability: BigNumberish, x: BigNumberish, y: BigNumberish) {
	const coords = BigInt(x) * BigInt(0x100000000) + BigInt(y);
	const hash = pedersen(BigInt(seed), coords);

	const [high, low] = split_hash(hash);


	if (BigInt(1) === BigInt(low) % BigInt(probability)) {
		return revealCreature(high);
	} else {
		return false;
	}
}
