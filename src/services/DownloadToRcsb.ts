const RCSB_URL = 'https://files.rcsb.org/ligands/view';
const LIGAND_ID_REGEX = /^[A-Za-z0-9]{1,3}$/;
const REQUEST_TIMEOUT = 10000;

export async function fetchLigand(ligand: string): Promise<string>
{
	const cleanLigand = ligand.trim();

	if (!LIGAND_ID_REGEX.test(cleanLigand))
		throw new Error('Invalid ligand identifier.');

	const controller = new AbortController();

	const timeout = setTimeout(() =>
	{
		controller.abort();
	}, REQUEST_TIMEOUT);

	try
	{
		const response = await fetch(`${RCSB_URL}/${cleanLigand}.cif`,
			{signal: controller.signal},
		);

		if (response.status === 404)
			throw new Error('Ligand not found (404). This ligand may not exist in the database.');

		if (!response.ok)
			throw new Error(`HTTP error: ${response.status}.`);

		return await response.text();
	}
	catch (error)
	{
		if (error instanceof Error && error.name === 'AbortError')
			throw new Error('Request timeout. Please try again.');

		const message = error instanceof Error
			? error.message
			: String(error);

		if (error instanceof TypeError || message.includes('UnknownHostException') || message.includes('Unable to resolve host') || message.includes('Network request failed') || message.includes('fetch failed'))
			throw new Error('No internet connection. Please check your network.');

		throw error;
	}
	finally
	{
		clearTimeout(timeout);
	}
}