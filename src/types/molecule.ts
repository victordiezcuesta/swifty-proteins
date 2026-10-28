export type Atom = {
	id: string;
	element: string;
	x: number;
	y: number;
	z: number;
};

export type Bond = {
	atom1: string;
	atom2: string;
	order: number;
};

export type Molecule = {
	atoms: Atom[];
	bonds: Bond[];
};

export type BondInfo = Bond & {
	length: number; // en angstroms(1 Å = 10⁻¹⁰ m)
};