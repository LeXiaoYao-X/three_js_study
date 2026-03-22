import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import GUI from 'lil-gui';
import { GLTFLoader } from 'three/examples/jsm/Addons.js';

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
 * Objects
 */
const object1 = new THREE.Mesh(
    new THREE.SphereGeometry(0.5, 16, 16),
    new THREE.MeshBasicMaterial({ color: '#ff0000' }),
);
object1.position.x = -2;

const object2 = new THREE.Mesh(
    new THREE.SphereGeometry(0.5, 16, 16),
    new THREE.MeshBasicMaterial({ color: '#ff0000' }),
);

const object3 = new THREE.Mesh(
    new THREE.SphereGeometry(0.5, 16, 16),
    new THREE.MeshBasicMaterial({ color: '#ff0000' }),
);
object3.position.x = 2;

scene.add(object1, object2, object3);

/**
 * 光线投射器
 *
 */
// scene.updateMatrixWorld(true);
const raycaster = new THREE.Raycaster();
// 光线的起点（位置在 -3, 0, 0）
// const rayOrigin = new THREE.Vector3(-3, 0, 0);
// // 光线的方向向量，从原点(0,0,0)指向(10,0,0)，即沿X轴正方向
// const rayDirection = new THREE.Vector3(10, 0, 0);
// // 归一化 ：即将rayDirection向量的长度设为一
// rayDirection.normalize();
// raycaster.set(rayOrigin, rayDirection);

// const intersect = raycaster.intersectObject(object2);
// console.log(intersect);

// const intersects = raycaster.intersectObjects([object1, object2, object3]);

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

const axesHelper = new THREE.AxesHelper(1);
scene.add(axesHelper);

/***
 * mouse
 */
const mouse = new THREE.Vector2();
addEventListener('mousemove', e => {
    mouse.x = (e.clientX / sizes.width - 0.5) * 2;
    mouse.y = -(e.clientY / sizes.height - 0.5) * 2;
    console.log(mouse.y);
});

addEventListener('click', () => {
    // console.log('click anywhere');
    if (currentIntersect) {
        switch (currentIntersect.object) {
            case object1:
                console.log('click on object 1');
                break;
            case object2:
                console.log('click on object 2');
                break;
            case object3:
                console.log('click on object 3');
                break;
        }
        // console.log('click on a sphare');
    }
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
camera.position.z = 3;
scene.add(camera);

// Controls
const controls = new OrbitControls(camera, canvas);
controls.enableDamping = true;

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
    canvas: canvas,
});
renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

/**
 * Model
 */
let model = null;
const gltfLoader = new GLTFLoader();
gltfLoader.load('/models/Duck/glTF-Binary/Duck.glb', gltf => {
    model = gltf.scene;
    model.position.y = -1.2;
    scene.add(gltf.scene);
});

/**
 * Lights
 */

const ambientLight = new THREE.AmbientLight('#ffffff', 0.3);
scene.add(ambientLight);

const directionalLight = new THREE.DirectionalLight('#ffffff', 0.7);
directionalLight.position.set(1, 2, 3);
scene.add(directionalLight);

/**
 * Animate
 */
const clock = new THREE.Clock();

let currentIntersect = null;

const tick = () => {
    const elapsedTime = clock.getElapsedTime();

    // Animate objects
    object1.position.y = Math.sin(elapsedTime * 0.3) * 1.5;
    object2.position.y = Math.sin(elapsedTime * 0.8) * 1.5;
    object3.position.y = Math.sin(elapsedTime * 1.5) * 1.5;

    // Cast a ray
    // const rayOrigin = new THREE.Vector3(-3, 0, 0);
    // const rayDirection = new THREE.Vector3(1, 0, 0);
    // rayDirection.normalize();
    // raycaster.set(rayOrigin, rayDirection);

    // const rayObjects = [object1, object2, object3];
    // const inrersects = raycaster.intersectObjects(rayObjects);
    // for (const obj of rayObjects) {
    //     obj.material.color.set('#ff0000');
    // }
    // for (const obj of inrersects) {
    //     obj.object.material.color.set('#0000ff');
    // }

    // Cast a ray

    // raycaster.setFromCamera理是：
    // 1. mouse：归一化的屏幕坐标（x, y 范围 -1 到 1）
    // 2. 将 mouse 映射到相机的近平面上的一个点
    // 3. 透视相机：射线从相机位置出发，穿过该点
    // 4. 正交相机：射线从近平面上该点出发，垂直于视平面

    // 这里的mouse需要注意，必须是归一化的坐标才可以（x, y 范围 -1 到 1）
    raycaster.setFromCamera(mouse, camera);

    const rayObjects = [object1, object2, object3];
    const inrersects = raycaster.intersectObjects(rayObjects);
    for (const obj of rayObjects) {
        obj.material.color.set('#ff0000');
    }
    for (const obj of inrersects) {
        obj.object.material.color.set('#0000ff');
    }

    if (inrersects.length) {
        if (currentIntersect === null) {
            console.log('mouseenter');
        }
        currentIntersect = inrersects[0];
    } else {
        if (currentIntersect) {
            console.log('mouseleave');
        }
        currentIntersect = null;
    }

    if (model) {
        const modelIntersects = raycaster.intersectObject(model);
        if (modelIntersects.length) {
            model.scale.set(1.2, 1.2, 1.2);
        }else{
             model.scale.set(1, 1, 1);
        }
    }

    // Update controls
    controls.update();

    // Render
    renderer.render(scene, camera);

    // Call tick again on the next frame
    window.requestAnimationFrame(tick);
};

tick();
