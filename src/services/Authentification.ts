import * as Crypto from 'expo-crypto';
import * as SecureStore from 'expo-secure-store';
import * as LocalAuthentication from 'expo-local-authentication';
import bcrypt from 'bcryptjs';

import { User } from '../types/auth';

const USER_KEY_PREFIX = 'swifty_proteins_user_';
const LAST_USER_KEY = 'swifty_proteins_last_user';
const BCRYPT_COST = 10; //hace 2^10 operaciones para hasear password

bcrypt.setRandomFallback((len: number) => Array.from(Crypto.getRandomBytes(len))); //le damos una funcion de bytes aleatorios y lo metemos en un array, porque react native no trae una funcion randorizada que nos valga

function userKey(username: string): string //SecureStore solo admite [A-Za-z0-9._-] en las claves, así que pasamos el username a hex y lo ponemos el usuario en minusculas para que Victor y victor sea el mismo user
{
	const hex = Array.from(new TextEncoder().encode(username.trim().toLowerCase()))
		.map(byte => byte.toString(16).padStart(2, '0'))
		.join('');

	return USER_KEY_PREFIX + hex;
}

function isValidUser(value: any): value is User
{
	return (
		value
		&& typeof value.username === 'string'
		&& typeof value.passwordHash === 'string'
		&& value.algorithm === 'bcrypt'
	);
}

function isValidPassword(password: string): boolean
{
	const hasNumber = /[0-9]/.test(password);
	const hasUppercase = /[A-Z]/.test(password);
	const hasLowercase = /[a-z]/.test(password);
	const hasSpecial = /[^A-Za-z0-9]/.test(password);

	return (
		password.length >= 8
		&& hasNumber
		&& hasUppercase
		&& hasLowercase
		&& hasSpecial
	);
}

export async function getUser(username: string): Promise<User | null>
{
	const storedUser = await SecureStore.getItemAsync(userKey(username));
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

export async function register(username: string, password: string): Promise<void>
{
	const cleanUsername = username.trim();

	if (!cleanUsername)
		throw new Error('Username is required.');

	if (cleanUsername.length < 3)
		throw new Error('Username must contain at least 3 characters.');

	if (cleanUsername.length >= 50)
		throw new Error('Username must be less than 50 characters.');

	if (!isValidPassword(password))
		throw new Error('Password must contain at least 8 characters, including a number, an uppercase letter, a lowercase letter, and a special character.');

	if (new TextEncoder().encode(password).length > 72) //bcrypt solo utiliza los primeros 72 bytes de password para el hash
		throw new Error('Password must be at most 72 bytes long.');

	const existingUser = await getUser(cleanUsername);
	if (existingUser)
		throw new Error('This username is already taken.');

	const passwordHash = await bcrypt.hash(password, BCRYPT_COST);

	const user: User = {
		username: cleanUsername,
		passwordHash,
		algorithm: 'bcrypt',
	};

	await SecureStore.setItemAsync(userKey(cleanUsername), JSON.stringify(user)); //guardamos los datos en el movil y con el identificador en "la tabla" USER_KEY y lo guardamos como json
}

export async function login(username: string, password: string): Promise<boolean>
{
	const user = await getUser(username);
	if (!user)
		return false;

	const passwordOk = await bcrypt.compare(password, user.passwordHash);
	if (!passwordOk)
		return false;

	await SecureStore.setItemAsync(LAST_USER_KEY, user.username); // Recordamos quién fue el último en entrar para el login biométrico

	return true;
}

export async function biometricLogin(): Promise<boolean>
{
	const lastUsername = await SecureStore.getItemAsync(LAST_USER_KEY);
	if (!lastUsername || !(await getUser(lastUsername)))
		throw new Error('Sign in once with your username and password to enable biometric login.');

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
		throw new Error('Biometric authentication failed. Please try again.');

	return true;
}