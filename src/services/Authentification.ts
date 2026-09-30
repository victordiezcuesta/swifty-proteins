import * as Crypto from 'expo-crypto'; //transforma la contraseña en un hash
import * as SecureStore from 'expo-secure-store'; //almacena ese hash de forma segura

import { User } from '../types/auth';

const USER_KEY = 'swifty_proteins_user';

async function hashPassword(password: string): Promise<string>
{
	return await Crypto.digestStringAsync(Crypto.CryptoDigestAlgorithm.SHA256, password);
}

export async function register(username: string, password: string,): Promise<void>
{
	const cleanUsername = username.trim();

	if (!cleanUsername)
		throw new Error('Username is required.');

	if (password.length < 8)
		throw new Error(`Password must contain at least 8 characters.`);

	const existingUser = await getUser();

	if (existingUser)
		throw new Error('An account already exists.');

	const passwordHash = await hashPassword(password);

	const user: User = {
		username: cleanUsername,
		passwordHash,
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
		return JSON.parse(storedUser) as User;
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

	const cleanUsername = username.trim();
	const passwordHash = await hashPassword(password);

	return (user.username === cleanUsername && user.passwordHash === passwordHash);
}