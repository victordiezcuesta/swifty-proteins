import {useEffect, useRef, useState} from 'react';
import {Alert, Text, TouchableOpacity, View} from 'react-native';
import {GLView, ExpoWebGLRenderingContext} from 'expo-gl'; //ExpoWebGLRenderingContext=contexto gráfico OpenGL que proporciona Expo
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
	const frameRef = useRef<number | null>(null); //varables/puntero que modificamos sin provocar un nuevo render
	const cleanupRef = useRef<(() => void) | null>(null);
	const atomsGroupRef = useRef<THREE.Group | null>(null);
	const moleculeGroupRef = useRef<THREE.Group | null>(null);
	const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
	const radiusRef = useRef(1);
	const glRef = useRef<ExpoWebGLRenderingContext | null>(null);

	const [sharing, setSharing] = useState(false); //useState variables que provocan nueva render
	const [selectedAtom, setSelectedAtom] = useState<Atom | null>(null);
 
	useEffect(() =>
	{
		return () => //limpieza al desmontar MoleculaView
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

		const width = gl.drawingBufferWidth; //tamaño de la pantalla
		const height = gl.drawingBufferHeight;

		//a Three le damos un objeto que se comporta como un canvas
		const canvas = {
			width,
			height,
			style: {},
			addEventListener: () => {},
			removeEventListener: () => {},
			clientWidth: width,
			clientHeight: height,
		} as unknown as HTMLCanvasElement; // y tratamos el objeto como un HTMLCanvasElement

		const renderer = new THREE.WebGLRenderer({ //Dibuja esta escena usando esta cámara y este contexto gráfico
			canvas,
			context: gl,
		});

		renderer.setSize(width, height);

		const scene = new THREE.Scene();

		scene.background = new THREE.Color('#F5F7FA');

		scene.add(new THREE.AmbientLight(0xffffff, 0.6)); //luz de ambiente

		const light = new THREE.DirectionalLight(0xffffff, 1); //uz direccional para darles una visual mas 3d
		light.position.set(5, 5, 5);
		scene.add(light);

		const center = new THREE.Vector3();
		for (const atom of molecule.atoms)
		{
			center.add(new THREE.Vector3( //vamoss sumando todas las coordenadas
					atom.x,
					atom.y,
					atom.z,
				),
			);
		}
		center.divideScalar(molecule.atoms.length); //el resultado de las sumas de coordenadas la dividimos para encontrar el centro

		//creamos el grupo de moleculas enteras con sus atomos y bonds
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
		const aspect = width / height; //lo hacmos para que la molecula no salga deformada

		const camera = new THREE.PerspectiveCamera(FOV, aspect, 0.1, 1000);

		//calculamos los angulos horizontal y vertical para la camara y elegimos el menor para asegurarnos que la molecula entra
		const vHalf = THREE.MathUtils.degToRad(FOV / 2);
		const hHalf = Math.atan(Math.tan(vHalf) * aspect);
		const half = Math.min(vHalf, hHalf);

		const distance = Math.max(radius, 1) / Math.sin(half) * 1.1; //calculamos la distancia al centro de la molecula para la camara

		camera.position.set(0, 0, distance);
		camera.lookAt(0, 0, 0);

		//Guardamos referencias para los gestos
		moleculeGroupRef.current = moleculeGroup;
		cameraRef.current = camera;
		radiusRef.current = radius;

		function loop()
		{
			frameRef.current = requestAnimationFrame(loop); //Cuando el dispositivo esté preparado para el siguiente frame, vuelve a ejecutar loop y hacemos un bucle infinito

			renderer.render(scene, camera);//Renderiza la scene utilizando la camera

			gl.endFrameEXP(); //cuando expogl termina de preparar el frame lo indicamos y lo presentamos
		}

		loop();

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

	//rotacion con un dedo
	function rotateMolecule(dx: number, dy: number)
	{
		const group = moleculeGroupRef.current;
		if (!group)
			return;
	
		group.rotation.y += dx * 0.01; //rotacion horizontal

		group.rotation.x += dy * 0.01; //rotacion vertival

		const limit = Math.PI / 2; //limitamos la rotacion en +90º y -90º

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

		// calculamos las coordenadas del toque mediante ndc que es -1x +1x -1y +1y
		const ndc = new THREE.Vector2((x / width) * 2 - 1, -(y / height) * 2 + 1);

		const raycaster = new THREE.Raycaster();//ennviamos un rayo para ver que atomo hemos tocado
		raycaster.setFromCamera(ndc, camera);

		const hits = raycaster.intersectObjects(atomsGroup.children, false);

		// Comprueba si el rayo ha intersectado alguno de los objetos que están dentro de atomsGroup
		setSelectedAtom(hits.length > 0 ? (hits[0].object.userData.atom as Atom) : null);
	}

	async function handleShare()
	{
		const gl = glRef.current; //guardamos la referencia de la renderizacion 3d en una variable local de la funcion

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