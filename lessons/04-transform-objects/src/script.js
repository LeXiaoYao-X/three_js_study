import * as THREE from 'three'

// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()

/**
 * Objects
 */

const group = new THREE.Group()
scene.add(group)


const geometry = new THREE.BoxGeometry(1, 1, 1)
const material = new THREE.MeshBasicMaterial({ color: 0xff0000 })
const mesh = new THREE.Mesh(geometry, material)
// scene.add(mesh)
group.add(mesh)
// Position
mesh.position.set(0.7, -0.6, 1)

// Scale
mesh.scale.set(2, 0.5, 0.5)

//Rotation
//这里需要注意 旋转过程中轴也会跟着旋转，即先旋转y轴于先旋转x轴的结果是不一样的 默认旋转顺序是xyz 可以使用 mesh.rotation.reorder('YXZ') 来改变旋转顺序

mesh.rotation.reorder('YXZ')
mesh.rotation.y = Math.PI / 4
mesh.rotation.x = Math.PI / 4


const axesHelper = new THREE.AxesHelper()
scene.add(axesHelper)
/**
 * Sizes
 */
const sizes = {
    width: 800,
    height: 600
}

/**
 * Camera
 */
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height)
camera.position.z = 3
// camera.position.y = 1
// camera.position.x = 1
scene.add(camera)

camera.lookAt(mesh.position)

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
    canvas: canvas
})
renderer.setSize(sizes.width, sizes.height)
renderer.render(scene, camera)


