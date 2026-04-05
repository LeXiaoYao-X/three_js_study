import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import GUI from 'lil-gui';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { RGBELoader } from 'three/examples/jsm/loaders/RGBELoader.js';

/**
 * Loaders
 */
const gltfLoader = new GLTFLoader();
const rgbeLoader = new RGBELoader();
const textureLoader = new THREE.TextureLoader();

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
 * Update all materials
 */
const updateAllMaterials = () => {
    scene.traverse(child => {
        if (child.isMesh && child.material.isMeshStandardMaterial) {
            console.log(1);
            child.castShadow = true;
            child.receiveShadow = true;

            // Activate shadow here
        }
    });
};

/**
 * Environment map
 */
// Intensity
scene.environmentIntensity = 1;
gui.add(scene, 'environmentIntensity').min(0).max(10).step(0.001);

// HDR (RGBE) equirectangular
rgbeLoader.load('/environmentMaps/0/2k.hdr', environmentMap => {
    environmentMap.mapping = THREE.EquirectangularReflectionMapping;

    scene.background = environmentMap;
    scene.environment = environmentMap;
});

/**
 * directionlight
 */

const directionLight = new THREE.DirectionalLight('#ffffff', 1);
directionLight.position.set(-4, 6.5, 2.5);
scene.add(directionLight);

gui.add(directionLight, 'intensity')
    .min(0)
    .max(10)
    .step(0.001)
    .name('lightIntensity');

gui.add(directionLight.position, 'x')
    .min(-10)
    .max(10)
    .step(0.001)
    .name('lightX');

gui.add(directionLight.position, 'y')
    .min(-10)
    .max(10)
    .step(0.001)
    .name('lightY');

gui.add(directionLight.position, 'z')
    .min(-10)
    .max(10)
    .step(0.001)
    .name('lightZ');

directionLight.castShadow = true;
directionLight.shadow.camera.far = 15;
directionLight.shadow.mapSize.set(1024, 1024);

directionLight.shadow.normalBias = 0.027;
directionLight.shadow.bias = -0.004;

gui.add(directionLight, 'castShadow');

gui.add(directionLight.shadow, 'normalBias').min(-0.05).max(0.05).step(0.001);
gui.add(directionLight.shadow, 'bias').min(-0.05).max(0.05).step(0.001);

const directionalLightHelper = new THREE.CameraHelper(
    directionLight.shadow.camera,
);

scene.add(directionalLightHelper);

directionLight.target.position.set(0, 4, 0);
directionLight.target.updateWorldMatrix();
/**
 * Models
 */
// Helmet
// gltfLoader.load('/models/FlightHelmet/glTF/FlightHelmet.gltf', gltf => {
//     gltf.scene.scale.set(10, 10, 10);
//     scene.add(gltf.scene);

//     updateAllMaterials();
// });

// 汉堡
gltfLoader.load('/models/hamburger.glb', gltf => {
    gltf.scene.scale.set(0.4, 0.4, 0.4);
    gltf.scene.position.set(0, 2.5, 0);
    scene.add(gltf.scene);

    updateAllMaterials();
});

/**
 * Floor
 */

const floorColorTexture = textureLoader.load(
    '/textures/wood_cabinet_worn_long/wood_cabinet_worn_long_diff_1k.jpg',
);
const floorNormalTexture = textureLoader.load(
    '/textures/wood_cabinet_worn_long/wood_cabinet_worn_long_nor_gl_1k.jpg',
);

const floorAoRoughnessMatalnessTexture = textureLoader.load(
    '/textures/wood_cabinet_worn_long/wood_cabinet_worn_long_arm_1k.jpg',
);

floorColorTexture.colorSpace = THREE.SRGBColorSpace;

const floor = new THREE.Mesh(
    new THREE.PlaneGeometry(8, 8),
    new THREE.MeshStandardMaterial({
        map: floorColorTexture,
        normalMap: floorNormalTexture,
        aoMap: floorAoRoughnessMatalnessTexture,
        roughnessMap: floorAoRoughnessMatalnessTexture,
        metalnessMap: floorAoRoughnessMatalnessTexture,
    }),
);

floor.rotation.x = -Math.PI / 2;
scene.add(floor);

// wall

const castalBrickTexture = textureLoader.load(
    '/textures/castle_brick_broken_06/castle_brick_broken_06_diff_1k.jpg',
);

const castalBrickNormalTexture = textureLoader.load(
    '/textures/castle_brick_broken_06/castle_brick_broken_06_nor_gl_1k.png',
);

const wood_cabinet_worn_longTextrue = textureLoader.load(
    '/textures/castle_brick_broken_06/castle_brick_broken_06_arm_1k.jpg',
);

castalBrickTexture.colorSpace = THREE.SRGBColorSpace;

const wallMesh = new THREE.Mesh(
    new THREE.PlaneGeometry(8, 8),
    new THREE.MeshStandardMaterial({
        map: castalBrickTexture,
        normalMap: castalBrickNormalTexture,
        aoMap: wood_cabinet_worn_longTextrue,
        roughnessMap: wood_cabinet_worn_longTextrue,
        metalnessMap: wood_cabinet_worn_longTextrue,
    }),
);

// planeMesh.rotation.y = -Math.PI / 2;
wallMesh.position.setZ(-4);
wallMesh.position.setY(4);
scene.add(wallMesh);

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
camera.position.set(4, 5, 4);
scene.add(camera);

// Controls
const controls = new OrbitControls(camera, canvas);
controls.target.y = 3.5;
controls.enableDamping = true;

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
    canvas: canvas,
    antialias: true, //抗锯齿
});
renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

// Tone mapping

renderer.toneMapping = THREE.ReinhardToneMapping;
// 色调映射曝光
renderer.toneMappingExposure = 3;

gui.add(renderer, 'toneMapping', {
    No: THREE.NoToneMapping,
    Linear: THREE.LinearToneMapping,
    Reinhard: THREE.ReinhardToneMapping,
    Cineon: THREE.CineonToneMapping,
    ACESFilmic: THREE.ACESFilmicToneMapping,
});

gui.add(renderer, 'toneMappingExposure').min(0).max(10).step(0.001);

renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
/**
 * Animate
 */
const tick = () => {
    // Update controls
    controls.update();

    // Render
    renderer.render(scene, camera);

    // Call tick again on the next frame
    window.requestAnimationFrame(tick);
};

tick();
