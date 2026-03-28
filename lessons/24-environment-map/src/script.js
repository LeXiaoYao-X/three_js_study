import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import GUI from 'lil-gui';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { RGBELoader } from 'three/examples/jsm/loaders/RGBELoader.js';
import { EXRLoader } from 'three/examples/jsm/loaders/EXRLoader.js';

// GroundedSkybox：地面投影天空盒（替代旧版 GroundProjectedSkybox）
// 构造函数参数：new GroundedSkybox(map, height, radius, resolution)
// map: 环境贴图, height: 相机离地高度, radius: 天空盒半径, resolution: 几何分辨率(默认128)
import { GroundedSkybox } from 'three/addons/objects/GroundedSkybox.js';

console.log(GroundedSkybox);

/**
 * Loader
 */
// 模型加载器
const gltfLoader = new GLTFLoader();

// 立方体贴图加载器
const cubeTextureLoader = new THREE.CubeTextureLoader();
const hdrLoader = new RGBELoader();
const exrLoader = new EXRLoader();
const textureLoader = new THREE.TextureLoader();

/**
 * Base
 */
// Debug
const gui = new GUI();
const global = {};

// Canvas
const canvas = document.querySelector('canvas.webgl');

// Scene
const scene = new THREE.Scene();

/**
 * updateAllMaterials
 */

const updateAllMaterials = () => {
    // console.log('updateAllMaterial');

    // scene.traverse(child => {
    //     // console.log(child);
    //     if (child.isMesh && child.material.isMeshStandardMaterial) {
    //         child.material.envMapIntensity = 5;
    //     }
    // });
    scene.environmentIntensity = global.environmentIntensity;
};

/**
 *Environment map
 */

scene.backgroundBlurriness = 0;
scene.backgroundIntensity = 1;
gui.add(scene, 'backgroundBlurriness').min(0).max(1).step(0.001);
gui.add(scene, 'backgroundIntensity').min(0).max(10).step(0.001);

global.environmentIntensity = 1;
gui.add(global, 'environmentIntensity')
    .min(0)
    .max(20)
    .step(0.01)
    .name('Env Intensity')
    .onFinishChange(updateAllMaterials);

// LDR cube texture 低动态

// const environmentMap = cubeTextureLoader.load([
//     '/environmentMaps/0/px.png',
//     '/environmentMaps/0/nx.png',
//     '/environmentMaps/0/py.png',
//     '/environmentMaps/0/ny.png',
//     '/environmentMaps/0/pz.png',
//     '/environmentMaps/0/nz.png',
// ]);
// scene.environment = environmentMap;
// scene.background = environmentMap;

// HDR RGBE texture 高动态
// hdrLoader.load('/environmentMaps/0/2k.hdr', environmentMap => {
//     environmentMap.mapping = THREE.EquirectangularReflectionMapping;
//     scene.background = environmentMap;
//     scene.environment = environmentMap;
// });

// HDR(EXR) equirectangular 等距柱状投影 就是矩形摄像机
// exrLoader.load('/environmentMaps/nvidiaCanvas-4k.exr', environmentMap => {
//     environmentMap.mapping = THREE.EquirectangularReflectionMapping;
//     scene.background = environmentMap;
//     scene.environment = environmentMap;
// });

// LDR equirectangular
// const environmentMap = textureLoader.load(
//     '/environmentMaps/blockadesLabsSkybox/anime_art_style_japan_streets_with_cherry_blossom_.jpg',
// );

// environmentMap.mapping = THREE.EquirectangularReflectionMapping;

// environmentMap.colorSpace = THREE.SRGBColorSpace;
// scene.background = environmentMap;
// scene.environment = environmentMap;

// Ground projected skybox
// hdrLoader.load('/environmentMaps/2/2k.hdr', environmentMap => {
//     environmentMap.mapping = THREE.EquirectangularReflectionMapping;
//     // scene.background = environmentMap;
//     scene.environment = environmentMap;

//     //skybox
//     const skybox = new GroundedSkybox(environmentMap, 11, 120);

//     gui.add(skybox,"")

//     scene.add(skybox);
// });

