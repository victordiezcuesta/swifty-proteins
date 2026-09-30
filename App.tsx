import { useState } from 'react';

import LoginScreen from './src/screens/LoginScreen';
import RegisterScreen from './src/screens/RegisterScreen';
import HomeScreen from './src/screens/HomeScreen';

type Screen = 'login' | 'register' | 'home';

export default function App()
{
	const [screen, setScreen] = useState<Screen>('login');

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