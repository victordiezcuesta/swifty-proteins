import {GLView, ExpoWebGLRenderingContext} from 'expo-gl';
import * as Sharing from 'expo-sharing';

export async function shareMolecule(gl: ExpoWebGLRenderingContext): Promise<void>
{
	if (!(await Sharing.isAvailableAsync()))
		throw new Error('Sharing is not available on this device.');

	const snapshot = await GLView.takeSnapshotAsync(gl, {
		format: 'png',
		flip: true,
	});

	const source = snapshot.localUri;

	if (typeof source !== 'string' || source.length === 0)
		throw new Error('Unable to capture the molecule.');

	await Sharing.shareAsync(source, {
		mimeType: 'image/png',
		dialogTitle: 'Share molecule',
	});
}
