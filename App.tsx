import {useEffect, useRef, useState} from 'react';
import {AppState, AppStateStatus} from 'react-native';

import LoginScreen from './src/screens/LoginScreen';
import RegisterScreen from './src/screens/RegisterScreen';
import LigandListScreen from './src/screens/LigandListScreen';

type Screen = 'login' | 'register' | 'list';

export default function App()
{
	const [screen, setScreen] = useState<Screen>('login');
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
				onSelectLigand={(id) => console.log('selected', id)} // provisional
			/>
		);
	}


	return (
		<LoginScreen
			onLoginSuccess={() => setScreen('list')}
			onRegisterPress={() => setScreen('register')}
		/>
	);
}