import {StyleSheet} from 'react-native';

import {Theme} from './theme';

export const createStyles = (t: Theme) => StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: 't.background',
	},

	content: {
		flex: 1,
		justifyContent: 'center',
		paddingHorizontal: 24,
	},

	title: {
		fontSize: 30,
		fontWeight: '700',
		color: 't.text',
		textAlign: 'center',
	},

	subtitle: {
		marginTop: 8,
		marginBottom: 32,
		fontSize: 16,
		color: 't.textSecondary',
		textAlign: 'center',
	},

	label: {
		marginBottom: 6,
		marginTop: 16,
		fontSize: 15,
		fontWeight: '600',
		color: 't.text',
	},

	input: {
		height: 50,
		borderWidth: 1,
		borderColor: '#D5DADF',
		borderRadius: 10,
		paddingHorizontal: 14,
		backgroundColor: 't.surface',
		fontSize: 16,
		color: t.text,
	},

	button: {
		height: 50,
		marginTop: 28,
		borderRadius: 10,
		alignItems: 'center',
		justifyContent: 'center',
		backgroundColor: t.link,
	},

	buttonDisabled: {
		opacity: 0.6,
	},

	buttonText: {
		color: 't.surface',
		fontSize: 16,
		fontWeight: '700',
	},
});