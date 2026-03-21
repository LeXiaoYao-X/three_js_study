import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'

import GUI from 'lil-gui'
import { Sky } from 'three/addons/objects/Sky.js';

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
 * Texutures
 */

const textureLoader = new THREE.TextureLoader()

//Floor
const floorAlphaTexture = textureLoader.load("./floor/alpha.jpg")

const floorColorTexture = textureLoader.load("./floor/coast_sand_rocks_02_1k/coast_sand_rocks_02_diff_1k.jpg")
const floorARMTexture = textureLoader.load("./floor/coast_sand_rocks_02_1k/coast_sand_rocks_02_arm_1k.jpg")
const floorNormalTexture = textureLoader.load("./floor/coast_sand_rocks_02_1k/coast_sand_rocks_02_nor_gl_1k.jpg")
const floorDisplacementTexture = textureLoader.load("./floor/coast_sand_rocks_02_1k/coast_sand_rocks_02_disp_1k.jpg")

floorColorTexture.colorSpace = THREE.SRGBColorSpace

floorColorTexture.repeat.set(8, 8)
floorARMTexture.repeat.set(8, 8)

floorNormalTexture.repeat.set(8, 8)

floorDisplacementTexture.repeat.set(8, 8)

floorColorTexture.wrapS = THREE.RepeatWrapping
floorColorTexture.wrapT = THREE.RepeatWrapping

floorARMTexture.wrapS = THREE.RepeatWrapping
floorARMTexture.wrapT = THREE.RepeatWrapping
floorNormalTexture.wrapS = THREE.RepeatWrapping
floorNormalTexture.wrapT = THREE.RepeatWrapping
floorDisplacementTexture.wrapS = THREE.RepeatWrapping
floorDisplacementTexture.wrapT = THREE.RepeatWrapping

//wall

const wallColorTexture = textureLoader.load("./wall/castle_brick_broken_06_1k/castle_brick_broken_06_diff_1k.jpg")
const wallARMTexture = textureLoader.load("./wall/castle_brick_broken_06_1k/castle_brick_broken_06_arm_1k.jpg")
const wallNormalTexture = textureLoader.load("./wall/castle_brick_broken_06_1k/castle_brick_broken_06_nor_gl_1k.jpg")

wallColorTexture.colorSpace = THREE.SRGBColorSpace


//Roof 房顶
const roofColorTexture = textureLoader.load("./roof/roof_slates_02_1k/roof_slates_02_diff_1k.jpg")
const roofARMTexture = textureLoader.load("./roof/roof_slates_02_1k/roof_slates_02_arm_1k.jpg")
const roofNormalTexture = textureLoader.load("./roof/roof_slates_02_1k/roof_slates_02_nor_gl_1k.jpg")

roofColorTexture.colorSpace = THREE.SRGBColorSpace

roofNormalTexture.repeat.set(3, 1)
roofColorTexture.repeat.set(3, 1)
roofARMTexture.repeat.set(3, 1)


roofNormalTexture.wrapS = THREE.RepeatWrapping
roofColorTexture.wrapS = THREE.RepeatWrapping
roofARMTexture.wrapS = THREE.RepeatWrapping




// bush

const bushColorTexture = textureLoader.load("./bush/leaves_forest_ground_1k/leaves_forest_ground_diff_1k.jpg")
const bushARMTexture = textureLoader.load("./bush/leaves_forest_ground_1k/leaves_forest_ground_arm_1k.jpg")
const bushNormalTexture = textureLoader.load("./bush/leaves_forest_ground_1k/leaves_forest_ground_nor_gl_1k.jpg")

bushColorTexture.colorSpace = THREE.SRGBColorSpace

bushColorTexture.repeat.set(2, 1)
bushNormalTexture.repeat.set(2, 1)
bushARMTexture.repeat.set(2, 1)


bushNormalTexture.wrapS = THREE.RepeatWrapping
bushColorTexture.wrapS = THREE.RepeatWrapping
bushARMTexture.wrapS = THREE.RepeatWrapping




// grave

const graveColorTexture = textureLoader.load("./grave/plastered_stone_wall_1k/plastered_stone_wall_diff_1k.jpg")
const graveARMTexture = textureLoader.load("./grave/plastered_stone_wall_1k/plastered_stone_wall_arm_1k.jpg")
const graveNormalTexture = textureLoader.load("./grave/plastered_stone_wall_1k/plastered_stone_wall_nor_gl_1k.jpg")

graveColorTexture.colorSpace = THREE.SRGBColorSpace

graveColorTexture.repeat.set(.3, .4)
graveNormalTexture.repeat.set(.3, .4)
graveARMTexture.repeat.set(.3, .4)

// Door
const doorColorTexture = textureLoader.load("./door/color.jpg")
const doorAlphaTexture = textureLoader.load("./door/alpha.jpg")

