import {useCallback, useEffect, useMemo, useRef, useState} from 'react';
import {ActivityIndicator, Alert, FlatList, Text, TextInput, TouchableOpacity, View} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';

import {useTheme} from '../styles/theme';
import {loadLigands} from '../services/Ligands';
import {getFavorites, saveFavorites} from '../services/Favorites';
import {createStyles} from '../styles/LigandListScreen.styles';

type LigandListScreenProps = {
	onSelectLigand?: (ligandId: string) => void;
	onLogout?: () => void;
};

const ROW_HEIGHT = 56;

export default function LigandListScreen({onSelectLigand, onLogout}: LigandListScreenProps)
{
	const [ligands, setLigands] = useState<string[]>([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);
	const [query, setQuery] = useState('');
	const [favorites, setFavorites] = useState<string[]>([]);
	const [onlyFavorites, setOnlyFavorites] = useState(false);
	const mounted = useRef(true);
	const theme = useTheme();
	const styles = useMemo(() => createStyles(theme), [theme]);

	const reload = useCallback(() => //React guarda esta función y reutiliza la misma función mientras no cambien sus dependencias
	{
		setLoading(true);
		setError(null);

		loadLigands()
			.then(list =>
			{
				if (mounted.current)
					setLigands(list);
			})
			.catch(e =>
			{
				if (mounted.current)
				{
					setLigands([]);
					setError(e instanceof Error ? e.message : 'Unable to load the ligand list.');
				}
			})
			.finally(() =>
			{
				if (mounted.current)
					setLoading(false);
			});
	}, []);

	useEffect(() =>
	{
		mounted.current = true;
		reload();

		getFavorites().then(list => //cargamos los favoritos guardados
		{
			if (mounted.current)
				setFavorites(list);
		});

		return () =>
		{
			mounted.current = false;
		};
	}, [reload]);

	function toggleFavorite(id: string)
	{
		const next = favorites.includes(id)
			? favorites.filter(favorite => favorite !== id)
			: [...favorites, id];

		setFavorites(next);
		saveFavorites(next).catch(() =>
			Alert.alert('Favorites', 'Unable to save your favorites. Please try again.'));
	}

	const filteredLigands = useMemo(() =>
	{
		const q = query.trim().toLowerCase();

		return ligands.filter(id =>
			(!onlyFavorites || favorites.includes(id))
			&& id.toLowerCase().includes(q));
	}, [query, ligands, favorites, onlyFavorites]);

	if (loading)
	{
		return (
			<SafeAreaView style={[styles.container, styles.centered]}>
				<ActivityIndicator size="large" color={theme.link} />
			</SafeAreaView>
		);
	}

	if (error)
	{
		return (
			<SafeAreaView style={[styles.container, styles.centered]}>
				<Text style={styles.empty}>{error}</Text>

				<TouchableOpacity style={styles.retryButton} onPress={reload}>
					<Text style={styles.retryText}>Retry</Text>
				</TouchableOpacity>

				<TouchableOpacity style={styles.logoutButton} onPress={onLogout}>
					<Text style={styles.logout}>Log out</Text>
				</TouchableOpacity>
			</SafeAreaView>
		);
	}

	return (
		<SafeAreaView style={styles.container}>
			<View style={styles.header}>
				<Text style={styles.title}>Ligands</Text>
				<TouchableOpacity onPress={onLogout}>
					<Text style={styles.logout}>Log out</Text>
				</TouchableOpacity>
			</View>

			<TextInput
				style={styles.search}
				value={query}
				onChangeText={setQuery}
				placeholder="Search ligand"
				autoCapitalize="characters"
				autoCorrect={false}
				clearButtonMode="while-editing"
				returnKeyType="search"
				placeholderTextColor={theme.textSecondary}
			/>

			<TouchableOpacity
				style={[styles.filterButton, onlyFavorites && styles.filterButtonActive]}
				onPress={() => setOnlyFavorites(!onlyFavorites)}
				accessibilityRole="button"
				accessibilityLabel="Show only favorites"
			>
				<Text style={[styles.filterText, onlyFavorites && styles.filterTextActive]}>
					♥ Favorites ({favorites.length})
				</Text>
			</TouchableOpacity>

			<FlatList
				data={filteredLigands}
				extraData={favorites}
				keyExtractor={item => item}
				keyboardShouldPersistTaps="handled"
				initialNumToRender={20}
				windowSize={10}
				getItemLayout={(_, index) => ({
					length: ROW_HEIGHT,
					offset: ROW_HEIGHT * index,
					index,
				})}
				renderItem={({item}) => (
					<View style={styles.row}>
						<TouchableOpacity
							style={styles.rowButton}
							onPress={() => onSelectLigand?.(item)}
							accessibilityRole="button"
							accessibilityLabel={`Ligand ${item}`}
						>
							<Text style={styles.rowText}>{item}</Text>
						</TouchableOpacity>

						<TouchableOpacity
							onPress={() => toggleFavorite(item)}
							accessibilityRole="button"
							accessibilityLabel={favorites.includes(item)
								? `Remove ${item} from favorites`
								: `Add ${item} to favorites`}
						>
							<Text style={styles.like}>
								{favorites.includes(item) ? '♥' : '♡'}
							</Text>
						</TouchableOpacity>
					</View>
				)}
				ListEmptyComponent={
					<Text style={styles.empty}>
						{onlyFavorites && !query.trim()
							? 'No favorites yet. Tap ♡ on a ligand to add it.'
							: `No ligands match "${query}".`}
					</Text>
				}
			/>
		</SafeAreaView>
	);
}