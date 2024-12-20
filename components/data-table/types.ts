export type Wallet = {
	id: number;
	address: string;
	txs?: number | null;
	days?: number | null;
	volume?: number | null;
	allocation?: number | null;
};
