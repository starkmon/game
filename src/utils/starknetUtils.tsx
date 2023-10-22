import { selector, num, BigNumberish } from 'starknet';

import { config } from "./reveal_creatures";
import { StarknetWindowObject } from 'get-starknet';

export const starknetConfig = {
	rpc: "https://starknet-goerli.g.alchemy.com/v2/Sxk1XpE0frZCVi3kHq9rESWNwP3dCHYC/"
}

export const contractsConfig: { [key: string]: string } = {
	WORLD: "0x1cabeaae9e57c1358c1f2392362cc2f3f6b869f548959455222d8446f9f21a9",
	CREATURE_SYSTEM: "0x069ac89ab195e0118a55964ba9534b5c9487fd2b918564f47e5836bd561142da",
	ERC721: "0x05e3959b4351e1ac488e240eb97d52e25ed3b22d3e600976afa711e7f444ed0f",
};

class StarkUtils {
	async callContract(contract_address: string, entry_point: string, calldata: string[] = []) {
		if (contractsConfig[contract_address]) {
			contract_address = contractsConfig[contract_address];
		}

		calldata = calldata.map(d => num.toHexString(d))

		const entry_point_selector = selector.getSelectorFromName(entry_point)
		const response = await fetch(starknetConfig.rpc, {
			body: JSON.stringify(
				{
					id: 1,
					jsonrpc: "2.0",
					method: "starknet_call",
					params: [
						{ contract_address, entry_point_selector, calldata, },
						"latest"
					]
				}
			),
			method: "POST",
		});

		return await response.json();
	}

	async operate(starknet: StarknetWindowObject, contractAddress: BigNumberish, entrypoint: BigNumberish, calldata: BigNumberish[]) {
		console.log({ contractAddress, entrypoint, calldata, });

		return starknet.account.execute({ contractAddress, entrypoint, calldata, },);
	};
}

export default new StarkUtils();