import { useState } from 'react';
import {Alert, KeyboardAvoidingView, Platform, Text, TextInput, TouchableOpacity, View} from 'react-native';

import { register } from '../services/Authentification';
import {styles} from '../styles/RegisterScreen.styles';

type RegisterScreenProps = {
	onRegisterSuccess?: () => void;
};

export default function RegisterScreen({onRegisterSuccess}: RegisterScreenProps)
{
	const [username, setUsername] = useState('');
	const [password, setPassword] = useState('');
	const [confirmPassword, setConfirmPassword] = useState('');
	const [loading, setLoading] = useState(false);

	async function handleRegister()
	{
		if (!username.trim())
		{
			Alert.alert('Invalid username', 'Please enter a username.',);
			return;
		}

		if (password.length < 8)
		{
			Alert.alert('Invalid password', 'Password must contain at least 8 characters.');
			return;
		}

		if (password !== confirmPassword)
		{
			Alert.alert('Passwords do not match', 'Please make sure both passwords are identical.');
			return;
		}

		try
		{
			setLoading(true);

			await register(username, password);

			Alert.alert('Account created', 'Your account has been created successfully.',
				[ //AlertButton
					{
						text: 'Continue',
						onPress: onRegisterSuccess,
					},
				],
			);
		}
		catch (error)
		{
			const message = error instanceof Error
					? error.message
					: 'Unable to create the account.';

			Alert.alert('Registration failed', message);
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
					Create account
				</Text>

				<Text style={styles.subtitle}>
					Create your Swifty Protein account
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

				<Text style={styles.label}>
					Confirm password
				</Text>

				<TextInput
					style={styles.input}
					value={confirmPassword}
					onChangeText={setConfirmPassword}
					placeholder="Confirm password"
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
					onPress={handleRegister}
					disabled={loading}
				>
					<Text style={styles.buttonText}>
						{loading
							? 'Creating account...'
							: 'Create account'}
					</Text>
				</TouchableOpacity>
			</View>
		</KeyboardAvoidingView>
	);
}