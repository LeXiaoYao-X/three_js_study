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
let gemetory = null, material = null, points = null

const parameters = {
    count: 5000,
    size: .01,
    radius: 5,
    branches: 3,
    spin: 1,
    randomness: .2,
    randomnessPower: 3,
    insideColor: "#ff6030",
    outsideColor: "#1b3984"
    // materialSize: .01,
    // splitNum: 3,

}

const galaxyGenerator = () => {
    if (gemetory) {
        gemetory.dispose()
        material.dispose()
        scene.remove(points)
    }

    gemetory = new THREE.BufferGeometry()

    const position = new Float32Array(parameters.count * 3)
    const colors = new Float32Array(parameters.count * 3)
    const colorInside = new THREE.Color(parameters.insideColor)
    const colorOutside = new THREE.Color(parameters.outsideColor)

    for (let i = 0; i < position.length; i++) {
        const _i = 3 * i
        const radius = Math.random() * parameters.radius
        const branchAngle = (i % parameters.branches) *
            (Math.PI * 2 / parameters.branches)
        const spinAngle = radius * parameters.spin
        const randomX = Math.pow(Math.random(), parameters.randomnessPower) * (Math.random() < .5 ? 1 : -1)
        const randomY = Math.pow(Math.random(), parameters.randomnessPower) * (Math.random() < .5 ? 1 : -1)
        const randomZ = Math.pow(Math.random(), parameters.randomnessPower) * (Math.random() < .5 ? 1 : -1)

        // position[_i] = (Math.random() - .5) * parameters.radius
        // position[_i + 1] = (Math.random() - .5) * parameters.radius
        // position[_i + 2] = (Math.random() - .5) * parameters.radius
        position[_i] = Math.cos(branchAngle + spinAngle) * radius + randomX
        position[_i + 1] = randomY
        position[_i + 2] = Math.sin(branchAngle + spinAngle) * radius + randomZ

        const mixColor = colorInside.clone()
        mixColor.lerp(colorOutside, radius / parameters.radius)

        colors[_i] = mixColor.r
        colors[_i + 1] = mixColor.g
        colors[_i + 2] = mixColor.b

    }
    gemetory.setAttribute("position", new THREE.BufferAttribute(position, 3))
    gemetory.setAttribute("color", new THREE.BufferAttribute(colors, 3))
    material = new THREE.PointsMaterial({
        size: parameters.size,
        // color: "red",
        depthWrite: false,
        sizeAttenuation: true,
        blending: THREE.AdditiveBlending,
        vertexColors: true

    })
    const axesHelper = new THREE.AxesHelper(2)
    scene.add(axesHelper)


    points = new THREE.Points(gemetory, material)

    scene.add(points)
}

gui.add(parameters, "radius").min(1).max(20).step(.01).onFinishChange(galaxyGenerator)
gui.add(parameters, "count").min(10).max(100000).onFinishChange(galaxyGenerator)
gui.add(parameters, "size").min(.01).max(.1).onFinishChange(galaxyGenerator)
gui.add(parameters, "branches").min(2).max(20).step(1).onFinishChange(galaxyGenerator)
gui.add(parameters, "spin").min(-5).max(5).step(.001).onFinishChange(galaxyGenerator)
gui.add(parameters, "randomness").min(0).max(2).step(.001).onFinishChange(galaxyGenerator)
gui.add(parameters, "randomnessPower").min(1).max(10).step(.001).onFinishChange(galaxyGenerator)
gui.addColor(parameters, "insideColor").onFinishChange(galaxyGenerator)
gui.addColor(parameters, "outsideColor").onFinishChange(galaxyGenerator)

galaxyGenerator()


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
camera.position.x = 3
camera.position.y = 3
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

    // Update controls
    controls.update()

    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()