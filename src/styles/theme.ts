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
	card: string; // tarjeta de info de átomo/enlace
	scene: string; // fondo de la escena 3D
	ambientIntensity: number; // luz ambiente 3D
	lightIntensity: number; // luz direccional 3D
};

const light: Theme = {
	isDark: false,
	background: '#EEF4EF',
	surface: '#FFFFFF',
	text: '#14301F',
	textSecondary: '#5E7A68',
	border: '#D3E2D7',
	link: '#1F7A4D',
	success: '#16803C',
	error: '#B42318',
	card: 'rgba(20, 48, 31, 0.92)',
	scene: '#E3EEE6',
	ambientIntensity: 0.6,
	lightIntensity: 1,
};

const dark: Theme = {
	isDark: true,
	background: '#0E1A13',
	surface: '#16251C',
	text: '#E6F2E9',
	textSecondary: '#93AD9C',
	border: '#2A4033',
	link: '#34A56F',
	success: '#4ADE80',
	error: '#F97066',
	card: 'rgba(30, 52, 40, 0.95)',
	scene: '#0E1A13',
	ambientIntensity: 0.8,
	lightIntensity: 1.2,
};

export function useTheme(): Theme
{
	return useColorScheme() === 'dark' ? dark : light;
}