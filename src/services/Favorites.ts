import * as SecureStore from 'expo-secure-store';

import {getCurrentUsername, userKey} from './Authentification';

async function favoritesKey(): Promise<string | null>
{
	const username = await getCurrentUsername();
	if (!username)
		return null;

	return 'favorites_' + userKey(username);
}

export async function getFavorites(): Promise<string[]>
{
	try
	{
		const key = await favoritesKey();
		if (!key)
			return [];

		const stored = await SecureStore.getItemAsync(key);
		if (!stored)
			return [];

		const parsed = JSON.parse(stored); //convierte el texto en array y si el json esta mal lo comprobamos con el parse
		if (!Array.isArray(parsed))
			return [];

		return parsed.filter(item => typeof item === 'string'); //descartamos cualquier cosa que no sea un id
	}
	catch
	{
		return [];
	}
}

export async function saveFavorites(favorites: string[]): Promise<void>
{
	const key = await favoritesKey();
	if (!key)
		throw new Error('No user is logged in.');

	await SecureStore.setItemAsync(key, JSON.stringify(favorites)); //guardamos el json que lo hemos cambiado de array a json con stringify
}