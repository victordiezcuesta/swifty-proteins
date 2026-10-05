import {StyleSheet} from 'react-native';

export const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: '#F5F7FA',
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
		color: '#17202A',
	},

	logout: {
		color: '#2563EB',
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
		backgroundColor: '#2563EB',
	},

	retryText: {
		color: '#FFFFFF',
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
		backgroundColor: '#FFFFFF',
		fontSize: 16,
	},

	row: {
		height: 56,
		justifyContent: 'center',
		paddingHorizontal: 16,
		borderBottomWidth: StyleSheet.hairlineWidth,
		borderBottomColor: '#D5DADF',
		backgroundColor: '#FFFFFF',
	},

	rowText: {
		fontSize: 17,
		fontWeight: '600',
		color: '#17202A',
	},

	empty: {
		marginTop: 32,
		textAlign: 'center',
		color: '#68737D',
		fontSize: 16,
	},
});