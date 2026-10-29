const CPK_COLORS: Record<string, string> = {
	H: '#FFFFFF',
	C: '#909090',
	N: '#3050F8',
	O: '#FF0D0D',
	S: '#FFFF30',
	P: '#FF8000',
	F: '#90E050',
	CL: '#1FF01F',
	BR: '#A62929',
	I: '#940094',
	FE: '#E06633',
	MG: '#8AFF00',
	ZN: '#7D80B0',
	CA: '#3DFF00',
	NA: '#AB5CF2',
};

const DEFAULT_COLOR = '#FF1493'; // elemento desconocido: rosa, para notarlo

export function getCpkColor(element: string): string
{
	return CPK_COLORS[element.toUpperCase()] ?? DEFAULT_COLOR;
}

const VDW_RADII: Record<string, number> = {
	H: 1.2,
	C: 1.7,
	N: 1.55,
	O: 1.52,
	S: 1.8,
	P: 1.8,
	F: 1.47,
	CL: 1.75,
	BR: 1.85,
	I: 1.98,
	FE: 2.0,
	MG: 1.73,
	ZN: 1.39,
	CA: 2.31,
	NA: 2.27,
};

const DEFAULT_VDW = 1.7;

export function getVdwRadius(element: string): number
{
	return VDW_RADII[element.toUpperCase()] ?? DEFAULT_VDW;
}