/**
 * real time environment map（实时环境贴图）
 * 
 * 工作流程：
 * 1. holyDonut（甜甜圈）放入图层1
 * 2. cubeCamera 只拍摄图层1（甜甜圈）
 * 3. cubeRenderTarget 存储拍摄结果（立方体贴图）
 * 4. scene.environment = cubeRenderTarget.texture（环境贴图）
 * 5. 场景中的金属物体（torusKnot）会反射甜甜圈
 * 
 * 每帧执行：
 * - cubeCamera.update() 更新环境贴图
 * - 主相机渲染场景（使用更新后的环境贴图）
 */

const environmentMap = textureLoader.load(
    '/environmentMaps/blockadesLabsSkybox/interior_views_cozy_wood_cabin_with_cauldron_and_p.jpg',
);
environmentMap.mapping = THREE.EquirectangularReflectionMapping;
environmentMap.colorSpace = THREE.SRGBColorSpace;
scene.background = environmentMap;

// Holy donut（甜甜圈）
// 这个甜甜圈会被 cubeCamera 拍摄，用于生成动态环境贴图
const holyDonut = new THREE.Mesh(
    new THREE.TorusGeometry(8, 0.5),
    new THREE.MeshBasicMaterial({ color: new THREE.Color(10, 4, 2) }),
);
// 将甜甜圈放入图层1，只有 cubeCamera 会看到它
holyDonut.layers.enable(1)
holyDonut.position.y = 3.5;
scene.add(holyDonut);

// cube render target（立方体渲染目标）
// 作为 cubeCamera 的"画布/存储卡"，存储渲染结果
// 256 是立方体每个面的分辨率（256x256像素）
const cubeRenderTarget = new THREE.WebGLCubeRenderTarget(256, {
    type: THREE.HalfFloatType,
});

// 将 cubeRenderTarget 的纹理作为场景的环境贴图
// 场景中所有 MeshStandardMaterial 和 MeshPhysicalMaterial 材质会自动使用它进行反射
scene.environment = cubeRenderTarget.texture;

// Cube Camera（立方体相机）
// 参数：近平面(0.1), 远平面(100), 渲染目标
// 从原点向6个方向各拍摄一张照片，组成环境贴图
const cubeCamera = new THREE.CubeCamera(0.1, 100, cubeRenderTarget);

// 设置 cubeCamera 只看图层1的物体（即只拍摄甜甜圈）
cubeCamera.layers.set(1)

/**
 * Torus Knot
 */
const torusKnot = new THREE.Mesh(
    new THREE.TorusKnotGeometry(1, 0.4, 100, 16),
    new THREE.MeshStandardMaterial({
        roughness: 0.3,
        metalness: 1,
        color: 0xaaaaaa,
    }),
);



torusKnot.position.x = -4;
torusKnot.position.y = 4;
scene.add(torusKnot);

/**
 * Models
 */

gltfLoader.load('/models/FlightHelmet/glTF/FlightHelmet.gltf', gltf => {
    gltf.scene.scale.set(10, 10, 10);
    scene.add(gltf.scene);
    updateAllMaterials();
});

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
 * Camera（主相机 - 用户视角）
 * 这是最终渲染到屏幕的相机，与 cubeCamera 不同：
 * - cubeCamera：用于生成环境贴图（不显示在屏幕）
 * - 主相机：用于最终显示场景（渲染到屏幕）
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
});
renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
// renderer.outputColorSpace = THREE.SRGBColorSpace;
/**
 * Animate
 */
const clock = new THREE.Clock();
const tick = () => {
    // Time
    const elapsedTime = clock.getElapsedTime();

    // Real time env map（实时环境贴图）

    if (holyDonut) {
        // 旋转甜甜圈
        holyDonut.rotation.x = Math.sin(elapsedTime) * 2;
        // cubeCamera 更新环境贴图：
        // 1. 渲染图层1的物体（甜甜圈）到 cubeRenderTarget
        // 2. 6个方向各渲染一次，形成立方体贴图
        // 3. 更新后的贴图会自动应用到场景物体的反射上
        cubeCamera.update(renderer, scene);
    }

    // Update controls
    controls.update();

    // Render（最终渲染）
    // 使用主相机渲染场景到屏幕
    // 场景中的物体（如 torusKnot）会使用 scene.environment 进行反射
    // scene.environment 由 cubeCamera 每帧更新
    renderer.render(scene, camera);

    // Call tick again on the next frame
    window.requestAnimationFrame(tick);
};

tick();
