import {StyleSheet} from 'react-native';

import {Theme} from './theme';

export const createStyles = (t: Theme) => StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: 't.background',
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
		color: 't.text',
		textAlign: 'center',
	},

	subtitle: {
		marginTop: 12,
		fontSize: 16,
		color: 't.textSecondary',
		textAlign: 'center',
	},

	success: {
		marginTop: 20,
		fontSize: 18,
		fontWeight: '600',
		color: t.success,
		textAlign: 'center',
	},

	error: {
		marginTop: 16,
		fontSize: 16,
		color: t.error,
		textAlign: 'center',
	},

	info: {
		marginTop: 12,
		fontSize: 15,
		color: 't.textSecondary',
		textAlign: 'center',
	},

	button: {
		height: 50,
		marginTop: 28,
		paddingHorizontal: 24,
		borderRadius: 10,
		alignItems: 'center',
		justifyContent: 'center',
		backgroundColor: t.link,
	},

	buttonText: {
		color: 't.surface',
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