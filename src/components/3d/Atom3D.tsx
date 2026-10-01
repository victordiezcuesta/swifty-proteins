/*import {Mesh} from 'three';
import {useRef} from 'react';

import {Atom} from '../../types/molecule';

type Atom3DProps = {
    atom: Atom;
};

export default function Atom3D({atom}: Atom3DProps)
{
    const meshRef = useRef<Mesh>(null);

    return (
        <mesh
            ref={meshRef}
            position={[atom.x, atom.y, atom.z]}
        >
            <sphereGeometry args={[0.5, 32, 32]} />

            <meshStandardMaterial color="black" />
        </mesh>
    );
}*/