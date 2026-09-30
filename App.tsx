import {useEffect, useRef, useState} from 'react';
import {AppState, AppStateStatus} from 'react-native';

import LoginScreen from './src/screens/LoginScreen';
import RegisterScreen from './src/screens/RegisterScreen';
import HomeScreen from './src/screens/HomeScreen';

type Screen = 'login' | 'register' | 'home';

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

	if (screen === 'home')
	{
		return (
			<HomeScreen />
		);
	}

	return (
		<LoginScreen
			onLoginSuccess={() => setScreen('home')}
			onRegisterPress={() => setScreen('register')}
		/>
	);
}