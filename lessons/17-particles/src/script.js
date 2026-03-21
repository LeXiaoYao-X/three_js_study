import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import GUI from 'lil-gui'

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
 * Textures
 */
const textureLoader = new THREE.TextureLoader()
const particleTexture = textureLoader.load("/textures/particles/2.png")

/**
 * Particles
 */

// Geometry
// const particlesGeometry = new THREE.SphereGeometry(1, 32, 32)
// console.log(particlesGeometry.attributes);

const particlesGeometry = new THREE.BufferGeometry()
const count = 5000
const position = new Float32Array(count * 3)
const colors = new Float32Array(count * 3)

for (let i = 0; i < position.length; i++) {
    // console.log(i);

    position[i] = (Math.random() - .5) * 10
    colors[i] = Math.random()
}
particlesGeometry.setAttribute("position", new THREE.BufferAttribute(position, 3))
particlesGeometry.setAttribute("color", new THREE.BufferAttribute(colors, 3))

const particlesMaterial = new THREE.PointsMaterial({
    size: .1,
    sizeAttenuation: true,//远离摄像机例子变小 ，靠近则会变大
    alphaMap: particleTexture,
    transparent: true,
    // alphaTest: .01, // 透明度测试：小于0.01的alpha值不渲染，解决深度排序闪烁问题
    //depthTest: false, // 深度测试：关闭后粒子不会被其他物体遮挡
    depthWrite: false, // 深度写入：不写入深度缓冲，当加入立方体时，如果为true 即使是在立方体空间内的元素也会渲染，设置为false则不会渲染了
    blending: THREE.AdditiveBlending // 混合模式：粒子颜色叠加变亮，产生发光效果
})
// particlesMaterial.color = new THREE.Color("#ff88cc")
particlesMaterial.vertexColors = true


// Points
const particles = new THREE.Points(particlesGeometry, particlesMaterial)



scene.add(particles)


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
camera.position.z = 3
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
    // Update particles

    for (let i = 0; i < count; i++) {
        const i3 = i * 3
        const x = particlesGeometry.attributes.position.array[i3]
        particlesGeometry.attributes.position.array[i3 + 1] = Math.sin(elapsedTime + x)
        // consgn(elapsedTime+ x) 
        // const element = array[i];
    }
    particlesGeometry.attributes.position.needsUpdate = true
    // Update controls
    controls.update()

    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()
