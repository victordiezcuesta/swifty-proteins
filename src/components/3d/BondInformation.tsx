import {Text, View} from 'react-native';
import {useMemo} from 'react';

import {useTheme} from '../../styles/theme';
import {BondInfo} from '../../types/molecule';
import {createStyles} from '../../styles/AtomInformation.styles';

type BondInformationProps = {
	bond: BondInfo | null;
};

function getBondType(order: number): string
{
	if (order === 1)
		return 'Single';
	if (order === 2)
		return 'Double';
	if (order === 3)
		return 'Triple';
	return 'Aromatic'; // order 1.5
}

export default function BondInformation({bond}: BondInformationProps)
{
	const theme = useTheme();
	const styles = useMemo(() => createStyles(theme), [theme]);

	if (!bond)
		return null;

	return (
		<View style={styles.card} pointerEvents="none">
			<View style={styles.header}>
				<Text style={styles.element}>{getBondType(bond.order)} bond</Text>
			</View>

			<Text style={styles.line}>
				Atoms: {bond.atom1} - {bond.atom2}
			</Text>

			<Text style={styles.line}>
				Length: {bond.length.toFixed(3)} Å
			</Text>
		</View>
	);
}