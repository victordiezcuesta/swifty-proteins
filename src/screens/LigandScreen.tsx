import {ActivityIndicator, Text, TouchableOpacity, View} from 'react-native';

import MoleculeView from '../components/3d/MoleculeView';
import {Molecule} from '../types/molecule';
import {styles} from '../styles/LigandScreen.styles';

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
			<View style={styles.moleculeContainer}>
				<MoleculeView molecule={molecule} />

				<TouchableOpacity style={[styles.button, styles.backButton]} onPress={onBack}>
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