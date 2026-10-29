import {StyleSheet} from 'react-native';

import {Theme} from './theme';

export const createStyles = (t: Theme) => StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: t.background,
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
		color: t.text,
	},

	logout: {
		color: t.link,
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
		backgroundColor: t.link,
	},

	retryText: {
		color: t.surface,
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
		backgroundColor: t.surface,
		fontSize: 16,
	},

	row: {
		height: 56,
		justifyContent: 'center',
		paddingHorizontal: 16,
		borderBottomWidth: StyleSheet.hairlineWidth,
		borderBottomColor: '#D5DADF',
		backgroundColor: t.surface,
	},

	rowText: {
		fontSize: 17,
		fontWeight: '600',
		color: t.text,
	},

	empty: {
		marginTop: 32,
		textAlign: 'center',
		color: t.textSecondary,
		fontSize: 16,
	},
});