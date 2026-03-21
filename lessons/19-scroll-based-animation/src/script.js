import * as THREE from 'three'
import GUI from 'lil-gui'
import gsap from "gsap"

/**
 * Debug
 */
const gui = new GUI()

const parameters = {
    materialColor: '#ffeded'
}

gui
    .addColor(parameters, 'materialColor')
    .onChange(() => {
        meterial.color.set(parameters.materialColor)
        particlesMaterial.color.set(parameters.materialColor)
    })

/**
 * Base
 */
// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()

/**
 * Objects
 */

//Texture
const texturesLoader = new THREE.TextureLoader()
const gradientTexture = texturesLoader.load("textures/gradients/3.jpg")
gradientTexture.magFilter = THREE.NearestFilter



// https://threejs.org/docs/?q=TorusGeometry#TorusGeometry
// TorusGeometry为类似游泳圈的形状
const meterial = new THREE.MeshToonMaterial({ color: parameters.materialColor, gradientMap: gradientTexture })
const objectDistance = 4

const mesh1 = new THREE.Mesh(new THREE.TorusGeometry(1, .4, 16, 60), meterial)
// ConeGeometry类似为棱锥的形状
const mesh2 = new THREE.Mesh(new THREE.ConeGeometry(1, 2, 32), meterial)
const mesh3 = new THREE.Mesh(new THREE.TorusKnotGeometry(.8, .35, 100, 16), meterial)

// mesh1.position.y = -objectDistance * 0
// mesh2.position.y = -objectDistance * 1
// mesh3.position.y = -objectDistance * 2





const sectionMeshes = [mesh1, mesh2, mesh3]
sectionMeshes.forEach((mesh, idx) => {
    mesh.position.y = - objectDistance * idx
    mesh.position.x = (idx & 1) === 0 ? 2 : -2
})


scene.add(mesh1, mesh2, mesh3)

const particlesCount = 200
const position = new Float32Array(particlesCount * 3)
for (let i = 0; i < particlesCount; i++) {
    position[i * 3] = (Math.random() - .5) * 10
    position[i * 3 + 1] = objectDistance * .5 - Math.random() * objectDistance * sectionMeshes.length
    position[i * 3 + 2] = (Math.random() - .5) * 10
}

const particlesGeometry = new THREE.BufferGeometry()
particlesGeometry.setAttribute("position", new THREE.BufferAttribute(position, 3))

const particlesMaterial = new THREE.PointsMaterial({
    color: parameters.materialColor,
    // vertexColors: true,
    sizeAttenuation: true,
    size: .03
})

const points = new THREE.Points(particlesGeometry, particlesMaterial)

scene.add(points)
/**
 * Light
 * 
 */

const directionLight = new THREE.DirectionalLight("#fff", 1)
directionLight.position.set(1, 1, 0)
scene.add(directionLight)

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

const cameraGroup = new THREE.Group()
scene.add(cameraGroup)

// Base camera
const camera = new THREE.PerspectiveCamera(35, sizes.width / sizes.height, 0.1, 100)
camera.position.z = 6
cameraGroup.add(camera)

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
    canvas: canvas,
    alpha: true
})
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
/**
 * Scroll
 */
let currentSection = 0
let scrollY = window.scrollY
addEventListener("scroll", () => {
    scrollY = window.scrollY
    const newSection = Math.round(scrollY / sizes.height)
    if (newSection !== currentSection) {
        currentSection = newSection
        gsap.to(sectionMeshes[currentSection].rotation, {
            duration: 1.5,
            ease: "power2.inOut",
            x: "+=6",
            y: '+=3',
            z: '+=1.5'
        })
    }


})

const cursor = {
    x: 0,
    y: 0
}

addEventListener("mousemove", (event) => {
    cursor.x = event.clientX / sizes.width - .5
    cursor.y = event.clientY / sizes.height - .5
})

/**
 * Animate
 */
const clock = new THREE.Clock()
let previousTime = 0

const tick = () => {
    const elapsedTime = clock.getElapsedTime()
    const deltaTime = elapsedTime - previousTime
    previousTime = elapsedTime
    // console.log(deltaTime);


    // Animate camera
    camera.position.y = -scrollY / sizes.height * objectDistance
    const parallaxX = -cursor.x / 2
    const parakkaxY = cursor.y / 2

    cameraGroup.position.x += (parallaxX - cameraGroup.position.x) * 5 * deltaTime
    cameraGroup.position.y += (parakkaxY - cameraGroup.position.y) * 5 * deltaTime
    // Animate meshes
    sectionMeshes.forEach((mesh) => {
        mesh.rotation.x += deltaTime * .1
        mesh.rotation.y += deltaTime * .12
    })
    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()