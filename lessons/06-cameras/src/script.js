import * as THREE from 'three'

import { OrbitControls } from 'three/examples/jsm/Addons.js'

// console.log(THREE.OrbitControls);

// cursor
const cursor = {
    x: 0,
    y: 0
}
addEventListener("mousemove", (event) => {
    cursor.x = event.clientX / sizes.width - 0.5
    cursor.y = -(event.clientY / sizes.height - 0.5)
    // console.log(cursor);

})

/**
 * Base
 */
// Canvas
const canvas = document.querySelector('canvas.webgl')

// Sizes
const sizes = {
    width: 800,
    height: 600
}

// Scene
const scene = new THREE.Scene()

// Object
const mesh = new THREE.Mesh(
    new THREE.BoxGeometry(1, 1, 1, 5, 5, 5),
    new THREE.MeshBasicMaterial({ color: 0xff0000 })
)
scene.add(mesh)

// Camera

//透视相机  第一个参数代表视野角度 第二个参数代表宽高比 第三个参数代表近截面距离 第四个参数代表远截面距离 即物体再近截面距离和远截面距离之间才会被渲染出来
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 100)

//正交相机  前四个参数分别代表左、右、上、下截面距离 第五个参数代表近截面距离 第六个参数代表远截面距离
//他的视野是一个长方体，物体在这个长方体内才会被渲染出来，所以正交相机的视野是固定的，不会随着物体的远近而改变

// const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0.1, 100)
// camera.position.x = 2
// camera.position.y = 2
camera.position.z = 2
camera.lookAt(mesh.position)
scene.add(camera)

// Controls
const controls = new OrbitControls(camera, canvas)
controls.enableDamping = true
// Renderer
const renderer = new THREE.WebGLRenderer({
    canvas: canvas
})
renderer.setSize(sizes.width, sizes.height)

// Animate
const clock = new THREE.Clock()

const tick = () => {
    const elapsedTime = clock.getElapsedTime()

    // Update objects
    // mesh.rotation.y = elapsedTime;
    //update camera
    // camera.position.x = Math.sin(cursor.x * Math.PI * 2) * 3
    // camera.position.z = Math.cos(cursor.x * Math.PI * 2) * 3
    // camera.position.y = cursor.y * 5
    // camera.lookAt(mesh.position)

    //update controls
    controls.update()
    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()