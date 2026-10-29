import {useColorScheme} from 'react-native';

export type Theme = {
	isDark: boolean;
	background: string;
	surface: string;
	text: string;
	textSecondary: string;
	border: string;
	link: string;
	success: string;
	error: string;
	card: string;             // tarjeta de info de átomo/enlace
	scene: string;            // fondo de la escena 3D
	ambientIntensity: number; // luz ambiente 3D
	lightIntensity: number;   // luz direccional 3D
};

const light: Theme = {
	isDark: false,
	background: '#F5F7FA',
	surface: '#FFFFFF',
	text: '#17202A',
	textSecondary: '#68737D',
	border: '#D5DADF',
	link: '#2563EB',
	success: '#16803C',
	error: '#B42318',
	card: 'rgba(23, 32, 42, 0.92)',
	scene: '#F5F7FA',
	ambientIntensity: 0.6,
	lightIntensity: 1,
};

const dark: Theme = {
	isDark: true,
	background: '#0F1117',
	surface: '#1B1F2A',
	text: '#F2F4F7',
	textSecondary: '#98A2B3',
	border: '#344054',
	link: '#60A5FA',
	success: '#4ADE80',
	error: '#F97066',
	card: 'rgba(52, 64, 84, 0.95)',
	scene: '#0F1117',
	ambientIntensity: 0.8,
	lightIntensity: 1.2,
};

export function useTheme(): Theme
{
	return useColorScheme() === 'dark' ? dark : light;
}