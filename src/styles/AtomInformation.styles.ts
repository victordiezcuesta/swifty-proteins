import {StyleSheet} from 'react-native';

export const styles = StyleSheet.create({
	card: {
		position: 'absolute',
		top: 60,
		alignSelf: 'center',
		minWidth: 200,
		padding: 14,
		borderRadius: 12,
		backgroundColor: 'rgba(23, 32, 42, 0.92)',
	},

	header: {
		flexDirection: 'row',
		alignItems: 'center',
		marginBottom: 6,
	},

	dot: {
		width: 16,
		height: 16,
		borderRadius: 8,
		marginRight: 10,
		borderWidth: 1,
		borderColor: '#FFFFFF',
	},

	element: {
		fontSize: 22,
		fontWeight: '700',
		color: '#FFFFFF',
	},

	line: {
		fontSize: 14,
		color: '#D5DADF',
	},
});