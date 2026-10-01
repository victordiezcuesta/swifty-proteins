const RCSB_URL = 'https://files.rcsb.org/ligands/view';
const LIGAND_ID_REGEX = /^[A-Za-z0-9]{1,5}$/;

export async function fetchLigand(ligand: string): Promise<string>
{
	const cleanLigand = ligand.trim();

	if (!LIGAND_ID_REGEX.test(cleanLigand))
		throw new Error('Invalid ligand identifier.');

	const response = await fetch(`${RCSB_URL}/${cleanLigand}.cif`);

	if (!response.ok)
		throw new Error(`Ligand not found (${response.status}).`);

	return await response.text();
}