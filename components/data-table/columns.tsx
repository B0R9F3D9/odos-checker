import * as React from 'react';
import { ColumnDef } from '@tanstack/react-table';
import {
	EyeOff,
	Copy,
	ArrowDownUp,
	CircleXIcon,
	RotateCcw,
	Trash,
} from 'lucide-react';
import Image from 'next/image';

import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Wallet } from '@/components/data-table/types';
import { Toast } from '@/hooks/use-toast';

export const getColumns = (
	toast: (options: Toast) => {
		id: string;
		dismiss: () => void;
	},
	hideAddresses: boolean,
	setHideAddresses: (hideAddresses: boolean) => void,
	recheckWallet: (address: string) => Promise<void>,
	deleteWallet: (address: string) => void,
): ColumnDef<Wallet>[] => [
	{
		accessorKey: 'id',
		header: ({ column }) => {
			return (
				<div className="text-center">
					<Button
						variant="ghost"
						onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
					>
						№
						<ArrowDownUp />
					</Button>
				</div>
			);
		},
		cell: ({ row }) => <div className="text-center">{row.getValue('id')}</div>,
	},
	{
		accessorKey: 'address',
		header: () => {
			return (
				<div className="text-center">
					<Button
						variant="ghost"
						onClick={() => setHideAddresses(!hideAddresses)}
					>
						Wallet
						<EyeOff />
					</Button>
				</div>
			);
		},
		cell: ({ row }) => (
			<div className="text-center">
				<Button
					variant="ghost"
					onClick={() => {
						navigator.clipboard.writeText(row.getValue<string>('address'));
						const { dismiss } = toast({
							description: 'Address copied to clipboard',
						});
						setTimeout(() => dismiss(), 5000);
					}}
				>
					{hideAddresses
						? row.getValue<string>('address').slice(0, 6) +
						  '...' +
						  row.getValue<string>('address').slice(-4)
						: row.getValue('address')}
					<Copy />
				</Button>
			</div>
		),
	},
	{
		accessorKey: 'txs',
		header: ({ column }) => {
			return (
				<div className="text-center">
					<Button
						variant="ghost"
						onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
					>
						Txn Count
						<ArrowDownUp />
					</Button>
				</div>
			);
		},
		cell: ({ row }) => {
			let result;
			if (row.getValue('txs') === null) result = <CircleXIcon />;
			else if (row.getValue('txs') === undefined)
				result = <Skeleton className="w-16 h-8" />;
			else result = row.getValue<number>('txs');
			return (
				<div className="flex text-center justify-center items-center">
					{result}
				</div>
			);
		},
	},
	{
		accessorKey: 'days',
		header: ({ column }) => {
			return (
				<div className="text-center">
					<Button
						variant="ghost"
						onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
					>
						Active days
						<ArrowDownUp />
					</Button>
				</div>
			);
		},
		cell: ({ row }) => {
			let result;
			if (row.getValue('days') === null) result = <CircleXIcon />;
			else if (row.getValue('days') === undefined)
				result = <Skeleton className="w-16 h-8" />;
			else result = row.getValue<number>('days');
			return (
				<div className="flex text-center justify-center items-center">
					{result}
				</div>
			);
		},
	},
	{
		accessorKey: 'volume',
		header: ({ column }) => {
			return (
				<div className="text-center">
					<Button
						variant="ghost"
						onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
					>
						Volume
						<ArrowDownUp />
					</Button>
				</div>
			);
		},
		cell: ({ row }) => {
			let result;
			if (row.getValue('volume') === null) result = <CircleXIcon />;
			else if (row.getValue('volume') === undefined)
				result = <Skeleton className="w-16 h-8" />;
			else {
				result = new Intl.NumberFormat('en-US', {
					style: 'currency',
					currency: 'USD',
				}).format(row.getValue('volume'));
			}
			return (
				<div className="flex text-center justify-center items-center">
					{result}
				</div>
			);
		},
	},
	{
		id: 'actions',
		header: () => <div className="text-center">Actions</div>,
		cell: ({ row }) => (
			<div className="flex text-center justify-center items-center">
				<Button
					className="cursor-pointer w-7 h-7 mr-3"
					variant="ghost"
					size="icon"
					asChild
					onClick={() => {}}
				>
					<a
						href={`https://debank.com/profile/${row.getValue('address')}`}
						target="_blank"
						rel="noreferrer"
					>
						<Image
							src="/debank.svg"
							alt="debank"
							width={28}
							height={28}
							className="rounded-md"
						/>
					</a>
				</Button>
				<Button
					className="cursor-pointer w-7 h-7 mr-3"
					variant="ghost"
					size="icon"
					asChild
					onClick={async () => await recheckWallet(row.getValue('address'))}
				>
					<RotateCcw />
				</Button>
				<Button
					className="cursor-pointer w-7 h-7"
					variant="ghost"
					size="icon"
					asChild
					onClick={() => deleteWallet(row.getValue('address'))}
				>
					<Trash />
				</Button>
			</div>
		),
	},
];
