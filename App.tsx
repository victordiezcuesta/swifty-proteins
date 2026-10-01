import {useEffect, useRef, useState} from 'react';
import {AppState, AppStateStatus} from 'react-native';

import LoginScreen from './src/screens/LoginScreen';
import RegisterScreen from './src/screens/RegisterScreen';
import LigandListScreen from './src/screens/LigandListScreen';
import LigandScreen from './src/screens/LigandScreen';
import ThreeTestScreen from './src/screens/ThreeTestScreen';

import {fetchLigand} from './src/services/DownloadToRcsb';
import {parseCif} from './src/services/ParseCifRcsb';
import {Molecule} from './src/types/molecule';

import {LogBox} from 'react-native';
LogBox.ignoreLogs(['THREE.WebGLRenderer: WebGL 1 support was deprecated']); //ignoramos el warning para que no nos salga porque hemos bajado la version de three porque no era compatible

type Screen = 'login' | 'register' | 'list' | 'ligand';

export default function App()
{
	const [screen, setScreen] = useState<Screen>('login');
	const [selectedLigand, setSelectedLigand] = useState<string | null>(null);
	const [ligandCif, setLigandCif] = useState<string | null>(null);
	const [ligandLoading, setLigandLoading] = useState(false);
	const [ligandError, setLigandError] = useState<string | null>(null);
	const [ligandMolecule, setLigandMolecule] = useState<Molecule | null>(null);

	const appState = useRef<AppStateStatus>(AppState.currentState);

	useEffect(() =>
	{
		const subscription = AppState.addEventListener('change', nextAppState =>
		{
			const wasBackgrounded = appState.current === 'background' || appState.current === 'inactive';
			if (wasBackgrounded && nextAppState === 'active')
				setScreen('login');

			appState.current = nextAppState;
		});

		return () =>
		{
			subscription.remove();
		};
	}, []);

	if (screen === 'register')
	{
		return (
			<RegisterScreen
				onRegisterSuccess={() => setScreen('login')}
			/>
		);
	}

	if (screen === 'list')
	{
		return (
			<LigandListScreen
				onLogout={() => setScreen('login')}
				onSelectLigand={handleSelectLigand}
			/>
		);
	}

	if (screen === 'ligand')
	{
		return (
			<LigandScreen
				ligandId={selectedLigand}
				cif={ligandCif}
				loading={ligandLoading}
				error={ligandError}
				onBack={() => setScreen('list')}
			/>
		);
	}

	async function handleSelectLigand(id: string)
	{
		setSelectedLigand(id);
		setLigandCif(null);
		setLigandError(null);
		setLigandLoading(true);
		setLigandMolecule(null);
		setScreen('ligand');

		try
		{
			const cif = await fetchLigand(id);
			const molecule = parseCif(cif);

			setLigandCif(cif);
			setLigandMolecule(molecule);
		}
		catch (error)
		{
			setLigandError(error instanceof Error
				? error.message
				: 'Unable to load the ligand.',
			);
		}
		finally
		{
			setLigandLoading(false);
		}
	}


	/*return (
		<LoginScreen
			onLoginSuccess={() => setScreen('list')}
			onRegisterPress={() => setScreen('register')}
		/>
	);*/
	return <ThreeTestScreen />;
}