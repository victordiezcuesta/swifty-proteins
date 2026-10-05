import {useEffect, useRef} from 'react';
import {GLView, ExpoWebGLRenderingContext} from 'expo-gl';
import * as THREE from 'three';

import {Molecule} from '../../types/molecule';
import {createAtomsView, disposeAtomsView} from './AtomsViews';
import {createBondsView, disposeBondsView} from './BondsViews';

type MoleculeViewProps = {
	molecule: Molecule;
};

const FOV = 60;

export default function MoleculeView({molecule}: MoleculeViewProps)
{
	const frameRef = useRef<number | null>(null);
	const cleanupRef = useRef<(() => void) | null>(null);

	useEffect(() =>
	{
		return () =>
		{
			if (frameRef.current !== null)
				cancelAnimationFrame(frameRef.current);

			cleanupRef.current?.();
		};
	}, []);

	function onContextCreate(gl: ExpoWebGLRenderingContext)
	{
		const width = gl.drawingBufferWidth;
		const height = gl.drawingBufferHeight;

		const canvas = {
			width,
			height,
			style: {},
			addEventListener: () => {},
			removeEventListener: () => {},
			clientWidth: width,
			clientHeight: height,
		} as unknown as HTMLCanvasElement;

		const renderer = new THREE.WebGLRenderer({
			canvas,
			context: gl,
		});

		renderer.setSize(width, height);

		const scene = new THREE.Scene();

		scene.background = new THREE.Color('#F5F7FA');

		/*
		 * Lighting
		 */
		scene.add(
			new THREE.AmbientLight(
				0xffffff,
				0.6,
			),
		);

		const light = new THREE.DirectionalLight(
			0xffffff,
			1,
		);

		light.position.set(5, 5, 5);
		scene.add(light);

		/*
		 * Calculamos el centro de la molécula.
		 */
		const center = new THREE.Vector3();

		for (const atom of molecule.atoms)
		{
			center.add(new THREE.Vector3(atom.x, atom.y, atom.z),);
		}

		center.divideScalar(molecule.atoms.length);

		/*
		 * Grupo principal de la molécula.
		 *
		 * Dentro estarán:
		 *
		 *     moleculeGroup
		 *          │
		 *          ├── AtomsViews
		 *          │
		 *          └── BondsViews
		 */
		const moleculeGroup = new THREE.Group();

		scene.add(moleculeGroup);

		// ATOMS
		const atomsView = createAtomsView(molecule, center);
		moleculeGroup.add(atomsView.group);

		// BONDS
		const bondsView = createBondsView(molecule, center);
		moleculeGroup.add(bondsView);

		/*
		 * Radio máximo de la molécula.
		 *
		 * Lo utilizamos para calcular la posición
		 * inicial de la cámara.
		 */
		const radius = atomsView.radius;

		/*
		 * Cámara
		 */
		const aspect = width / height;

		const camera = new THREE.PerspectiveCamera(FOV, aspect, 0.1, 1000);

		const vHalf = THREE.MathUtils.degToRad(FOV / 2);

		const hHalf = Math.atan(Math.tan(vHalf) * aspect);

		const half = Math.min(vHalf, hHalf);

		const distance = Math.max(radius, 1) / Math.sin(half) * 1.1;

		camera.position.set(0, 0, distance);

		camera.lookAt(0, 0, 0);

		/*
		 * Render loop
		 */
		function loop()
		{
			frameRef.current = requestAnimationFrame(loop);

			/*
			 * Rotación temporal para comprobar
			 * que toda la molécula está funcionando
			 * como un único objeto 3D.
			 */
			moleculeGroup.rotation.y += 0.01;

			renderer.render( scene, camera);

			gl.endFrameEXP();
		}

		loop();

		/*
		 * Cleanup
		 */
		cleanupRef.current = () =>
		{
			disposeAtomsView(atomsView);
			disposeBondsView(bondsView);

			renderer.dispose();
		};
	}

	return (
		<GLView
			style={{flex: 1}}
			onContextCreate={onContextCreate}
		/>
	);
}