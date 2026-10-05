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
		borderRadius: 10,
		alignItems: 'center',
		justifyContent: 'center',
		backgroundColor: '#2563EB',
	},

	shareButtonText: {
		color: '#FFFFFF',
		fontSize: 15,
		fontWeight: '700',
	},
});