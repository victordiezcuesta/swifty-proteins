import * as THREE from 'three';

import {Molecule, Atom, Bond} from '../../types/molecule';

const BOND_RADIUS = 0.08;

function createBondCylinder(start: THREE.Vector3, end: THREE.Vector3, radius: number, material: THREE.Material): THREE.Mesh
{
	const direction = new THREE.Vector3().subVectors(end, start);
	const length = direction.length();

	const geometry = new THREE.CylinderGeometry(radius, radius, length, 12);

	const mesh = new THREE.Mesh(geometry, material);

	const midpoint = new THREE.Vector3()
		.addVectors(start, end)
		.multiplyScalar(0.5);

	mesh.position.copy(midpoint);

	/*
	 * CylinderGeometry está creado inicialmente apuntando
	 * sobre el eje Y.
	 *
	 * Lo rotamos para que el eje Y apunte desde start hasta end.
	 */
	const quaternion = new THREE.Quaternion();

	quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), direction.normalize());

	mesh.quaternion.copy(quaternion);

	return mesh;
}

function getPerpendicularVector(direction: THREE.Vector3): THREE.Vector3
{
	const reference =
		Math.abs(direction.y) < 0.9
			? new THREE.Vector3(0, 1, 0)
			: new THREE.Vector3(1, 0, 0);

	return new THREE.Vector3()
		.crossVectors(direction, reference)
		.normalize();
}

function createSingleBond(group: THREE.Group, atom1: Atom, atom2: Atom, material: THREE.Material, center: THREE.Vector3, offset: THREE.Vector3 = new THREE.Vector3()): void
{
	const start = new THREE.Vector3(
		atom1.x - center.x,
		atom1.y - center.y,
		atom1.z - center.z,
	).add(offset);

	const end = new THREE.Vector3(
		atom2.x - center.x,
		atom2.y - center.y,
		atom2.z - center.z,
	).add(offset);

	const cylinder = createBondCylinder(start, end, BOND_RADIUS, material);

	group.add(cylinder);
}

function createBond(group: THREE.Group, bond: Bond, atom1: Atom, atom2: Atom, center: THREE.Vector3, material: THREE.Material): void
{
	const start = new THREE.Vector3(
		atom1.x - center.x,
		atom1.y - center.y,
		atom1.z - center.z,
	);

	const end = new THREE.Vector3(
		atom2.x - center.x,
		atom2.y - center.y,
		atom2.z - center.z,
	);

	const direction = new THREE.Vector3()
		.subVectors(end, start)
		.normalize();

	// Bond simple
	if (bond.order === 1)
	{
		createSingleBond(group, atom1, atom2, material, center);
		return;
	}

	/*
	 * Para enlaces dobles y triples creamos varios
	 * cilindros paralelos ligeramente desplazados.
	 */
	const perpendicular = getPerpendicularVector(direction);

	const offsetDistance = 0.12;

	if (bond.order === 2)
	{
		createSingleBond(group, atom1, atom2, material, center, perpendicular.clone().multiplyScalar(offsetDistance));
		createSingleBond(group, atom1, atom2, material, center, perpendicular.clone().multiplyScalar(-offsetDistance));
		return;
	}

	if (bond.order === 3)
	{
		createSingleBond(group, atom1, atom2, material, center);
		createSingleBond(group, atom1, atom2, material, center, perpendicular.clone().multiplyScalar(offsetDistance));
		createSingleBond(group, atom1, atom2, material, center, perpendicular.clone().multiplyScalar(-offsetDistance));
		return;
	}

	/*
	 * AROM = 1.5.
	 *
	 * De momento lo representamos como un enlace simple.
	 * Más adelante podemos hacer una representación
	 * específica para enlaces aromáticos.
	 */
	createSingleBond(group, atom1, atom2, material, center);
}

export function createBondsView(molecule: Molecule, center: THREE.Vector3): THREE.Group
{
	const group = new THREE.Group();

	const material = new THREE.MeshStandardMaterial({
		color: '#707070',
	});

	const atomsById = new Map<string, Atom>();

	for (const atom of molecule.atoms)
		atomsById.set(atom.id, atom);

	for (const bond of molecule.bonds)
	{
		const atom1 = atomsById.get(bond.atom1);
		const atom2 = atomsById.get(bond.atom2);
		if (!atom1 || !atom2)
			continue;

		createBond(group, bond, atom1, atom2, center, material);
	}
	return group;
}

export function disposeBondsView(group: THREE.Group): void
{
	group.traverse(object =>
	{
		if (!(object instanceof THREE.Mesh))
			return;

		object.geometry.dispose();

		if (object.material instanceof THREE.Material)
			object.material.dispose();
	});
}