import { create } from 'zustand';

import { fetchWallets } from '@/lib/api';
import { splitAddresses } from '@/components/data-table/utils';
import { Wallet } from '@/components/data-table/types';

interface WalletState {
	addresses: string;
	setAddresses: (addresses: string) => void;

	hideAddresses: boolean;
	setHideAddresses: (hideAddresses: boolean) => void;

	wallets: Wallet[];
	setWallets: (wallets: Wallet[]) => void;
	updateWallet: (wallet: Wallet) => void;

	checkWallets: (
		setshowProgress: (show: boolean) => void,
		setProgress: (progress: number) => void,
	) => Promise<void>;
	recheckWallet: (address: string) => Promise<void>;
	deleteWallet: (address: string) => void;
}

export const useWalletStore = create<WalletState>((set, get) => ({
	addresses: '',
	setAddresses: addresses => set({ addresses }),

	hideAddresses: false,
	setHideAddresses: hideAddresses => set({ hideAddresses }),

	wallets: [],
	setWallets: wallets => set({ wallets }),
	updateWallet: update => {
		const { wallets, setWallets } = get();
		setWallets(
			wallets.map(wallet =>
				wallet.address === update.address ? { ...wallet, ...update } : wallet,
			),
		);
	},

	checkWallets: async (
		setShowProgress: (show: boolean) => void,
		setProgress: (progress: number) => void,
	) => {
		setShowProgress(true);
		const { addresses, updateWallet, setWallets, setAddresses } = get();
		const addressesList = splitAddresses(addresses);
		setWallets(
			addressesList.map((wallet, index) => ({
				id: index + 1,
				address: wallet,
			})),
		);
		setAddresses(addressesList.join('\n'));
		await fetchWallets(addressesList, updateWallet, setProgress);
		setShowProgress(false);
	},

	recheckWallet: async address => {
		const { wallets, updateWallet, setWallets } = get();
		setWallets(
			wallets.map(wallet =>
				wallet.address === address
					? { ...wallet, txs: undefined, days: undefined, volume: undefined }
					: wallet,
			),
		);
		await fetchWallets([address], updateWallet);
	},

	deleteWallet: address => {
		const { wallets, setWallets, setAddresses } = get();
		const filteredWallets = wallets
			.filter(wallet => wallet.address !== address)
			.map((wallet, index) => ({ ...wallet, id: index + 1 }));
		setWallets(filteredWallets);
		setAddresses(filteredWallets.map(wallet => wallet.address).join('\n'));
	},
}));
