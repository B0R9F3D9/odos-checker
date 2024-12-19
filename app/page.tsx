'use client';

import { useState } from 'react';
import { useTheme } from 'next-themes';
import { useRouter } from 'next/router';
import { Moon, Sun, Github } from 'lucide-react';

import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { DataTable } from '@/components/data-table/DataTable';
import { getColumns } from '@/components/data-table/columns';
import { Progress } from '@/components/ui/progress';
import { useWalletStore } from '@/store/useWalletStore';
import { useToast } from '@/hooks/use-toast';

export default function Page() {
	const { setTheme, theme } = useTheme();
	const { toast } = useToast();
	const { basePath } = useRouter();
	const {
		addresses,
		setAddresses,
		hideAddresses,
		setHideAddresses,
		wallets,
		checkWallets,
		recheckWallet,
		deleteWallet,
	} = useWalletStore();
	const [progress, setProgress] = useState(0);

	return (
		<div className="min-h-screen flex flex-col">
			<header className="flex items-center justify-between p-4 border-b">
				<Button className="w-10 h-10" variant="outline" size="icon" asChild>
					<a
						href="https://github.com/b0r9f3d9/odos-checker"
						target="_blank"
						rel="noopener noreferrer"
					>
						<Github />
					</a>
				</Button>
				<h1 className="text-xl font-semibold">Odos Checker</h1>
				<Button
					className="w-10 h-10"
					variant="outline"
					size="icon"
					onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}
				>
					{theme === 'light' ? <Moon /> : <Sun />}
				</Button>
			</header>
			<main className="flex-grow flex items-center justify-center">
				<div className="space-y-5 w-full max-w-5xl">
					<Textarea
						rows={5}
						className="text-2xl"
						value={hideAddresses ? '' : addresses}
						disabled={hideAddresses}
						placeholder="Type wallet addresses divided by line, comma, semicolon, tab or space"
						onChange={e => setAddresses(e.target.value)}
					/>
					<Button
						onClick={async () => await checkWallets(setProgress)}
						className="w-full"
						disabled={addresses.length === 0}
						variant="outline"
					>
						Check
					</Button>
					{progress < 100 && <Progress value={progress} />}
					<DataTable
						columns={getColumns(
							basePath,
							toast,
							hideAddresses,
							setHideAddresses,
							recheckWallet,
							deleteWallet,
						)}
						data={wallets}
					/>
				</div>
			</main>
		</div>
	);
}
