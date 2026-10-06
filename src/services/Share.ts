import {GLView, ExpoWebGLRenderingContext} from 'expo-gl';
import * as Sharing from 'expo-sharing';

export async function shareMolecule(gl: ExpoWebGLRenderingContext): Promise<void>
{
	if (!(await Sharing.isAvailableAsync()))
		throw new Error('Sharing is not available on this device.');

	const snapshot = await GLView.takeSnapshotAsync(gl, { //tomamos una captura en png
		format: 'png',
		flip: true, //volteamos la imagen en verticual porque GLView la toma al reves
	});

	const source = snapshot.localUri; //takeSnapshotAsync devuelve objeto con información sobre la captura, entonces guardamos la ubicacion de la captura en el dispositivo

	if (typeof source !== 'string' || source.length === 0)
		throw new Error('Unable to capture the molecule.');

	await Sharing.shareAsync(source, {
		mimeType: 'image/png',
		dialogTitle: 'Share molecule',
	});
}
