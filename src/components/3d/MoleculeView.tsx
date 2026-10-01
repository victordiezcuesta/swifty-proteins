import {useEffect, useRef} from 'react';
import {GLView, ExpoWebGLRenderingContext} from 'expo-gl';
import * as THREE from 'three';

import {Molecule} from '../../types/molecule';
import {getCpkColor} from '../../utils/cpk';

type MoleculeViewProps = {
	molecule: Molecule;
};

const ATOM_RADIUS = 0.3; // en ångströms; uniforme por ahora
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
			width, height, style: {},
			addEventListener: () => {}, removeEventListener: () => {},
			clientWidth: width, clientHeight: height,
		} as unknown as HTMLCanvasElement;

		const renderer = new THREE.WebGLRenderer({canvas, context: gl});
		renderer.setSize(width, height);

		const scene = new THREE.Scene();
		scene.background = new THREE.Color('#F5F7FA');

		scene.add(new THREE.AmbientLight(0xffffff, 0.6));
		const light = new THREE.DirectionalLight(0xffffff, 1);
		light.position.set(5, 5, 5);
		scene.add(light);

		// 1) Centroide: lo restamos a todos los átomos
		const center = new THREE.Vector3();
		for (const atom of molecule.atoms)
			center.add(new THREE.Vector3(atom.x, atom.y, atom.z));
		center.divideScalar(molecule.atoms.length);

		// 2) Un grupo con todos los átomos (así lo rotaremos entero)
		const group = new THREE.Group();
		scene.add(group);

		const sphereGeometry = new THREE.SphereGeometry(ATOM_RADIUS, 24, 24);
		const materials = new Map<string, THREE.MeshStandardMaterial>();
		let radius = 0;

		for (const atom of molecule.atoms)
		{
			let material = materials.get(atom.element);
			if (!material)
			{
				material = new THREE.MeshStandardMaterial({color: getCpkColor(atom.element)});
				materials.set(atom.element, material);
			}

			const mesh = new THREE.Mesh(sphereGeometry, material);
			mesh.position.set(atom.x - center.x, atom.y - center.y, atom.z - center.z);
			group.add(mesh);

			radius = Math.max(radius, mesh.position.length());
		}

		// 3) Cámara: distancia para que quepa la molécula entera
		const aspect = width / height;
		const camera = new THREE.PerspectiveCamera(FOV, aspect, 0.1, 1000);

		const vHalf = THREE.MathUtils.degToRad(FOV / 2);
		const hHalf = Math.atan(Math.tan(vHalf) * aspect);
		const half = Math.min(vHalf, hHalf);
		const distance = (Math.max(radius, 1) + ATOM_RADIUS) / Math.sin(half) * 1.1;
		camera.position.set(0, 0, distance);

		function loop()
		{
			frameRef.current = requestAnimationFrame(loop);
			group.rotation.y += 0.01; // temporal, para comprobar que es 3D
			renderer.render(scene, camera);
			gl.endFrameEXP();
		}
		loop();

		cleanupRef.current = () =>
		{
			sphereGeometry.dispose();
			materials.forEach(material => material.dispose());
			renderer.dispose();
		};
	}

	return <GLView style={{flex: 1}} onContextCreate={onContextCreate} />;
}