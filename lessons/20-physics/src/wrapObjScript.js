import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import GUI from 'lil-gui';
import * as CANNON from 'cannon-es';

/**
 * Debug
 */
const gui = new GUI();
const debugObject = {};

debugObject.creatSphere = () => {
    createSphere(Math.random(), {
        x: (Math.random() - 0.5) * 3,
        y: 3,
        z: (Math.random() - 0.5) * 3,
    });
};

debugObject.createBox = () => {
    createBox(Math.random(), Math.random(), Math.random(), {
        x: (Math.random() - 0.5) * 3,
        y: 3,
        z: (Math.random() - 0.5) * 3,
    });
};

debugObject.reset = () => {
    for (const object of objectToUpdate) {
        object.body.removeEventListener('cpllibe', playHitSound);
        world.remove(object.body);
        scene.remove(object.mesh);
    }
};

gui.add(debugObject, 'creatSphere');
gui.add(debugObject, 'createBox');
gui.add(debugObject, 'reset');

/**
 * Base
 */
// Canvas
const canvas = document.querySelector('canvas.webgl');

// Scene
const scene = new THREE.Scene();

/**
 * sounds
 */

const hitSound = new Audio('/sounds/hit.mp3');
const playHitSound = collision => {
    const impactStrength = collision.contact.getImpactVelocityAlongNormal();
    if (impactStrength <= 1.5) {
        return;
    }
    hitSound.volume = Math.random();
    hitSound.currentTime = 0;
    hitSound.play();
};

/**
 * Textures
 */
const textureLoader = new THREE.TextureLoader();
const cubeTextureLoader = new THREE.CubeTextureLoader();

const environmentMapTexture = cubeTextureLoader.load([
    '/textures/environmentMaps/0/px.png',
    '/textures/environmentMaps/0/nx.png',
    '/textures/environmentMaps/0/py.png',
    '/textures/environmentMaps/0/ny.png',
    '/textures/environmentMaps/0/pz.png',
    '/textures/environmentMaps/0/nz.png',
]);

/**
 * physics
 */

// world
const world = new CANNON.World();

/**
 * 
 * 
 * NaiveBroadphase Cannon 默认的算法。检测物体碰撞时，一个基础的方式是检测每个物体是否与其他每个物体发生了碰撞
    GridBroadphase 网格检测。轴对齐的均匀网格 Broadphase。将空间划分为网格，网格内进行检测。
     SAPBroadphase(Sweep-and-Prune) 扫描-剪枝算法，性能最好。
 */
world.broadphase = new CANNON.SAPBroadphase(world);
// 当物体的速度非常非常满的时候，肉眼已经无法察觉其在运动，那么就可以让这个物体 sleep，不参与碰撞检测，直到它被外力击中或其他物体碰撞到它。
world.allowSleep = true;

// 设置世界中的重力
world.gravity.set(0, -9.82, 0);

const defauleMaterial = new CANNON.Material('default');

const defauleContactMaterial = new CANNON.ContactMaterial(
    defauleMaterial,
    defauleMaterial,
    {
        friction: 0.1,
        restitution: 0.7,
    },
);
// 给世界内的所有body指定默认的材质，这样body就有了默认的材质
world.defaultContactMaterial = defauleContactMaterial;

world.addContactMaterial(defauleContactMaterial);

// floor

const floorShape = new CANNON.Plane();
const floorBody = new CANNON.Body();
floorBody.mass = 0;
floorBody.addShape(floorShape);
// floorBody.material = defauleMaterial;

/**
 * 绕轴旋转 (右手定则)：
 * - 轴方向：由向量决定 (此处为 X 轴)
 * - 正方向：拇指沿轴，四指弯曲方向
 * - 角度值：正数顺四指，负数逆四指
 */
floorBody.quaternion.setFromAxisAngle(new CANNON.Vec3(-1, 0, 0), Math.PI / 2);
world.addBody(floorBody);

