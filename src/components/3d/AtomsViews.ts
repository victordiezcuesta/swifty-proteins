import * as THREE from 'three';

import {Molecule} from '../../types/molecule';
import {getCpkColor} from '../../utils/cpk';

const ATOM_RADIUS = 0.3;

export function createAtomsView(molecule: Molecule, center: THREE.Vector3,): {group: THREE.Group; radius: number;}
{
	const group = new THREE.Group();
	const sphereGeometry = new THREE.SphereGeometry(ATOM_RADIUS, 24, 24,);
	const materials = new Map<string, THREE.MeshStandardMaterial>();

	let radius = 0;

	for (const atom of molecule.atoms)
	{
		let material = materials.get(atom.element);

		if (!material)
		{
			material = new THREE.MeshStandardMaterial({
				color: getCpkColor(atom.element),
			});

			materials.set(atom.element, material);
		}

		const mesh = new THREE.Mesh(sphereGeometry, material,);
		mesh.position.set(
			atom.x - center.x,
			atom.y - center.y,
			atom.z - center.z,
		);

		group.add(mesh);

		radius = Math.max(radius, mesh.position.length());
	}

	return {
		group,
		radius,
	};
}

export function disposeAtomsView(
	view: {
		group: THREE.Group;
		radius: number;
	},
): void
{
	view.group.traverse(object =>
	{
		if (!(object instanceof THREE.Mesh))
			return;

		object.geometry.dispose();

		if (object.material instanceof THREE.Material)
			object.material.dispose();
	});
}