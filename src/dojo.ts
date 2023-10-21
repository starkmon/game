import Dojo from "dojo";

const { VITE_ACCOUNT, VITE_PRIVATE_KEY, VITE_WORLD, } = import.meta.env;

export function setupDojo() {
	return Dojo.fromCredentials({
		accountAddress: `${VITE_ACCOUNT}`,
		accountPrivateKey: `${VITE_PRIVATE_KEY}`,
		worldAddress: `${VITE_WORLD}`,
	});

}

export const accountAddress = VITE_ACCOUNT;
export const worldAddress = VITE_WORLD;