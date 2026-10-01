import {LIGANDS} from '../utils/ligandList';

// La lista se genera desde assets/ligands.txt con "make ligands" (scripts/generate-ligands.js)
export async function loadLigands(): Promise<string[]>
{
	if (!Array.isArray(LIGANDS) || LIGANDS.length === 0)
		throw new Error('The ligand list is empty. Run "make ligands" to regenerate it.');

	return LIGANDS;
}