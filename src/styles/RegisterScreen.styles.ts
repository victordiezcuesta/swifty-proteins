import {StyleSheet} from 'react-native';

export const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: '#F5F7FA',
	},

	content: {
		flex: 1,
		justifyContent: 'center',
		paddingHorizontal: 24,
	},

	title: {
		fontSize: 30,
		fontWeight: '700',
		color: '#17202A',
		textAlign: 'center',
	},

	subtitle: {
		marginTop: 8,
		marginBottom: 32,
		fontSize: 16,
		color: '#68737D',
		textAlign: 'center',
	},

	label: {
		marginBottom: 6,
		marginTop: 16,
		fontSize: 15,
		fontWeight: '600',
		color: '#17202A',
	},

	input: {
		height: 50,
		borderWidth: 1,
		borderColor: '#D5DADF',
		borderRadius: 10,
		paddingHorizontal: 14,
		backgroundColor: '#FFFFFF',
		fontSize: 16,
	},

	button: {
		height: 50,
		marginTop: 28,
		borderRadius: 10,
		alignItems: 'center',
		justifyContent: 'center',
		backgroundColor: '#2563EB',
	},

	buttonDisabled: {
		opacity: 0.6,
	},

	buttonText: {
		color: '#FFFFFF',
		fontSize: 16,
		fontWeight: '700',
	},
});