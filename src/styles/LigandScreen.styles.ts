import {StyleSheet} from 'react-native';

export const styles = StyleSheet.create({
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

	moleculeContainer: {
		flex: 1,
	},

	backButton: {
		position: 'absolute',
		bottom: 40,
		alignSelf: 'center',
	},
});