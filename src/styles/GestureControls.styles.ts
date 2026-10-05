import {StyleSheet} from 'react-native';

export const styles = StyleSheet.create({
	container: {
		flex: 1,
	},

	gestureLayer: {
		...StyleSheet.absoluteFill,
		backgroundColor: 'transparent',
	},
});