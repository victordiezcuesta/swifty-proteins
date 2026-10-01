import {useCallback, useEffect, useMemo, useRef, useState} from 'react';
import {ActivityIndicator, FlatList, StyleSheet, Text, TextInput, TouchableOpacity, View} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';

import {loadLigands} from '../services/Ligands';

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
	const mounted = useRef(true);

	const reload = useCallback(() =>
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

		return () =>
		{
			mounted.current = false;
		};
	}, [reload]);

	const filteredLigands = useMemo(() =>
	{
		const q = query.trim().toLowerCase();
		if (!q)
			return ligands;

		return ligands.filter(id => id.toLowerCase().includes(q));
	}, [query, ligands]);

	if (loading)
	{
		return (
			<SafeAreaView style={[styles.container, styles.centered]}>
				<ActivityIndicator size="large" color="#2563EB" />
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
				placeholder="Search ligand (e.g. ATP)"
				autoCapitalize="characters"
				autoCorrect={false}
				clearButtonMode="while-editing"
				returnKeyType="search"
			/>

			<FlatList
				data={filteredLigands}
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
					<TouchableOpacity
						style={styles.row}
						onPress={() => onSelectLigand?.(item)}
						accessibilityRole="button"
						accessibilityLabel={`Ligand ${item}`}
					>
						<Text style={styles.rowText}>{item}</Text>
					</TouchableOpacity>
				)}
				ListEmptyComponent={
					<Text style={styles.empty}>No ligands match "{query}".</Text>
				}
			/>
		</SafeAreaView>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: '#F5F7FA',
	},

	centered: {
		justifyContent: 'center',
		alignItems: 'center',
		paddingHorizontal: 24,
	},

	header: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'center',
		paddingHorizontal: 16,
		paddingTop: 8,
	},

	title: {
		fontSize: 26,
		fontWeight: '700',
		color: '#17202A',
	},

	logout: {
		color: '#2563EB',
		fontSize: 15,
		fontWeight: '600',
	},

	logoutButton: {
		marginTop: 20,
	},

	retryButton: {
		height: 50,
		marginTop: 24,
		paddingHorizontal: 32,
		borderRadius: 10,
		alignItems: 'center',
		justifyContent: 'center',
		backgroundColor: '#2563EB',
	},

	retryText: {
		color: '#FFFFFF',
		fontSize: 16,
		fontWeight: '700',
	},

	search: {
		height: 44,
		margin: 16,
		paddingHorizontal: 14,
		borderWidth: 1,
		borderColor: '#D5DADF',
		borderRadius: 10,
		backgroundColor: '#FFFFFF',
		fontSize: 16,
	},

	row: {
		height: ROW_HEIGHT,
		justifyContent: 'center',
		paddingHorizontal: 16,
		borderBottomWidth: StyleSheet.hairlineWidth,
		borderBottomColor: '#D5DADF',
		backgroundColor: '#FFFFFF',
	},

	rowText: {
		fontSize: 17,
		fontWeight: '600',
		color: '#17202A',
	},

	empty: {
		marginTop: 32,
		textAlign: 'center',
		color: '#68737D',
		fontSize: 16,
	},
});