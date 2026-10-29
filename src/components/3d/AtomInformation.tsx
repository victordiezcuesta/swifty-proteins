import {Text, View} from 'react-native';
import {useMemo} from 'react';

import {useTheme} from '../../styles/theme';
import {Atom} from '../../types/molecule';
import {getCpkColor} from '../../utils/cpk';
import {createStyles} from '../../styles/AtomInformation.styles';

type AtomInformationProps = {
	atom: Atom | null;
};

export default function AtomInformation({atom}: AtomInformationProps)
{
	if (!atom)
		return null;

	const theme = useTheme();
	const styles = useMemo(() => createStyles(theme), [theme]);

	return (
		<View style={styles.card} pointerEvents="none">
			<View style={styles.header}>
				<View style={[styles.dot, {backgroundColor: getCpkColor(atom.element)}]} />
				<Text style={styles.element}>{atom.element}</Text>
			</View>

			<Text style={styles.line}>
				Name: {atom.id}
			</Text>
			
			<Text style={styles.line}>
				x: {atom.x.toFixed(3)}  y: {atom.y.toFixed(3)}  z: {atom.z.toFixed(3)}
			</Text>
		</View>
	);
}