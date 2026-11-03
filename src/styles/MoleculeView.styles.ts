import {StyleSheet} from 'react-native';

export const styles = StyleSheet.create({
	container: {
		flex: 1,
	},

	glView: {
		flex: 1,
	},

	shareButton: {
		position: 'absolute',
		top: 50,
		right: 20,
		height: 44,
		paddingHorizontal: 18,
		borderRadius: 14,
		alignItems: 'center',
		justifyContent: 'center',
		backgroundColor: '#1F7A4D',
	},

	shareButtonText: {
		color: '#FFFFFF',
		fontSize: 15,
		fontWeight: '700',
	},

	modeBar: {
		position: 'absolute',
		bottom: 110,
		left: 10,
		right: 10,
		flexDirection: 'row',
		justifyContent: 'center',
	},

	modeButton: {
		height: 40,
		paddingHorizontal: 14,
		marginHorizontal: 4,
		borderRadius: 14,
		alignItems: 'center',
		justifyContent: 'center',
		backgroundColor: 'rgba(20, 48, 31, 0.55)',
	},

	modeButtonActive: {
		backgroundColor: '#1F7A4D',
	},

	modeText: {
		color: '#FFFFFF',
		fontSize: 14,
		fontWeight: '700',
	},
});