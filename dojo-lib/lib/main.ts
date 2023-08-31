import { Account, BigNumberish, RpcProvider, str } from "starknet";
import { RPCProvider, strTofelt252Felt } from "@dojoengine/core";

type DojoCredentialArgs = {
	accountAddress: string,
	accountPrivateKey: string,
	worldAddress: string,
	nodeUrl?: string
};

export default class Dojo {
	account: Account;
	provider: RPCProvider;
	world: string;

	static fromCredentials(args: DojoCredentialArgs): Dojo {
		const
			sn_provider = new RpcProvider({ nodeUrl: args.nodeUrl || 'http://localhost:5050' }),
			account = new Account(sn_provider, args.accountAddress, args.accountPrivateKey);

		return new Dojo(account, args.worldAddress, args.nodeUrl || 'http://localhost:5050');
	}

	constructor(account: Account, worldAddress: string, nodeUrl: string) {
		this.world = worldAddress;

		this.account = account;
		this.provider = new RPCProvider(worldAddress, nodeUrl);
	}

	execute(system: string, calldata: BigNumberish[] = []) {
		return this.provider.execute(this.account, system, calldata);

		// calldata = [strTofelt252Felt(system), calldata.length, ...calldata]
		// return this.account.execute({
		// 	contractAddress: this.world,
		// 	calldata: calldata,
		// 	entrypoint: 'execute',
		// });
	}

	call(system: string, calldata: BigNumberish[] = []) {
		calldata = [strTofelt252Felt(system), calldata.length, ...calldata]
		return this.account.callContract({
			contractAddress: this.world,
			calldata: calldata,
			entrypoint: 'execute',
		});
	}

	async entity(component: string, keys: string[], offset: number = 0, length: number = 1) {
		const keysArr: BigNumberish[] = typeof keys !== 'object' ? [keys] : keys;
		const calldata = [strTofelt252Felt(component), keysArr.length, ...keysArr, offset.toString(), length.toString()];
		let { result } = await this.account.callContract({
			contractAddress: this.world,
			calldata,
			entrypoint: 'entity',
		});

		return result;
	}
}
