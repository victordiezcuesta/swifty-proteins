import {useEffect, useRef} from 'react';
import {Animated, Text, View} from 'react-native';

import {styles} from '../styles/LaunchScreen.styles';

export default function LaunchScreen()
{
	const rotation = useRef(new Animated.Value(0)).current;
	const progress = useRef(new Animated.Value(0)).current;

	useEffect(() =>
	{
		const rotateAnimation = Animated.loop(
			Animated.timing(rotation,
			{
				toValue: 1,
				duration: 5000,
				useNativeDriver: true,
			})
		);

		const progressAnimation = Animated.timing(progress,
		{
			toValue: 1,
			duration: 3800,
			useNativeDriver: false,
		});

		rotateAnimation.start();
		progressAnimation.start();

		return () =>
		{
			rotateAnimation.stop();
			progressAnimation.stop();
		};
	}, [rotation, progress]);

	const rotate = rotation.interpolate(
		{
			inputRange: [0, 1],
			outputRange: ['0deg', '360deg'],
		}
	);

	const progressWidth = progress.interpolate(
		{
			inputRange: [0, 1],
			outputRange: ['0%', '100%'],
		}
	);

	return (
		<View style={styles.container}>
			<View style={styles.logoContainer}>
				<Animated.Image
					source={require('../../assets/android-icon-foreground.png')}
					style={[
						styles.logo,
						{transform: [{rotate}]},
					]}
					resizeMode="contain"
				/>
			</View>

			<Text style={styles.title}>SWIFTY PROTEINS</Text>
			<Text style={styles.subtitle}>Molecular Explorer</Text>

			<View style={styles.progressContainer}>
				<Animated.View
					style={[
						styles.progressBar,
						{width: progressWidth},
					]}
				/>
			</View>

			<Text style={styles.loading}>Loading...</Text>
		</View>
	);
}