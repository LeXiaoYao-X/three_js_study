import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import GUI from 'lil-gui';
import * as CANNON from 'cannon-es';

/**
 * Debug
 */
const gui = new GUI();

/**
 * Base
 */
// Canvas
const canvas = document.querySelector('canvas.webgl');

// Scene
const scene = new THREE.Scene();

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
world.gravity.set(0, -9.82, 0);

// materials
// 定义材质，并将其运用到body上

// const concreteMaterial = new CANNON.Material("concrete")
// const plasticMaterial = new CANNON.Material("plastic")

// 定义当这两种材质发生碰撞时，他们的摩擦程度，弹跳系数分别是怎样的，来模拟真实的物理事件
/* 
const concretePlasticContactMaterial = new CANNON.ContactMaterial(
    concreteMaterial,
    plasticMaterial,
    {
        friction: .1, // 摩擦系数
        restitution: .7 // 弹跳程度
    }
) 
world.addContactMaterial(concretePlasticContactMaterial)


*/

// 如果我们所有的body都是用默认的一种材质，则可以简化代码，如下所示

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

// shape
const spuareShape = new CANNON.Sphere(0.5);
const spuareBody = new CANNON.Body({
    mass: 1, // body质量
    position: new CANNON.Vec3(0, 3, 0), //body位置
    shape: spuareShape, // body 形状
    // material: defauleMaterial,  world.defaultContactMaterial为其默认材质
});
/**
 * 在物体局部坐标系中施加力：
 * - 第一个参数：力的向量 (x, y, z)，表示力的大小和方向
 * - 第二个参数：力的作用点（局部坐标），(0, 0, 0) 表示物体质心
 */
spuareBody.applyLocalForce(
    new CANNON.Vec3(150, 0, 0),
    new CANNON.Vec3(0, 0, 0),
);

world.addBody(spuareBody);

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
 * Test sphere
 */
const sphere = new THREE.Mesh(
    new THREE.SphereGeometry(0.5, 32, 32),
    new THREE.MeshStandardMaterial({
        metalness: 0.3,
        roughness: 0.4,
        envMap: environmentMapTexture,
        envMapIntensity: 0.5,
    }),
);
sphere.castShadow = true;
sphere.position.y = 0.5;
scene.add(sphere);

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
    spuareBody.applyForce(new CANNON.Vec3(-0.5, 0, 0), spuareBody.position);
    // Update physics world
    world.step(1 / 60, deltaTime, 3);

    sphere.position.copy(spuareBody.position);

    // Update controls
    controls.update();

    // Render
    renderer.render(scene, camera);

    // Call tick again on the next frame
    window.requestAnimationFrame(tick);
};

tick();
