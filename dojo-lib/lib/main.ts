import { Account, BigNumberish, RpcProvider } from "starknet";
import { RPCProvider, Query } from "@dojoengine/core";

type DojoConstructorArgs = {
	account_address: string,
	account_private_key: string,
	world_address: string,
	nodeUrl?: string
};

export default class Dojo {
	provider: RpcProvider;
	account: Account;
	dojo_provider: RPCProvider;

	constructor(args: DojoConstructorArgs) {
		this.provider = new RpcProvider({ nodeUrl: args.nodeUrl || 'http://localhost:5050' });
		this.account = new Account(this.provider, args.account_address, args.account_private_key);
		this.dojo_provider = new RPCProvider(args.world_address, args.nodeUrl);
	}

	execute(system: string, calldata: BigNumberish[]) {
		this.dojo_provider.execute(this.account, system, calldata);
	}
}
