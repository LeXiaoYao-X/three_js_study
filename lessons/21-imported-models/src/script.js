import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import GUI from 'lil-gui';

import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader.js';

/**
 * Base
 */
// Debug
const gui = new GUI();

// Canvas
const canvas = document.querySelector('canvas.webgl');

// Scene
const scene = new THREE.Scene();

/**
 * Moeals
 */

const dracoLoader = new DRACOLoader();
dracoLoader.setDecoderPath('/draco/');

const gltfLoader = new GLTFLoader();

gltfLoader.setDRACOLoader(dracoLoader);

let mixer = null;

gltfLoader.load(
    '/models/Fox/glTF/Fox.gltf',
    gltf => {
        // 动画混合器 ，类似于音乐播放器，可以播放动画，参数：动画要运用到的场景
        mixer = new THREE.AnimationMixer(gltf.scene);
        // 将动画放到到动画播放器
        const action = mixer.clipAction(gltf.animations[2]);
        // 播放动画，但是需要注意，必须在tick中更新渲染帧才可以
        action.play();
        gltf.scene.scale.set(0.025, 0.025, 0.025);
        scene.add(gltf.scene);
    },
    () => {
        console.log('Progress');
    },
    error => {
        console.log(error);

        console.log('Error');
    },
);

// draco压缩后的模型格式 gltf-draco 类似于gzip 可以减少网络开销，但需要本地通过draco去解压后使用

// const dracoLoader = new DRACOLoader();
// dracoLoader.setDecoderPath("/draco/")

// const gltfLoader = new GLTFLoader();

// gltfLoader.setDRACOLoader(dracoLoader)

// gltfLoader.load(
//     '/models/Duck/glTF-Draco/Duck.gltf',
//     gltf => {
//         // const chilfren = [...gltf.scene.children];
//         // scene.add(...chilfren);
//         console.log(gltf);

//         scene.add(gltf.scene);
//     },
//     () => {
//         console.log('Progress');
//     },
//     (error) => {
//         console.log(error);

//         console.log('Error');
//     },
// );

// 普通的模型格式 gltf
// const gltfLoader = new GLTFLoader();
// gltfLoader.load(
//     '/models/FlightHelmet/glTF/FlightHelmet.gltf',
//     gltf => {
//         // const chilfren = [...gltf.scene.children];
//         // scene.add(...chilfren);

//         scene.add(gltf.scene);
//     },
//     () => {
//         console.log('Progress');
//     },
//     () => {
//         console.log('Error');
//     },
// );

/**
 * Floor
 */
const floor = new THREE.Mesh(
    new THREE.PlaneGeometry(10, 10),
    new THREE.MeshStandardMaterial({
        color: '#444444',
        metalness: 0,
        roughness: 0.5,
    }),
);
floor.receiveShadow = true;
floor.rotation.x = -Math.PI * 0.5;
scene.add(floor);

/**
 * Lights
 */
const ambientLight = new THREE.AmbientLight(0xffffff, 2.4);
scene.add(ambientLight);

const directionalLight = new THREE.DirectionalLight(0xffffff, 1.8);
directionalLight.castShadow = true;
directionalLight.shadow.mapSize.set(1024, 1024);
directionalLight.shadow.camera.far = 15;
directionalLight.shadow.camera.left = -7;
directionalLight.shadow.camera.top = 7;
directionalLight.shadow.camera.right = 7;
directionalLight.shadow.camera.bottom = -7;
directionalLight.position.set(5, 5, 5);
scene.add(directionalLight);

/**
 * Sizes
 */
const sizes = {
    width: window.innerWidth,
    height: window.innerHeight,
};

window.addEventListener('resize', () => {
    // Update sizes
    sizes.width = window.innerWidth;
    sizes.height = window.innerHeight;

    // Update camera
    camera.aspect = sizes.width / sizes.height;
    camera.updateProjectionMatrix();

    // Update renderer
    renderer.setSize(sizes.width, sizes.height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
});

/**
 * Camera
 */
// Base camera
const camera = new THREE.PerspectiveCamera(
    75,
    sizes.width / sizes.height,
    0.1,
    100,
);
camera.position.set(2, 2, 2);
scene.add(camera);

// Controls
const controls = new OrbitControls(camera, canvas);
controls.target.set(0, 0.75, 0);
controls.enableDamping = true;

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
    canvas: canvas,
});
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

/**
 * Animate
 */
const clock = new THREE.Clock();
let previousTime = 0;

const tick = () => {
    const elapsedTime = clock.getElapsedTime();
    const deltaTime = elapsedTime - previousTime;
    previousTime = elapsedTime;

    // Update mixer 每次调用 mixer.update(deltaTime)，mixer 会将所有绑定的动画向前推进 deltaTime秒
    mixer && mixer.update(deltaTime);

    // Update controls
    controls.update();

    // Render
    renderer.render(scene, camera);

    // Call tick again on the next frame
    window.requestAnimationFrame(tick);
};

tick();
