import {ActivityIndicator, StyleSheet, Text, TouchableOpacity, View} from 'react-native';

import MoleculeView from '../components/3d/MoleculeView';
import {Molecule} from '../types/molecule';

type LigandScreenProps = {
	ligandId: string | null;
	cif: string | null;
	loading: boolean;
	error: string | null;
	onBack?: () => void;
	molecule: Molecule | null;
};

export default function LigandScreen({ligandId, cif, loading, error, onBack, molecule}: LigandScreenProps)
{
	if (loading)
	{
		return (
			<View style={[styles.container, styles.centered]}>
				<ActivityIndicator size="large" color="#2563EB" />

				<Text style={styles.title}>
					Loading ligand {ligandId}...
				</Text>

				<Text style={styles.subtitle}>
					Downloading CIF data from RCSB.
				</Text>
			</View>
		);
	}

	if (error)
	{
		return (
			<View style={[styles.container, styles.centered]}>
				<Text style={styles.title}>
					Unable to load ligand
				</Text>

				<Text style={styles.error}>
					{error}
				</Text>

				<TouchableOpacity style={styles.button} onPress={onBack}>
					<Text style={styles.buttonText}>
						Back to ligands
					</Text>
				</TouchableOpacity>
			</View>
		);
	}

	if (molecule)
	{
		return (
			<View style={{flex: 1}}>
				<MoleculeView molecule={molecule} />

				<TouchableOpacity style={[styles.button, {position: 'absolute', bottom: 40, alignSelf: 'center'}]} onPress={onBack}>
					<Text style={styles.buttonText}>Back to ligands</Text>
				</TouchableOpacity>
			</View>
		);
	}

	if (cif)
	{
		return (
			<View style={styles.container}>
				<Text style={styles.title}>
					Ligand {ligandId}
				</Text>

				<Text style={styles.success}>
					CIF downloaded successfully.
				</Text>

				<Text style={styles.info}>
					Downloaded data: {cif.length} characters
				</Text>

				<TouchableOpacity style={styles.button} onPress={onBack}>
					<Text style={styles.buttonText}>
						Back to ligands
					</Text>
				</TouchableOpacity>
			</View>
		);
	}

	return (
		<View style={[styles.container, styles.centered]}>
			<Text style={styles.title}>
				No ligand selected.
			</Text>

			<TouchableOpacity style={styles.button} onPress={onBack}>
				<Text style={styles.buttonText}>
					Back to ligands
				</Text>
			</TouchableOpacity>
		</View>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: '#F5F7FA',
		paddingHorizontal: 24,
		paddingTop: 60,
	},

	centered: {
		alignItems: 'center',
		justifyContent: 'center',
	},

	title: {
		fontSize: 26,
		fontWeight: '700',
		color: '#17202A',
		textAlign: 'center',
	},

	subtitle: {
		marginTop: 12,
		fontSize: 16,
		color: '#68737D',
		textAlign: 'center',
	},

	success: {
		marginTop: 20,
		fontSize: 18,
		fontWeight: '600',
		color: '#16803C',
		textAlign: 'center',
	},

	error: {
		marginTop: 16,
		fontSize: 16,
		color: '#B42318',
		textAlign: 'center',
	},

	info: {
		marginTop: 12,
		fontSize: 15,
		color: '#68737D',
		textAlign: 'center',
	},

	button: {
		height: 50,
		marginTop: 28,
		paddingHorizontal: 24,
		borderRadius: 10,
		alignItems: 'center',
		justifyContent: 'center',
		backgroundColor: '#2563EB',
	},

	buttonText: {
		color: '#FFFFFF',
		fontSize: 16,
		fontWeight: '700',
	},
});