import {StyleSheet, Text, View} from 'react-native';

type HomeScreenProps = {
	onLogout?: () => void;
};

export default function HomeScreen({onLogout}: HomeScreenProps)
{
	return (
		<View style={styles.container}>
			<Text style={styles.title}>
				Welcome to Swifty Protein
			</Text>

			<Text style={styles.subtitle}>
				Authentication successful.
			</Text>
		</View>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		alignItems: 'center',
		justifyContent: 'center',
		paddingHorizontal: 24,
		backgroundColor: '#F5F7FA',
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
});
