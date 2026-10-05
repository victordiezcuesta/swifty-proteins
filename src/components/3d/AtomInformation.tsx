import {StyleSheet, Text, View} from 'react-native';

import {Atom} from '../../types/molecule';
import {getCpkColor} from '../../utils/cpk';

type AtomInformationProps = {
	atom: Atom | null;
};

export default function AtomInformation({atom}: AtomInformationProps)
{
	if (!atom)
		return null;

	return (
		<View style={styles.card} pointerEvents="none">
			<View style={styles.header}>
				<View style={[styles.dot, {backgroundColor: getCpkColor(atom.element)}]} />
				<Text style={styles.element}>{atom.element}</Text>
			</View>

			<Text style={styles.line}>Name: {atom.id}</Text>
			<Text style={styles.line}>
				x: {atom.x.toFixed(3)}  y: {atom.y.toFixed(3)}  z: {atom.z.toFixed(3)}
			</Text>
		</View>
	);
}

const styles = StyleSheet.create({
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