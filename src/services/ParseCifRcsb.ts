import {Atom, Bond, Molecule} from '../types/molecule';

function parseAtoms(lines: string[]): Atom[]
{
	const atoms: Atom[] = [];

	//buscamos primero si es un atomo simple la molecula
	const atomProperties: Record<string, string> = {};

	for (const line of lines)
	{
		const trimmedLine = line.trim();
		if (!trimmedLine.startsWith('_chem_comp_atom.'))
			continue;

		const values = trimmedLine.split(/\s+/);
		if (values.length >= 2)
			atomProperties[values[0]] = values[1]; //atomProperties["_chem_comp_atom.atom_id"] = "C1";
	}

	if (Object.keys(atomProperties).length > 0)
	{
		const atomId = atomProperties['_chem_comp_atom.atom_id'];
		const element = atomProperties['_chem_comp_atom.type_symbol'];

		const normalX = atomProperties['_chem_comp_atom.model_Cartn_x'] ?? '?';
		const normalY = atomProperties['_chem_comp_atom.model_Cartn_y'] ?? '?';
		const normalZ = atomProperties['_chem_comp_atom.model_Cartn_z'] ?? '?';

		const idealX = atomProperties['_chem_comp_atom.pdbx_model_Cartn_x_ideal'] ?? '?';
		const idealY = atomProperties['_chem_comp_atom.pdbx_model_Cartn_y_ideal'] ?? '?';
		const idealZ = atomProperties['_chem_comp_atom.pdbx_model_Cartn_z_ideal'] ?? '?';

		const xValue = normalX === '?' ? idealX : normalX;
		const yValue = normalY === '?' ? idealY : normalY;
		const zValue = normalZ === '?' ? idealZ : normalZ;

		const x = Number(xValue);
		const y = Number(yValue);
		const z = Number(zValue);

		/*console.log('Atoma ID: ', atomId);
		console.log('Element: ', element);
		console.log('X: ', x);
		console.log('Y: ', y);
		console.log('Z: ', z);*/

		if (!atomId || !element || xValue === '?' || xValue === '.' || yValue === '?' || yValue === '.' || zValue === '?' || zValue === '.' || !Number.isFinite(x) || !Number.isFinite(y) || !Number.isFinite(z))
			throw new Error('Invalid CIF: invalid atom data.');

		atoms.push({
			id: atomId,
			element,
			x,
			y,
			z,
		});
		return atoms;
	}

	// Si no es un atomo individual buscamos la tabla loop
	for (let i = 0; i < lines.length; i++)
	{
		if (lines[i].trim() !== 'loop_')
			continue;

		const headers: string[] = [];

		let j = i + 1;
		while (j < lines.length) //contamos j para saber el tamaño de la tabla
		{
			const header = lines[j].trim();
			if (!header.startsWith('_'))
				break;

			headers.push(header);
			j++;
		}

		if (!headers.some(header => header.startsWith('_chem_comp_atom.')))
			continue;

		//posiciones de columnas, primera columna, segunda,...
		const atomIdIndex = headers.indexOf('_chem_comp_atom.atom_id');
		const elementIndex = headers.indexOf('_chem_comp_atom.type_symbol');

		const xIndex = headers.indexOf('_chem_comp_atom.model_Cartn_x');
		const yIndex = headers.indexOf('_chem_comp_atom.model_Cartn_y');
		const zIndex = headers.indexOf('_chem_comp_atom.model_Cartn_z');

		const xIdealIndex = headers.indexOf('_chem_comp_atom.pdbx_model_Cartn_x_ideal');
		const yIdealIndex = headers.indexOf('_chem_comp_atom.pdbx_model_Cartn_y_ideal');
		const zIdealIndex = headers.indexOf('_chem_comp_atom.pdbx_model_Cartn_z_ideal');

		if (atomIdIndex === -1 || elementIndex === -1)
			throw new Error('Invalid CIF: atom information is missing.');

		const hasNormalCoordinates =
			xIndex !== -1 && yIndex !== -1 && zIndex !== -1;

		const hasIdealCoordinates =
			xIdealIndex !== -1 && yIdealIndex !== -1 && zIdealIndex !== -1;

		if (!hasNormalCoordinates && !hasIdealCoordinates)
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

			if (dataLine.startsWith('#') || dataLine === 'loop_' || dataLine.startsWith('_'))
				break;

			const values = dataLine.split(/\s+/);
			if (values.length < headers.length)
				throw new Error(`Invalid CIF: incomplete atom data at line ${i + 1}.`);

			//valores de cada atomo
			const atomId = values[atomIdIndex];
			const element = values[elementIndex];

			const normalX = hasNormalCoordinates ? values[xIndex] : '?';
			const normalY = hasNormalCoordinates ? values[yIndex] : '?';
			const normalZ = hasNormalCoordinates ? values[zIndex] : '?';

			const xValue = normalX === '?' ? (hasIdealCoordinates ? values[xIdealIndex] : '?') : normalX;
			const yValue = normalY === '?' ? (hasIdealCoordinates ? values[yIdealIndex] : '?') : normalY;
			const zValue = normalZ === '?' ? (hasIdealCoordinates ? values[zIdealIndex] : '?') : normalZ;

			const x = Number(xValue);
			const y = Number(yValue);
			const z = Number(zValue);

			/*console.log('Atoma ID: ', atomId);
			console.log('Element: ', element);
			console.log('X: ', x);
			console.log('Y: ', y);
			console.log('Z: ', z);*/

			if (!atomId || !element || xValue === '?' || xValue === '.' || yValue === '?' || yValue === '.' || zValue === '?' || zValue === '.' || !Number.isFinite(x) || !Number.isFinite(y) || !Number.isFinite(z))
				throw new Error(`Invalid CIF: invalid atom data at line ${i + 1}.`);

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

	return atoms;
}

function parseBonds(lines: string[]): Bond[]
{
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

		if (!headers.some(header => header.startsWith('_chem_comp_bond.')))
			continue;

		const atom1Index = headers.indexOf('_chem_comp_bond.atom_id_1');
		const atom2Index = headers.indexOf('_chem_comp_bond.atom_id_2');
		const orderIndex = headers.indexOf('_chem_comp_bond.value_order');

		if (atom1Index === -1 || atom2Index === -1 || orderIndex === -1)
			throw new Error('Invalid CIF: bond information is missing.');

		i = j;
		while (i < lines.length)
		{
			const dataLine = lines[i].trim();
			if (!dataLine)
			{
				i++;
				continue;
			}

			if (dataLine.startsWith('#') || dataLine === 'loop_' || dataLine.startsWith('_'))
				break;

			const values = dataLine.split(/\s+/);
			if (values.length < headers.length)
				throw new Error('Invalid CIF: incomplete bond data.');

			const atom1 = values[atom1Index];
			const atom2 = values[atom2Index];
			const valueOrder = values[orderIndex];
			if (!atom1 || !atom2 || !valueOrder)
				throw new Error('Invalid CIF: invalid bond data.');

			let order: number;
			switch (valueOrder.toUpperCase())
			{
				case 'SING':
					order = 1;
					break;

				case 'DOUB':
					order = 2;
					break;

				case 'TRIP':
					order = 3;
					break;

				case 'AROM':
					order = 1.5;
					break;

				default:
					throw new Error(`Invalid CIF: unsupported bond order "${valueOrder}".`);
			}

			bonds.push({
				atom1,
				atom2,
				order,
			});
			i++;
		}
		break;
	}
	return bonds;
}

export function parseCif(cif: string): Molecule
{
	const lines = cif.split(/\r?\n/);

	const atoms = parseAtoms(lines);
	const bonds = parseBonds(lines);

	return {
		atoms,
		bonds,
	};
}