/**
 * Floor
 */
const floor = new THREE.Mesh(
    new THREE.PlaneGeometry(10, 10),
    new THREE.MeshStandardMaterial({
        color: '#777777',
        metalness: 0.3,
        roughness: 0.4,
        envMap: environmentMapTexture,
        envMapIntensity: 0.5,
    }),
);
floor.receiveShadow = true;
floor.rotation.x = -Math.PI * 0.5;
scene.add(floor);

// axishelper
const axesHelper = new THREE.AxesHelper();
scene.add(axesHelper);

/**
 * Lights
 */
const ambientLight = new THREE.AmbientLight(0xffffff, 2.1);
scene.add(ambientLight);

const directionalLight = new THREE.DirectionalLight(0xffffff, 0.6);
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
camera.position.set(-3, 3, 3);
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
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

const objectToUpdate = [];

/**
 * Utils
 *
 */

const sphereGeometry = new THREE.SphereGeometry(1, 20, 20);
const sphereMaterial = new THREE.MeshStandardMaterial({
    metalness: 0.3,
    roughness: 0.4,
    envMap: environmentMapTexture,
});

const createSphere = (radius, position) => {
    const mesh = new THREE.Mesh(sphereGeometry, sphereMaterial);
    mesh.scale.set(radius, radius, radius);
    mesh.castShadow = true;
    mesh.position.copy(position);
    scene.add(mesh);

    const shape = new CANNON.Sphere(radius);
    const body = new CANNON.Body({
        mass: 1,
        position: new CANNON.Vec3(0, 3, 0),
        shape,
    });
    body.position.copy(position);
    body.addEventListener('collide', playHitSound);
    world.addBody(body);
    objectToUpdate.push({
        mesh,
        body,
    });
};

createSphere(0.5, { x: 0, y: 3, z: 0 });

const boxGeometry = new THREE.BoxGeometry(1, 1, 1, 4, 4, 4);
const boxMaterial = new THREE.MeshStandardMaterial({
    metalness: 0.3,
    roughness: 0.4,
    envMap: environmentMapTexture,
});

const createBox = (width, height, depth, position) => {
    const mesh = new THREE.Mesh(boxGeometry, boxMaterial);
    mesh.scale.set(width, height, depth);
    mesh.castShadow = true;
    mesh.position.copy(position);
    scene.add(mesh);

    const shape = new CANNON.Box(
        new CANNON.Vec3(width / 2, height / 2, depth / 2),
    );
    const body = new CANNON.Body({
        mass: 1,
        position: new CANNON.Vec3(0, 3, 0),
        shape,
    });
    body.position.copy(position);
    body.addEventListener('collide', playHitSound);
    world.addBody(body);
    objectToUpdate.push({
        mesh,
        body,
    });
};

createSphere(0.5, { x: 0, y: 3, z: 0 });

/**
 * Animate
 */
const clock = new THREE.Clock();

let oldElapseTime = 0;

const tick = () => {
    const elapsedTime = clock.getElapsedTime();
    const deltaTime = elapsedTime - oldElapseTime;
    oldElapseTime = elapsedTime;
    /**
     * 在世界坐标系中施加力：
     * - 第一个参数：力的向量，(-0.5, 0, 0) 表示向 X 轴负方向施加 0.5 的力
     * - 第二个参数：力的作用点（世界坐标），此处为物体质心位置
     *
     * 与 applyLocalForce 的区别：applyForce 的力向量和作用点都是世界坐标系
     */
    // Update physics world
    world.step(1 / 60, deltaTime, 3);

    for (const item of objectToUpdate) {
        item.mesh.position.copy(item.body.position);
        item.mesh.quaternion.copy(item.body.quaternion);
    }

    // Update controls
    controls.update();

    // Render
    renderer.render(scene, camera);

    // Call tick again on the next frame
    window.requestAnimationFrame(tick);
};

tick();