const doorAmbientOcclusionTexture = textureLoader.load("./door/ambientOcclusion.jpg")
const doorheightTexture = textureLoader.load("./door/height.jpg")
const doorNormalTexture = textureLoader.load("./door/normal.jpg")
const doorMetalnessTexture = textureLoader.load("./door/metalness.jpg")
const doorRoughnessTexture = textureLoader.load("./door/roughness.jpg")

doorColorTexture.colorSpace = THREE.SRGBColorSpace


/**
 * House
 */


// floor
const floorMesh = new THREE.Mesh(
    new THREE.PlaneGeometry(20, 20, 100, 100),
    new THREE.MeshStandardMaterial(
        {
            alphaMap: floorAlphaTexture,
            transparent: true,
            map: floorColorTexture,
            aoMap: floorARMTexture,
            roughnessMap: floorARMTexture,
            metalnessMap: floorARMTexture,
            normalMap: floorNormalTexture,
            displacementMap: floorDisplacementTexture,
            displacementScale: .3,
            displacementBias: -.2
        }
    )
)
floorMesh.rotation.x = -0.5 * Math.PI

scene.add(floorMesh)

gui.add(floorMesh.material, "displacementScale").min(0).max(1).step(.001).name("floorDisplacementScale")
gui.add(floorMesh.material, "displacementBias").min(-1).max(1).step(.001).name("floorDisplacementBias")


// house container
const house = new THREE.Group()
scene.add(house)
const wallMesh = new THREE.Mesh(
    new THREE.BoxGeometry(4, 2.5, 4),
    new THREE.MeshStandardMaterial({
        map: wallColorTexture,
        aoMap: wallARMTexture,
        roughnessMap: wallARMTexture,
        metalnessMap: wallARMTexture,
        normalMap: wallNormalTexture
    })

)
wallMesh.position.y = 1.25
house.add(wallMesh)

// Roof（房顶）

const roof = new THREE.Mesh(
    new THREE.ConeGeometry(3.5, 1.5, 4),
    new THREE.MeshStandardMaterial({
        map: roofColorTexture,
        aoMap: roofARMTexture,
        roughnessMap: roofARMTexture,
        metalnessMap: roofARMTexture,
        normalMap: roofNormalTexture

    })
)
console.log(wallMesh.geometry.height);

roof.position.y = roof.geometry.parameters.height / 2 + wallMesh.geometry.parameters.height
roof.rotation.y = Math.PI / 4
house.add(roof)

// Door
const door = new THREE.Mesh(new THREE.PlaneGeometry(2.2, 2.2, 100, 100), new THREE.MeshStandardMaterial({
    map: doorColorTexture,
    transparent: true,
    alphaMap: doorAlphaTexture,
    aoMap: doorAmbientOcclusionTexture,
    displacementMap: doorheightTexture,
    normalMap: doorNormalTexture,
    metalnessMap: doorMetalnessTexture,
    roughnessMap: doorRoughnessTexture,
    displacementBias: -.04,
    displacementScale: .15

}))
door.position.y = 1
door.position.z = 2 + 0.01
house.add(door)

// Bushes 灌木丛

const bushGeometry = new THREE.SphereGeometry(1, 16, 16
)
const bushMarerial = new THREE.MeshStandardMaterial({
    color: "#ccffcc",
    map: bushColorTexture,
    aoMap: bushARMTexture,
    roughnessMap: bushARMTexture,
    metalnessMap: bushARMTexture,
    normalMap: bushNormalTexture

})

const bush1 = new THREE.Mesh(bushGeometry, bushMarerial)
bush1.scale.set(.5, .5, .5)
// 等价于上面
// bush1.scale.setScalar(.5)
bush1.position.set(.8, .2, 2.2)

bush1.rotation.x = -.75

const bush2 = new THREE.Mesh(bushGeometry, bushMarerial)
bush2.scale.set(.25, .25, .25)
bush2.position.set(1.4, .1, 2.1)
bush2.rotation.x = -.75

const bush3 = new THREE.Mesh(bushGeometry, bushMarerial)
bush3.scale.set(.4, .4, .4)
bush3.position.set(-.8, .1, 2.2)
bush3.rotation.x = -.75

const bush4 = new THREE.Mesh(bushGeometry, bushMarerial)
bush4.scale.set(.15, .15, .15)
bush4.position.set(-1, .05, 2.6)
bush4.rotation.x = -.75

house.add(bush1, bush2, bush3, bush4)

// Graves(坟墓)
// https://threejs-journey.com/lessons/haunted-house
const graves = new THREE.Group()
scene.add(graves)
const graveGeometry = new THREE.BoxGeometry(.6, .8, .2)
const graveMaterial = new THREE.MeshStandardMaterial({
    map: graveColorTexture,
    aoMap: graveARMTexture,
    roughnessMap: graveARMTexture,
    metalnessMap: graveARMTexture,
    normalMap: graveNormalTexture

})

