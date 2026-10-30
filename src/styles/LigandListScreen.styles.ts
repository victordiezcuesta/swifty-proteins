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
		flexDirection: 'row',          // NUEVO: nombre a la izquierda, estrella a la derecha
		alignItems: 'center',          // NUEVO
		paddingLeft: 16,               // CAMBIADO (antes paddingHorizontal: 16)
		borderBottomWidth: StyleSheet.hairlineWidth,
		borderBottomColor: '#D5DADF',
		backgroundColor: t.surface,
	},

	rowButton: {
		flex: 1,
		height: '100%',
		justifyContent: 'center',
	},

	like: {
		fontSize: 26,
		color: '#E0245E',
		paddingHorizontal: 16,
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

	filterButtonActive: {              // NUEVO
		backgroundColor: t.link,
	},

	filterText: {                      // NUEVO
		color: t.link,
		fontSize: 14,
		fontWeight: '600',
	},

	filterTextActive: {                // NUEVO
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