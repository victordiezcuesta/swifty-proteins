import {useEffect, useRef, useState} from 'react';
import {Alert, Text, TouchableOpacity, View} from 'react-native';
import {GLView, ExpoWebGLRenderingContext} from 'expo-gl';
import * as THREE from 'three';

import {Molecule, Atom} from '../../types/molecule';
import {createAtomsView, disposeAtomsView} from './AtomsViews';
import {createBondsView, disposeBondsView} from './BondsViews';
import GestureControls from './GestureControls';
import AtomInformation from './AtomInformation';
import {shareMolecule} from '../../services/Share';
import {styles} from '../../styles/MoleculeView.styles';

type MoleculeViewProps = {
    molecule: Molecule;
};

const FOV = 60;

export default function MoleculeView({molecule}: MoleculeViewProps)
{
	const frameRef = useRef<number | null>(null);
	const cleanupRef = useRef<(() => void) | null>(null);
	const atomsGroupRef = useRef<THREE.Group | null>(null);
	const [selectedAtom, setSelectedAtom] = useState<Atom | null>(null);

	/*
	* References used by the gesture controls.
	*
	* We modify Three.js objects directly instead of using
	* React state. This avoids unnecessary React re-renders
	* while the user is interacting with the molecule.
	*/
	const moleculeGroupRef = useRef<THREE.Group | null>(null);
	const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
	const radiusRef = useRef(1);
	const glRef = useRef<ExpoWebGLRenderingContext | null>(null);
	const [sharing, setSharing] = useState(false);

	useEffect(() =>
	{
		return () =>
		{
			if (frameRef.current !== null)
				cancelAnimationFrame(frameRef.current);

			cleanupRef.current?.();

			moleculeGroupRef.current = null;
			cameraRef.current = null;
			atomsGroupRef.current = null;
			glRef.current = null;
		};
	}, []);

	function onContextCreate(gl: ExpoWebGLRenderingContext)
	{
		glRef.current = gl;

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
		scene.add(new THREE.AmbientLight(0xffffff, 0.6));

		const light = new THREE.DirectionalLight(0xffffff, 1);
		light.position.set(5, 5, 5);
		scene.add(light);

		/*
		* Calculate the center of the molecule.
		*
		* Atoms and bonds are created relative to this point,
		* so the molecule group rotates around its own center.
		*/
		const center = new THREE.Vector3();

		for (const atom of molecule.atoms)
		{
			center.add(new THREE.Vector3(
					atom.x,
					atom.y,
					atom.z,
				),
			);
		}

		center.divideScalar(molecule.atoms.length);

		/*
		* Main group containing the entire molecule.
		*/
		const moleculeGroup = new THREE.Group();
		scene.add(moleculeGroup);

		const atomsView = createAtomsView(molecule, center);
		moleculeGroup.add(atomsView.group);
		atomsGroupRef.current = atomsView.group;

		const bondsView = createBondsView(molecule, center);
		moleculeGroup.add(bondsView);

		const radius = atomsView.radius;

		/*
		* Camera
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
		* Store references used by GestureControls.
		*/
		moleculeGroupRef.current = moleculeGroup;
		cameraRef.current = camera;
		radiusRef.current = radius;

		/*
		* Render loop.
		*
		* There is intentionally no automatic rotation here.
		* The molecule is now controlled entirely by gestures.
		*/
		function loop()
		{
			frameRef.current = requestAnimationFrame(loop);

			renderer.render(scene, camera);

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

			moleculeGroupRef.current = null;
			cameraRef.current = null;
			atomsGroupRef.current = null;
			glRef.current = null;
		};
	}

	/*
	* One-finger rotation.
	*/
	function rotateMolecule(dx: number, dy: number)
	{
		const group = moleculeGroupRef.current;
		if (!group)
			return;

		/*
		* Horizontal movement -> rotate around Y.
		*/
		group.rotation.y += dx * 0.01;

		/*
		* Vertical movement -> rotate around X.
		*/
		group.rotation.x += dy * 0.01;

		/*
		* Prevent the X rotation from going too far.
		* This avoids the molecule becoming difficult to control.
		*/
		const limit = Math.PI / 2;

		group.rotation.x = THREE.MathUtils.clamp(group.rotation.x, -limit, limit);
	}

	function zoomCamera(scale: number)
	{
		const camera = cameraRef.current;
		if (!camera || scale <= 0)
			return;

		const radius = Math.max(radiusRef.current, 1);

		camera.position.z = THREE.MathUtils.clamp(camera.position.z / scale, Math.max(radius * 0.5, 0.5), Math.max(radius * 5, 5));
	}

	function handleTap(x: number, y: number, width: number, height: number)
	{
		const camera = cameraRef.current;
		const atomsGroup = atomsGroupRef.current;
		if (!camera || !atomsGroup)
			return;

		// Coordenadas del toque -> NDC (-1..1)
		const ndc = new THREE.Vector2((x / width) * 2 - 1, -(y / height) * 2 + 1);

		const raycaster = new THREE.Raycaster();
		raycaster.setFromCamera(ndc, camera);

		const hits = raycaster.intersectObjects(atomsGroup.children, false);

		// Si no toca ningún átomo -> null -> la tarjeta desaparece
		// Si toca otro átomo -> se sustituye
		setSelectedAtom(hits.length > 0 ? (hits[0].object.userData.atom as Atom) : null);
	}

	async function handleShare()
	{
		const gl = glRef.current;

		if (!gl || sharing)
			return;

		try
		{
			setSharing(true);
			await shareMolecule(gl);
		}
		catch (error)
		{
			const message = error instanceof Error
				? error.message
				: 'Unable to share the molecule.';

			Alert.alert('Share failed', message);
		}
		finally
		{
			setSharing(false);
		}
	}

	return (
		<View style={styles.container}>
			<GestureControls onRotate={rotateMolecule} onZoom={zoomCamera} onTap={handleTap}>
				<GLView style={styles.glView} onContextCreate={onContextCreate} />
			</GestureControls>

			<AtomInformation atom={selectedAtom} />

			<TouchableOpacity
				style={styles.shareButton}
				onPress={handleShare}
				disabled={sharing}
			>
				<Text style={styles.shareButtonText}>
					{sharing ? 'Sharing...' : 'Share'}
				</Text>
			</TouchableOpacity>
		</View>
	);
}