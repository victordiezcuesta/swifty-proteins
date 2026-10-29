import {useEffect, useRef, useState,useMemo} from 'react';
import {Alert, Text, TouchableOpacity, View} from 'react-native';
import {GLView, ExpoWebGLRenderingContext} from 'expo-gl'; //ExpoWebGLRenderingContext=contexto gráfico OpenGL que proporciona Expo
import * as THREE from 'three';
import {File, Paths} from 'expo-file-system';
import {RecordingView, useViewRecorder} from 'react-native-view-recorder';

import {Molecule, Atom, BondInfo} from '../../types/molecule';
import {createAtomsView, disposeAtomsView} from './AtomsViews';
import {createBondsView, disposeBondsView} from './BondsViews';
import GestureControls from './GestureControls';
import AtomInformation from './AtomInformation';
import BondInformation from './BondInformation';
import {shareMolecule, shareVideo} from '../../services/Share';
import {styles} from '../../styles/MoleculeView.styles';
import {useTheme} from '../../styles/theme';

type MoleculeViewProps = {
    molecule: Molecule;
};

const FOV = 60; //campo de visión
const VIDEO_FPS = 30;
const VIDEO_FRAMES = 90; // 90 frames a 30 fps = 3 segundos

export default function MoleculeView({molecule}: MoleculeViewProps)
{
	const frameRef = useRef<number | null>(null); //varables/puntero que modificamos sin provocar un nuevo render
	const cleanupRef = useRef<(() => void) | null>(null);
	const bondsGroupRef = useRef<THREE.Group | null>(null);
	const atomsGroupRef = useRef<THREE.Group | null>(null);
	const moleculeGroupRef = useRef<THREE.Group | null>(null);
	const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
	const radiusRef = useRef(1);
	const glRef = useRef<ExpoWebGLRenderingContext | null>(null);
	const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
	const sceneRef = useRef<THREE.Scene | null>(null);
	const theme = useTheme();
	const ambientRef = useRef<THREE.AmbientLight | null>(null);
	const lightRef = useRef<THREE.DirectionalLight | null>(null);

	const recorder = useViewRecorder(); // objeto que controla la grabación
	
	const [recording, setRecording] = useState(false);
	const [sharing, setSharing] = useState(false); //useState variables que provocan nueva render
	const [selectedAtom, setSelectedAtom] = useState<Atom | null>(null);
	const [selectedBond, setSelectedBond] = useState<BondInfo | null>(null);
 
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
			rendererRef.current = null;
			sceneRef.current = null;
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

		const ambient = new THREE.AmbientLight(0xffffff, theme.ambientIntensity); //luz de ambiente
		scene.add(ambient);

		const light = new THREE.DirectionalLight(0xffffff, theme.lightIntensity); //uz direccional para darles una visual mas 3d
		light.position.set(5, 5, 5);
		scene.add(light);

		ambientRef.current = ambient;
		lightRef.current = light;

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
		bondsGroupRef.current = bondsView;

		const radius = atomsView.radius;

		//Camera
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
		rendererRef.current = renderer;
		sceneRef.current = scene;
		applySceneTheme();
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
			rendererRef.current = null;
			sceneRef.current = null;
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
		const bondsGroup = bondsGroupRef.current;

		if (!camera || !atomsGroup || !bondsGroup)
			return;

		// calculamos las coordenadas del toque mediante ndc que es -1x +1x -1y +1y
		const ndc = new THREE.Vector2((x / width) * 2 - 1, -(y / height) * 2 + 1);

		const raycaster = new THREE.Raycaster();//ennviamos un rayo para ver que atomo hemos tocado
		raycaster.setFromCamera(ndc, camera);

		const hits = raycaster.intersectObjects([...atomsGroup.children, ...bondsGroup.children], false); //lanzamos el rayo contra átomos y bonds a la vez, hits[0] es lo más cercano a la cámara

		const data = hits.length > 0 ? hits[0].object.userData : null; // Comprueba si el rayo ha intersectado alguno de los objetos que están dentro de atomsGroup

		//si seleccionamos un atomo nos da la info del atomo y si pulsamos un bond cierra la info del atomo y abre el del bond y viceversa
		setSelectedAtom((data?.atom as Atom) ?? null);
		setSelectedBond((data?.bond as BondInfo) ?? null);

		highlightElement(data?.atom ? (data.atom as Atom).element : null); //al tocar un atomo ponemos todos los atomos del mismo elemento mas grande y con mas luz
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

	async function handleRecord()
	{
		const gl = glRef.current;
		const renderer = rendererRef.current;
		const scene = sceneRef.current;
		const camera = cameraRef.current;
		const group = moleculeGroupRef.current;

		if (!gl || !renderer || !scene || !camera || !group || recording || sharing)
			return; // si falta algo o ya estamos grabando, no hacemos nada

		const startRotation = group.rotation.y; // la guardamos para restaurarla al acabar
		const file = new File(Paths.cache, 'molecule.mp4'); // archivo temporal en la caché de la app

		try
		{
			setRecording(true);

			if (file.exists)
				file.delete(); // borramos el vídeo anterior si existe

			await recorder.record({
				output: file.uri,
				fps: VIDEO_FPS,
				totalFrames: VIDEO_FRAMES,
				onFrame: async ({frameIndex}) => // se llama antes de capturar cada frame
				{
					group.rotation.y = startRotation + (frameIndex / VIDEO_FRAMES) * Math.PI * 2; // giro completo repartido en frames
					renderer.render(scene, camera); // dibujamos este frame ahora mismo
					gl.endFrameEXP(); // lo presentamos en pantalla para que se capture
				},
			});

			await shareVideo(file.uri);
		}
		catch (error)
		{
			const message = error instanceof Error
				? error.message
				: 'Unable to record the molecule.';

			Alert.alert('Recording failed', message);
		}
		finally
		{
			group.rotation.y = startRotation; // restauramos siempre, aunque falle
			setRecording(false);
		}
	}

	function highlightElement(element: string | null)
	{
		const group = atomsGroupRef.current;
		if (!group)
			return;

		for (const child of group.children)
		{
			const mesh = child as THREE.Mesh;
			const material = mesh.material as THREE.MeshStandardMaterial;
			const match = element !== null && (mesh.userData.atom as Atom).element === element;

			mesh.scale.setScalar(match ? 1.4 : 1);   // más grande: se nota incluso con el hidrógeno blanco
			material.emissive.set(match ? '#FFFFFF' : '#000000'); // y brilla un poco
			material.emissiveIntensity = match ? 0.35 : 0;
		}
	}

	function applySceneTheme()
	{
		const scene = sceneRef.current;
		const ambient = ambientRef.current;
		const light = lightRef.current;
		if (!scene || !ambient || !light)
			return;

		scene.background = new THREE.Color(theme.scene);
		ambient.intensity = theme.ambientIntensity;
		light.intensity = theme.lightIntensity;
	}

	useEffect(() =>
	{
		applySceneTheme(); // si cambias el tema del móvil con la molécula abierta, se actualiza en vivo
	}, [theme]);

	return (
		<View style={styles.container}>
			<GestureControls onRotate={rotateMolecule} onZoom={zoomCamera} onTap={handleTap}>
				<RecordingView sessionId={recorder.sessionId} style={styles.glView}>
					<GLView style={styles.glView} onContextCreate={onContextCreate} />
				</RecordingView>
			</GestureControls>

			<AtomInformation atom={selectedAtom} />
			<BondInformation bond={selectedBond} />

			<TouchableOpacity
				style={styles.shareButton}
				onPress={handleShare}
				disabled={sharing}
			>
				<Text style={styles.shareButtonText}>
					{sharing ? 'Sharing...' : 'Share'}
				</Text>
			</TouchableOpacity>

			<TouchableOpacity
				style={styles.recordButton}
				onPress={handleRecord}
				disabled={recording || sharing}
			>
				<Text style={styles.shareButtonText}>Video</Text>
			</TouchableOpacity>

			{recording && (
				<View style={styles.recordingOverlay}>
					<Text style={styles.shareButtonText}>Recording...</Text>
				</View>
			)}

		</View>
	);
}