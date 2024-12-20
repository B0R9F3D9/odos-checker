import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs));
}

export function promiseAll<T>(
	tasks: (() => Promise<T>)[],
	limit: number,
	updateWallet?: (result: T) => void,
	setProgress?: (progress: number) => void,
): Promise<T[]> {
	const results: T[] = [];
	let runningTasks = 0;
	let currentIndex = 0;
	let completedTasks = 0;
	setProgress?.(0);

	return new Promise((resolve, reject) => {
		const next = () => {
			if (currentIndex === tasks.length && runningTasks === 0) {
				resolve(results);
				return;
			}

			if (runningTasks >= limit || currentIndex >= tasks.length) {
				return;
			}

			const taskIndex = currentIndex++;
			const task = tasks[taskIndex];

			runningTasks++;
			task()
				.then(result => {
					results[taskIndex] = result;
					updateWallet?.(result);
				})
				.catch(err => {
					console.error(`Task ${taskIndex} failed:`, err);
					reject(err);
				})
				.finally(() => {
					runningTasks--;
					completedTasks++;
					setProgress?.((completedTasks / tasks.length) * 100);
					next();
				});

			next();
		};

		for (let i = 0; i < limit; i++) {
			next();
		}
	});
}
