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

	recordButton: {
		position: 'absolute',
		top: 104,
		right: 20,
		height: 44,
		paddingHorizontal: 18,
		borderRadius: 10,
		alignItems: 'center',
		justifyContent: 'center',
		backgroundColor: '#2563EB',
	},

	recordingOverlay: {
		...StyleSheet.absoluteFill,
		alignItems: 'center',
		justifyContent: 'center',
		backgroundColor: 'rgba(23, 32, 42, 0.6)',
	},
});