import {GLView, ExpoWebGLRenderingContext} from 'expo-gl';
import * as THREE from 'three';

async function onContextCreate(gl: ExpoWebGLRenderingContext)
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
    const camera = new THREE.PerspectiveCamera(60, width / height, 0.1, 100);
    camera.position.z = 5;

    scene.add(new THREE.AmbientLight(0xffffff, 0.6));
    const light = new THREE.DirectionalLight(0xffffff, 1);
    light.position.set(5, 5, 5);
    scene.add(light);

    const sphere = new THREE.Mesh(
        new THREE.SphereGeometry(0.5, 32, 32),
        new THREE.MeshStandardMaterial({color: 'black'}),
    );
    scene.add(sphere);

    function loop()
    {
        requestAnimationFrame(loop);
        sphere.rotation.y += 0.01;
        renderer.render(scene, camera);
        gl.endFrameEXP(); // obligatorio en expo-gl
    }
    loop();
}

export default function ThreeTestScreen()
{
    return <GLView style={{flex: 1}} onContextCreate={onContextCreate} />;
}