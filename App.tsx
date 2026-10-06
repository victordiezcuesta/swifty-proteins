import {useEffect, useRef, useState} from 'react';
import {Alert, AppState, AppStateStatus} from 'react-native';

import LoginScreen from './src/screens/LoginScreen';
import RegisterScreen from './src/screens/RegisterScreen';
import LigandListScreen from './src/screens/LigandListScreen';
import LigandScreen from './src/screens/LigandScreen';
//import ThreeTestScreen from './src/screens/ThreeTestScreen';

import {fetchLigand} from './src/services/DownloadToRcsb';
import {parseCif} from './src/services/ParseCifRcsb';
import {Molecule} from './src/types/molecule';

import {LogBox} from 'react-native';
LogBox.ignoreLogs(['THREE.WebGLRenderer: WebGL 1 support was deprecated']); //ignoramos el warning para que no nos salga porque hemos bajado la version de three porque no era compatible

type Screen = 'login' | 'register' | 'list' | 'ligand';

export default function App()
{
	const [screen, setScreen] = useState<Screen>('login'); //iniciamos la app con login siempre
	const [selectedLigand, setSelectedLigand] = useState<string | null>(null);
	const [ligandCif, setLigandCif] = useState<string | null>(null);
	const [ligandLoading, setLigandLoading] = useState(false);
	const [ligandError, setLigandError] = useState<string | null>(null);
	const [ligandMolecule, setLigandMolecule] = useState<Molecule | null>(null);

	const appState = useRef<AppStateStatus>(AppState.currentState); //guardamos el valor que persiste entre los renders pero no provoca una renderizacion

	useEffect(() =>
	{
		const subscription = AppState.addEventListener('change', nextAppState => //React Native avisa cada vez que cambie el estado de la aplicación
		{
			const wasBackgrounded = appState.current === 'background' || appState.current === 'inactive';
			if (wasBackgrounded && nextAppState === 'active') //si venimos de nuestro escriorio del movil volvemos al login
				setScreen('login');

			appState.current = nextAppState; //actualizamos el estado
		});

		return () =>
		{
			subscription.remove(); //limpiamos
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
				molecule={ligandMolecule}
			/>
		);
	}

	async function handleSelectLigand(id: string)
	{
		setSelectedLigand(id); //guardmoa el id del ligand seleccionado
		setLigandCif(null);
		setLigandError(null);
		setLigandLoading(true);
		setLigandMolecule(null);
		setScreen('ligand');

		try
		{
			const cif = await fetchLigand(id);

			let molecule: Molecule;
			try
			{
				molecule = parseCif(cif);
			}
			catch
			{
				throw new Error('Failed to parse ligand data. The file may be corrupted.');
			}

			setLigandCif(cif);
			setLigandMolecule(molecule);
		}
		catch (error)
		{
			const message = error instanceof Error
				? error.message
				: 'Unable to load the ligand.';

			setLigandError(message);
			Alert.alert('Ligand loading failed', message);
		}
		finally
		{
			setLigandLoading(false);
		}
	}

	return (
		<LoginScreen
			onLoginSuccess={() => setScreen('list')}
			onRegisterPress={() => setScreen('register')}
		/>
	);
}