export function splitAddresses(addresses: string): string[] {
	const separators = /[\n\r,;\t ]+/;
	return addresses.replace(separators, '\n').split(separators);
}
