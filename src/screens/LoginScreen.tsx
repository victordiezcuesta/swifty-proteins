import { useState } from 'react';
import {Alert, KeyboardAvoidingView, Platform, StyleSheet, Text, TextInput, TouchableOpacity, View} from 'react-native';

import {biometricLogin, login} from '../services/Authentification';

type LoginScreenProps = {
	onLoginSuccess?: () => void;
	onRegisterPress?: () => void;
};

export default function LoginScreen({onLoginSuccess, onRegisterPress}: LoginScreenProps)
{
	const [username, setUsername] = useState('');
	const [password, setPassword] = useState('');
	const [loading, setLoading] = useState(false);

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

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: '#F5F7FA',
	},

	content: {
		flex: 1,
		justifyContent: 'center',
		paddingHorizontal: 24,
	},

	title: {
		fontSize: 30,
		fontWeight: '700',
		color: '#17202A',
		textAlign: 'center',
	},

	subtitle: {
		marginTop: 8,
		marginBottom: 32,
		fontSize: 16,
		color: '#68737D',
		textAlign: 'center',
	},

	label: {
		marginBottom: 6,
		marginTop: 16,
		fontSize: 15,
		fontWeight: '600',
		color: '#17202A',
	},

	input: {
		height: 50,
		borderWidth: 1,
		borderColor: '#D5DADF',
		borderRadius: 10,
		paddingHorizontal: 14,
		backgroundColor: '#FFFFFF',
		fontSize: 16,
	},

	button: {
		height: 50,
		marginTop: 28,
		borderRadius: 10,
		alignItems: 'center',
		justifyContent: 'center',
		backgroundColor: '#2563EB',
	},

	buttonDisabled: {
		opacity: 0.6,
	},

	buttonText: {
		color: '#FFFFFF',
		fontSize: 16,
		fontWeight: '700',
	},

	biometricButton: {
		height: 50,
		marginTop: 12,
		borderRadius: 10,
		alignItems: 'center',
		justifyContent: 'center',
		borderWidth: 1,
		borderColor: '#2563EB',
		backgroundColor: '#FFFFFF',
	},

	biometricButtonText: {
		color: '#2563EB',
		fontSize: 16,
		fontWeight: '700',
	},

	registerButton: {
		marginTop: 24,
		alignItems: 'center',
	},

	registerText: {
		color: '#2563EB',
		fontSize: 15,
		fontWeight: '600',
	},
});