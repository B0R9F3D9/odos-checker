import axios from 'axios';

import { Wallet } from '@/components/data-table/types';
import { promiseAll } from '@/lib/utils';

const getAllocation = async (address: string): Promise<number> => {
	try {
		const resp = await axios.get(
			`https://api.odos.xyz/loyalty/users/${address}/balances`,
		);
		if (resp.status !== 200 || !resp.data) throw new Error(resp.statusText);
		return parseFloat(
			(parseInt(resp.data.data.pendingTokenBalance!) / 10 ** 18).toFixed(2),
		);
	} catch (error) {
		throw new Error(
			`Failed to fetch allocation for address ${address}: ${error}`,
		);
	}
};

const sendRequest = async (page: number, wallet: string) => {
	try {
		const resp = await axios.get(
			`https://api.odos.xyz/transaction-history/${wallet}`,
			{
				params: {
					page,
				},
			},
		);
		if (resp.status !== 200 || !resp.data) throw new Error(resp.statusText);
		return resp.data;
	} catch (error) {
		throw new Error(
			`Failed to fetch page ${page} for wallet ${wallet}: ${error}`,
		);
	}
};

const processTxns = async (
	index: number,
	address: string,
	txns: any[],
): Promise<Wallet> => {
	let volume = 0;
	const uniqueDays = new Set<string>();

	for (const tx of txns) {
		let tx_volume = 0;
		for (const input of tx.inputs) {
			tx_volume += input.amount_usd;
		}
		volume += tx_volume;

		const date = new Date(tx.block_time);
		const dateString = date.toISOString().split('T')[0];
		uniqueDays.add(dateString);
	}

	const allocation = await getAllocation(address);

	return {
		id: index,
		address,
		txs: txns.length,
		days: uniqueDays.size,
		volume,
		allocation: allocation === undefined ? null : allocation,
	};
};

const checkWallet = async (index: number, wallet: string): Promise<Wallet> => {
	const txns: any[] = [];
	const initResp = await sendRequest(1, wallet);
	txns.push(...initResp.transactions);
	if (initResp.transactions.length < 10) {
		return await processTxns(index, wallet, txns);
	}

	const pages = Math.ceil(initResp.totalCount / 10);
	const requests = [];
	for (let i = 2; i <= pages; i++) {
		requests.push(() => sendRequest(i, wallet));
	}

	const responses = await promiseAll(requests, 3);
	for (const resp of responses) {
		txns.push(...resp.transactions);
	}
	return await processTxns(index, wallet, txns);
};

export const fetchWallets = async (
	addresses: string[],
	updateWallet?: (wallet: Wallet) => void,
	setProgress?: (progress: number) => void,
): Promise<Wallet[]> => {
	return await promiseAll(
		addresses.map((wallet, index) => async () => {
			try {
				return await checkWallet(index + 1, wallet);
			} catch (error) {
				console.error(error);
				return {
					id: index + 1,
					address: wallet,
					txs: null,
					days: null,
					volume: null,
					allocation: null,
				};
			}
		}),
		3,
		updateWallet,
		setProgress,
	);
};
