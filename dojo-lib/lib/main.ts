import { Account, BigNumberish, RpcProvider } from "starknet";
import { RPCProvider, Query, strTofelt252Felt } from "@dojoengine/core";

type DojoConstructorArgs = {
	account_address: string,
	account_private_key: string,
	world_address: string,
	nodeUrl?: string
};

export default class Dojo {
	sn_provider: RpcProvider;
	account: Account;
	provider: RPCProvider;
	world: string;

	constructor(args: DojoConstructorArgs) {
		this.world = args.world_address;
		this.sn_provider = new RpcProvider({ nodeUrl: args.nodeUrl || 'http://localhost:5050' });
		this.account = new Account(this.sn_provider, args.account_address, args.account_private_key);
		this.provider = new RPCProvider(args.world_address, args.nodeUrl);
	}

	execute(system: string, calldata?: BigNumberish[]) {
		return this.provider.execute(this.account, system, calldata || []);
	}

	call(system: string, calldata: BigNumberish[] = []) {
		calldata = [strTofelt252Felt(system), calldata.length, ...calldata]
		return this.sn_provider.callContract({
			contractAddress: this.world,
			calldata: calldata,
			entrypoint: 'execute',
		});
	}

	entity(component: string, keys: BigNumberish[], offset: number = 0, length: number = 0) {

		const keys_: BigNumberish[] = typeof keys === 'string' ? [keys] : keys;
		const calldata = [strTofelt252Felt(component), keys_.length, ...keys_, offset, length];
		return this.sn_provider.callContract({
			contractAddress: this.world,
			calldata: calldata,
			entrypoint: 'entity',
		});
	}
}
