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
	ZN: '#7d80b092',
	CA: '#3DFF00',
	NA: '#AB5CF2',
};

const DEFAULT_COLOR = '#FF1493'; // elemento desconocido: rosa, para notarlo

export function getCpkColor(element: string): string
{
	return CPK_COLORS[element.toUpperCase()] ?? DEFAULT_COLOR;
}