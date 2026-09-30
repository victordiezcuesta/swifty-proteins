import { StyleSheet, Text, View } from 'react-native';

export default function App()
{
	return (
		<View style={styles.container}>
			<Text style={styles.title}>Swifty Protein</Text>
			<Text style={styles.subtitle}>
				3D, fingerprints and other things
			</Text>
		</View>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		alignItems: 'center',
		justifyContent: 'center',
	},
	title: {
		fontSize: 28,
		fontWeight: 'bold',
	},
	subtitle: {
		marginTop: 8,
		fontSize: 16,
	},
});