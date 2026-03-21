import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import GUI from 'lil-gui'
import { RectAreaLightHelper } from 'three/examples/jsm/Addons.js'


/**
 * Base
 */
// Debug
const gui = new GUI()

// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()

/**
 * Lights
 */

//环境光
const anbientLight = new THREE.AmbientLight(0xffffff, .5)
// scene.add(anbientLight)

//平行光
const directionalLight = new THREE.DirectionalLight(0x00fffc, .3)
directionalLight.position.set(1, .25, 0)
// scene.add(directionalLight)


//半球光 第一个颜色默认是从上往下照，第二个颜色是从下往上照
const hemisphereLight = new THREE.HemisphereLight(0xff0000, 0x0000ff, .3)
// scene.add(hemisphereLight)

//点光源 .5为光照强度，10为关照的距离范围，2表示衰减的距离
const pointLight = new THREE.PointLight(0xff9000, .5, 10, 2)
pointLight.position.set(1, - 0.5, 1)
// scene.add(pointLight)

// 矩形光源 颜色，强度，宽度，高度
const rectAreaLight = new THREE.RectAreaLight(0x4e00ff, 2, 1, 1)
// scene.add(rectAreaLight)
//像一个手电筒照射出去，打出的光是圆的，发散出去
// 参数作用：
// 聚光灯颜色（绿色）
// 光照强度（0.5倍亮度）
// 光照最大距离（10个单位后衰减为0）
// 聚光锥角度（约18度）
// 边缘柔和度（0-1，值越大边缘越柔和）
// 衰减系数（物理上为2，值为0时无衰减）
const spotLight = new THREE.SpotLight(0x78ff00, .5, 10, Math.PI * .1, .25, 1)
spotLight.position.set(0, 2, 3)
scene.add(spotLight)
spotLight.target.position.x = -.75

scene.add(spotLight.target)


//helper
const hemisLightHelper = new THREE.HemisphereLightHelper(hemisphereLight, .2)
scene.add(hemisLightHelper)

const directionLightHelper = new THREE.DirectionalLightHelper(directionalLight, .2)
scene.add(directionLightHelper)

const pointLightHelper = new THREE.PointLightHelper(pointLight, .2)
scene.add(pointLightHelper)

const reactAreaLightHelper = RectAreaLightHelper(rectAreaLight)
scene.add(reactAreaLightHelper)

/**
 * Objects
 */
// Material
const material = new THREE.MeshStandardMaterial()
material.roughness = 0.4

// Objects
const sphere = new THREE.Mesh(
    new THREE.SphereGeometry(0.5, 32, 32),
    material
)
sphere.position.x = - 1.5

const cube = new THREE.Mesh(
    new THREE.BoxGeometry(0.75, 0.75, 0.75),
    material
)

const torus = new THREE.Mesh(
    new THREE.TorusGeometry(0.3, 0.2, 32, 64),
    material
)
torus.position.x = 1.5

const plane = new THREE.Mesh(
    new THREE.PlaneGeometry(5, 5),
    material
)
plane.rotation.x = - Math.PI * 0.5
plane.position.y = - 0.65

scene.add(sphere, cube, torus, plane)

/**
 * Sizes
 */
const sizes = {
    width: window.innerWidth,
    height: window.innerHeight
}

window.addEventListener('resize', () => {
    // Update sizes
    sizes.width = window.innerWidth
    sizes.height = window.innerHeight

    // Update camera
    camera.aspect = sizes.width / sizes.height
    camera.updateProjectionMatrix()

    // Update renderer
    renderer.setSize(sizes.width, sizes.height)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
})

/**
 * Camera
 */
// Base camera
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 100)
camera.position.x = 1
camera.position.y = 1
camera.position.z = 2
scene.add(camera)

// Controls
const controls = new OrbitControls(camera, canvas)
controls.enableDamping = true

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
    canvas: canvas
})
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

/**
 * Animate
 */
const clock = new THREE.Clock()

const tick = () => {
    const elapsedTime = clock.getElapsedTime()

    // Update objects
    sphere.rotation.y = 0.1 * elapsedTime
    cube.rotation.y = 0.1 * elapsedTime
    torus.rotation.y = 0.1 * elapsedTime

    sphere.rotation.x = 0.15 * elapsedTime
    cube.rotation.x = 0.15 * elapsedTime
    torus.rotation.x = 0.15 * elapsedTime

    // Update controls
    controls.update()

    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()