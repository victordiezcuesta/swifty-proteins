import * as Crypto from 'expo-crypto';
import * as SecureStore from 'expo-secure-store';
import * as LocalAuthentication from 'expo-local-authentication';
import bcrypt from 'bcryptjs';

import { User } from '../types/auth';

const USER_KEY = 'swifty_proteins_user';
const BCRYPT_COST = 10;

// React Native no trae un generador aleatorio que bcryptjs detecte solo
bcrypt.setRandomFallback((len: number) => Array.from(Crypto.getRandomBytes(len)));

function isValidUser(value: any): value is User
{
	return (
		value
		&& typeof value.username === 'string'
		&& typeof value.passwordHash === 'string'
		&& value.algorithm === 'bcrypt'
	);
}

export async function register(username: string, password: string): Promise<void>
{
	const cleanUsername = username.trim();

	if (!cleanUsername)
		throw new Error('Username is required.');

	if (password.length < 8)
		throw new Error('Password must contain at least 8 characters.');

	if (new TextEncoder().encode(password).length > 72)
		throw new Error('Password must be at most 72 bytes long.');

	const existingUser = await getUser();
	if (existingUser)
		throw new Error('An account already exists.');

	const passwordHash = await bcrypt.hash(password, BCRYPT_COST);

	const user: User = {
		username: cleanUsername,
		passwordHash,
		algorithm: 'bcrypt',
	};

	await SecureStore.setItemAsync(USER_KEY, JSON.stringify(user));
}

export async function getUser(): Promise<User | null>
{
	const storedUser = await SecureStore.getItemAsync(USER_KEY);
	if (!storedUser)
		return null;

	try
	{
		const parsed = JSON.parse(storedUser);
		return isValidUser(parsed) ? parsed : null;
	}
	catch
	{
		return null;
	}
}

export async function login(username: string, password: string): Promise<boolean>
{
	const user = await getUser();
	if (!user)
		return false;

	const passwordOk = await bcrypt.compare(password, user.passwordHash);
	const usernameOk = user.username === username.trim();

	return usernameOk && passwordOk;
}

export async function biometricLogin(): Promise<boolean>
{
	const user = await getUser();
	if (!user)
		throw new Error('No account has been registered.');

	const hasHardware = await LocalAuthentication.hasHardwareAsync();
	if (!hasHardware)
		throw new Error('This device does not support biometric authentication.');

	const isEnrolled = await LocalAuthentication.isEnrolledAsync();
	if (!isEnrolled)
		throw new Error('No biometric authentication is enrolled on this device.');

	const result = await LocalAuthentication.authenticateAsync({
		promptMessage: 'Log in to Swifty Protein',
		cancelLabel: 'Cancel',
	});

	if (!result.success)
	{
		throw new Error('Biometric authentication failed. Please try again.');
	}

	return true;
}