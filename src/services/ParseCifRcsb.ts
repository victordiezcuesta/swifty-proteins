import {Atom, Bond, Molecule} from '../types/molecule';

export function parseCif(cif: string): Molecule
{
	const lines = cif.split(/\r?\n/);

	const atoms: Atom[] = [];
	const bonds: Bond[] = [];

	for (let i = 0; i < lines.length; i++)
	{
		const line = lines[i].trim();

		if (line !== 'loop_')
			continue;

		const headers: string[] = [];

		let j = i + 1;

		while (j < lines.length)
		{
			const header = lines[j].trim();

			if (!header.startsWith('_'))
				break;

			headers.push(header);
			j++;
		}

		if (!headers.some(header => header.startsWith('_chem_comp_atom.')))
			continue;

		const atomIdIndex = headers.indexOf('_chem_comp_atom.atom_id');
		const elementIndex = headers.indexOf('_chem_comp_atom.type_symbol');
		const xIndex = headers.indexOf('_chem_comp_atom.model_Cartn_x');
		const yIndex = headers.indexOf('_chem_comp_atom.model_Cartn_y');
		const zIndex = headers.indexOf('_chem_comp_atom.model_Cartn_z');

		if (atomIdIndex === -1 || elementIndex === -1 || xIndex === -1 || yIndex === -1 || zIndex === -1)
			throw new Error('Invalid CIF: atom coordinates are missing.');

		i = j;

		while (i < lines.length)
		{
			const dataLine = lines[i].trim();

			if (!dataLine)
			{
				i++;
				continue;
			}

			if (dataLine === 'loop_' || dataLine.startsWith('_'))
				break;

			const values = dataLine.split(/\s+/);

			if (values.length < headers.length)
				throw new Error('Invalid CIF: incomplete atom data.');

			const atomId = values[atomIdIndex];
			const element = values[elementIndex];
			const x = Number(values[xIndex]);
			const y = Number(values[yIndex]);
			const z = Number(values[zIndex]);

			if (!atomId || !element || !Number.isFinite(x) || !Number.isFinite(y) || !Number.isFinite(z))
				throw new Error('Invalid CIF: invalid atom data.');

			atoms.push({
				id: atomId,
				element,
				x,
				y,
				z,
			});

			i++;
		}

		break;
	}

	if (atoms.length === 0)
		throw new Error('Invalid CIF: no atoms found.');

	return {
		atoms,
		bonds,
	};
}