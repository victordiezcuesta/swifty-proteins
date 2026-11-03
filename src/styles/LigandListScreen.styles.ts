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
		borderRadius: 14,
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
		borderColor: t.border,
		borderRadius: 14,
		backgroundColor: t.surface,
		fontSize: 16,
		color: t.text,
	},

	row: {
		height: 56,
		flexDirection: 'row', //nombre a la izquierda, estrella a la derecha
		alignItems: 'center',
		paddingLeft: 16,
		borderBottomWidth: StyleSheet.hairlineWidth,
		borderBottomColor: t.border,
		backgroundColor: t.surface,
	},

	rowButton: {
		flex: 1,
		height: '100%',
		justifyContent: 'center',
	},

	star: {
		width: 34,
		height: 34,
		marginHorizontal: 12,
		borderRadius: 17,
		alignItems: 'center',
		justifyContent: 'center',
	},

	starActive: {
		backgroundColor: t.link,
	},

	starText: {
		fontSize: 22,
		color: t.textSecondary,
	},

	starTextActive: {
		color: '#FFFFFF',
	},

	filterButton: {
		alignSelf: 'flex-start',
		height: 36,
		marginHorizontal: 16,
		marginBottom: 8,
		paddingHorizontal: 14,
		borderRadius: 18,
		borderWidth: 1,
		borderColor: t.link,
		justifyContent: 'center',
	},

	filterButtonActive: {
		backgroundColor: t.link,
	},

	filterText: {
		color: t.link,
		fontSize: 14,
		fontWeight: '600',
	},

	filterTextActive: {
		color: t.surface,
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