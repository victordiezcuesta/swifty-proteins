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