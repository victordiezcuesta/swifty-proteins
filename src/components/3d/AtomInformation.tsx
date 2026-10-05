import {Text, View} from 'react-native';

import {Atom} from '../../types/molecule';
import {getCpkColor} from '../../utils/cpk';
import {styles} from '../../styles/AtomInformation.styles';

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