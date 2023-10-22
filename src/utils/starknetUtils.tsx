import { selector } from 'starknet';
import { config } from "./reveal_creatures";

export const starknetConfig = {
	rpc: "https://starknet-goerli.g.alchemy.com/v2/Sxk1XpE0frZCVi3kHq9rESWNwP3dCHYC/"
}

export const contractsConfig: { [key: string]: string } = {
	WORLD: "0x1cabeaae9e57c1358c1f2392362cc2f3f6b869f548959455222d8446f9f21a9",
	CREATURE_SYSTEM: "0x0270d3673aaf3775d1271ef64e23541b7a728bdee9373e98359065ba03f62d24",
	ERC721: "0x04af4a680f9139b65a5dbebfb74e978b08c757205903bf20f10f0e7fa560e92d",
};

class StarkUtils {
	async callContract(contract_address: string, entry_point: string, calldata: string[] = []) {
		if (contractsConfig[contract_address]) {
			contract_address = contractsConfig[contract_address];
		}

		const entry_point_selector = selector.getSelectorFromName(entry_point)
		const response = await fetch("https://alpha4.starknet.io/feeder_gateway/call_contract?blockNumber=pending", {
			body: JSON.stringify({ contract_address, entry_point_selector, calldata, }),
			method: "POST",
		});

		return await response.json();
	}
}

export default new StarkUtils();