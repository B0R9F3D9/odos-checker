import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';

import { ThemeProvider } from '@/components/theme-provider';
import { Toaster } from '@/components/ui/toaster';
import './globals.css';

const geistSans = Geist({
	variable: '--font-geist-sans',
	subsets: ['latin'],
});

const geistMono = Geist_Mono({
	variable: '--font-geist-mono',
	subsets: ['latin'],
});

export const metadata: Metadata = {
	title: 'Odos checker',
	description: 'Odos checker by b0r9f3d9',
};

export default function RootLayout({ children }: any) {
	return (
		<>
			<html lang="en" suppressHydrationWarning>
				<head />
				<body>
					<div
						className={`${geistSans.variable} ${geistMono.variable} antialiased`}
					>
						<ThemeProvider
							attribute="class"
							defaultTheme="system"
							enableSystem
							disableTransitionOnChange
						>
							<main>{children}</main>
							<Toaster />
						</ThemeProvider>
					</div>
				</body>
			</html>
		</>
	);
}
