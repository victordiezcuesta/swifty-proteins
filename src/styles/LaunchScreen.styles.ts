import {StyleSheet} from 'react-native';

export const styles = StyleSheet.create(
{
	container:
	{
		flex: 1,
		backgroundColor: '#1A1038',
		alignItems: 'center',
		justifyContent: 'center',
		paddingHorizontal: 40,
	},

	logoContainer:
	{
		width: 180,
		height: 180,
		alignItems: 'center',
		justifyContent: 'center',
		marginBottom: 20,
	},

	logo:
	{
		width: 150,
		height: 150,
	},

	title:
	{
		color: '#FFFFFF',
		fontSize: 28,
		fontWeight: '700',
		letterSpacing: 2,
	},

	subtitle:
	{
		color: '#B8AED4',
		fontSize: 14,
		marginTop: 8,
		marginBottom: 35,
	},

	progressContainer:
	{
		width: '100%',
		height: 6,
		backgroundColor: '#34265A',
		borderRadius: 3,
		overflow: 'hidden',
	},

	progressBar:
	{
		height: '100%',
		backgroundColor: '#FFFFFF',
		borderRadius: 3,
	},

	loading:
	{
		color: '#B8AED4',
		fontSize: 12,
		marginTop: 12,
	},
});