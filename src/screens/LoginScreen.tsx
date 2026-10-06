import {useEffect, useState} from 'react';
import {Alert, KeyboardAvoidingView, Platform, Text, TextInput, TouchableOpacity, View} from 'react-native';

import * as LocalAuthentication from 'expo-local-authentication';

import {biometricLogin, login} from '../services/Authentification';
import {styles} from '../styles/LoginScreen.styles';

type LoginScreenProps = {
	onLoginSuccess?: () => void; //lo queremos para avisar a app.tsx que nos hemos terminado de loguear
	onRegisterPress?: () => void;
};

export default function LoginScreen({onLoginSuccess, onRegisterPress}: LoginScreenProps)
{
	const [username, setUsername] = useState('');
	const [password, setPassword] = useState('');
	const [loading, setLoading] = useState(false);
	const [biometricsAvailable, setBiometricsAvailable] = useState(false);

	useEffect(() =>
	{
		async function checkBiometrics()
		{
			const hasHardware = await LocalAuthentication.hasHardwareAsync();
			if (!hasHardware)
			{
				setBiometricsAvailable(false);
				return;
			}

			const isEnrolled = await LocalAuthentication.isEnrolledAsync();
			setBiometricsAvailable(isEnrolled);
		}

		checkBiometrics();
	}, []);

	async function handleLogin()
	{
		if (!username.trim())
		{
			Alert.alert('Invalid username', 'Please enter your username.');
			return;
		}

		if (!password)
		{
			Alert.alert('Invalid password', 'Please enter your password.');
			return;
		}

		try
		{
			setLoading(true);

			const success = await login(username, password);
			if (!success)
			{
				Alert.alert('Login failed', 'Invalid username or password.');
				return;
			}

			onLoginSuccess?.();
		}
		catch (error)
		{
			const message = error instanceof Error
				? error.message
				: 'Unable to log in.';

			Alert.alert('Login failed', message);
		}
		finally
		{
			setLoading(false);
		}
	}

	async function handleBiometricLogin()
	{
		try
		{
			setLoading(true);

			const success = await biometricLogin();
			if (!success)
			{
				Alert.alert('Biometric authentication', 'Biometric authentication failed. Please try again.');
				return;
			}

			onLoginSuccess?.();
		}
		catch (error)
		{
			const message = error instanceof Error
				? error.message
				: 'Biometric authentication failed.';

			Alert.alert('Biometric authentication', message);
		}
		finally
		{
			setLoading(false);
		}
	}

	return (
		<KeyboardAvoidingView
			style={styles.container}
			behavior={Platform.OS === 'ios' ? 'padding' : undefined}
		>
			<View style={styles.content}>
				<Text style={styles.title}>
					Swifty Protein
				</Text>

				<Text style={styles.subtitle}>
					Sign in to access your proteins
				</Text>

				<Text style={styles.label}>
					Username
				</Text>

				<TextInput
					style={styles.input}
					value={username}
					onChangeText={setUsername}
					placeholder="Enter username"
					autoCapitalize="none"
					autoCorrect={false}
					editable={!loading}
				/>

				<Text style={styles.label}>
					Password
				</Text>

				<TextInput
					style={styles.input}
					value={password}
					onChangeText={setPassword}
					placeholder="Enter password"
					secureTextEntry
					autoCapitalize="none"
					autoCorrect={false}
					editable={!loading}
				/>

				<TouchableOpacity
					style={[
						styles.button,
						loading && styles.buttonDisabled,
					]}
					onPress={handleLogin}
					disabled={loading}
				>
					<Text style={styles.buttonText}>
						{loading ? 'Signing in...' : 'Sign in'}
					</Text>
				</TouchableOpacity>

				{biometricsAvailable && (
					<TouchableOpacity
						style={[
							styles.biometricButton,
							loading && styles.buttonDisabled,
						]}
						onPress={handleBiometricLogin}
						disabled={loading}
					>
						<Text style={styles.biometricButtonText}>
							Sign in with biometrics
						</Text>
					</TouchableOpacity>
				)}

				<TouchableOpacity
					style={styles.registerButton}
					onPress={onRegisterPress}
					disabled={loading}
				>
					<Text style={styles.registerText}>
						Create an account
					</Text>
				</TouchableOpacity>
			</View>
		</KeyboardAvoidingView>
	);
}