for (let index = 0; index < 20; index++) {

    const angle = Math.random() * 2 * Math.PI
    const radius = 3 + Math.random() * 4
    const x = Math.cos(angle) * radius
    const z = Math.sin(angle) * radius


    const grave = new THREE.Mesh(graveGeometry, graveMaterial)
    grave.position.x = x
    grave.position.y = Math.random() * .4
    grave.position.z = z

    grave.rotation.x = (Math.random() - 0.5) * .4
    grave.rotation.y = (Math.random() - 0.5) * .4
    grave.rotation.z = (Math.random() - 0.5) * .4

    graves.add(grave)

}




// Temporary sphere
// const sphere = new THREE.Mesh(
//     new THREE.SphereGeometry(1, 32, 32),
//     new THREE.MeshStandardMaterial({ roughness: 0.7 })
// )
// scene.add(sphere)

/**
 * Lights
 */
// Ambient light
const ambientLight = new THREE.AmbientLight('#86cdff', 0.275)
scene.add(ambientLight)

// Directional light
const directionalLight = new THREE.DirectionalLight('#86cdff', 1)
directionalLight.position.set(3, 2, -8)
scene.add(directionalLight)

// Door light 
const doorLight = new THREE.PointLight("#ff7d46", 5)
doorLight.position.set(0, 2.2, 2.5)

// const doorLightHelper = new THREE.PointLightHelper(doorLight)
// scene.add(doorLightHelper)
house.add(doorLight)


/**
 * Ghosts
 */

const ghost1 = new THREE.PointLight("#8800ff", 6)
const ghost2 = new THREE.PointLight("#ff0088", 6)
const ghost3 = new THREE.PointLight("#ff0000", 6)
scene.add(ghost1, ghost2, ghost3)
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
camera.position.x = 4
camera.position.y = 2
camera.position.z = 5
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
 * Shadows
 */

// renderer
renderer.shadowMap.enabled = true
renderer.shadowMap.type = THREE.PCFSoftShadowMap


// Cast and receive
directionalLight.castShadow = true;
[ghost1, ghost2, ghost3].forEach((item) => {
    item.castShadow = true
})
wallMesh.castShadow = true
wallMesh.castShadow = true
roof.castShadow = true
floorMesh.receiveShadow = true

for (const grave of graves.children) {
    grave.castShadow = true;
    grave.receiveShadow = true
}

// Mapping
directionalLight.shadow.mapSize.width = 256
directionalLight.shadow.mapSize.height = 256
directionalLight.shadow.camera.top = 8
directionalLight.shadow.camera.right = 8
directionalLight.shadow.camera.bottom = -8
directionalLight.shadow.camera.left = -8
directionalLight.shadow.camera.near = 1
directionalLight.shadow.camera.far = 20;


[ghost1, ghost2, ghost3].forEach((item) => {
    item.shadow.mapSize.width = 256
    item.shadow.mapSize.height = 256
    item.shadow.camera.far = 10
})

/**
 * sky
 */


const sky = new Sky()
sky.scale.setScalar(100);
sky.material.uniforms['turbidity'].value = 10
sky.material.uniforms['rayleigh'].value = 3
sky.material.uniforms['mieCoefficient'].value = 0.1
sky.material.uniforms['mieDirectionalG'].value = 0.95
sky.material.uniforms['sunPosition'].value.set(0.3, -0.038, -0.95)
scene.add(sky)

/**
 * Fag
 */

scene.fog = new THREE.FogExp2("#02343f", .1)
/**
 * Animate
 */

const clock = new THREE.Clock()

const tick = () => {
    // Timer
    const elapsedTime = clock.getElapsedTime()

    // Ghost
    const ghost1Angle = elapsedTime * .5
    ghost1.position.x = Math.cos(ghost1Angle) * 4
    ghost1.position.z = Math.sin(ghost1Angle) * 4
    ghost1.position.y = Math.sin(ghost1Angle) * Math.sin(ghost1Angle * 2.34) * Math.sin(ghost1Angle * 3.45)

    const ghost2Angle = -elapsedTime * .38
    ghost2.position.x = Math.cos(ghost2Angle) * 5
    ghost2.position.z = Math.sin(ghost2Angle) * 5
    ghost2.position.y = Math.sin(ghost2Angle) * Math.sin(ghost2Angle * 2.34) * Math.sin(ghost2Angle * 3.45)

    const ghost3Angle = elapsedTime * .23
    ghost3.position.x = Math.cos(ghost3Angle) * 6
    ghost3.position.z = Math.sin(ghost3Angle) * 6
    ghost3.position.y = Math.sin(ghost3Angle) * Math.sin(ghost3Angle * 2.34) * Math.sin(ghost3Angle * 3.45)

    // Update controls
    controls.update()

    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()