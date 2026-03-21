import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'


/**
 * 纹理
 * 
 */
// const image = new Image()
// const texture = new THREE.Texture(image)
// image.onload = () => {
//     texture.needsUpdate = true
//     texture.colorSpace = THREE.SRGBColorSpace
//     // console.log("image loaded");
// }

// image.src = "/textures/door/color.jpg"


const loadingManager = new THREE.LoadingManager()

loadingManager.onStart = () => {
    console.log("onStart");
}

loadingManager.onLoad = () => {
    console.log("onLoad");
}

loadingManager.onProgress = () => {
    console.log("onProgress");
}

loadingManager.onError = () => {
    console.log("onError");
}
const textureLoader = new THREE.TextureLoader(loadingManager)
const colorTexture = textureLoader.load("/textures/checkerboard-8x8.png",
    () => {
        console.log("loaded");
    }, () => {

        //这里progress 基本不会触发
        console.log("progress");
    }, () => {
        console.log("error");

    })

const alphaTexture = textureLoader.load("/textures/door/alpha.jpg")

const heightTexture = textureLoader.load("/textures/door/height.jpg")

const normalTexture = textureLoader.load("/textures/door/normal.jpg")
const ambientOcclusionTexture = textureLoader.load("/textures/door/ambientOcclusion.jpg")

const metalnessTexture = textureLoader.load("/textures/door/metalness.jpg")
const roughnessTexture = textureLoader.load("/textures/door/roughness.jpg")
colorTexture.colorSpace = THREE.SRGBColorSpace
/**
 * 在 Three.js 中，texture.repeat 控制纹理在物体表面的重复次数：
- setX(2)：纹理在水平方向（U轴）重复 2 次
- setY(2)：纹理在垂直方向（V轴）重复 2 次
 * 纹理坐标（UV）范围是 0-1，当设置 repeat.setX(2) 时，纹理坐标被放大到 0-2 的范围。
此时需要告诉 Three.js：超出 0-1 的部分如何处理？
| 环绕模式 | 效果 |
|---------|------|
| ClampToEdgeWrapping (默认) | 拉伸边缘像素，不重复 |
| RepeatWrapping | 纹理重复显示 |
| MirroredRepeatWrapping | 镜像重复 |
 * 如果不设置 wrapS/T，即使 repeat 设为 2，也只是把纹理拉伸铺满，而不是平铺重复。
 */
// colorTexture.repeat.setX(2)
// colorTexture.repeat.setY(3)

// colorTexture.wrapS = THREE.MirroredRepeatWrapping
// colorTexture.wrapT = THREE.MirroredRepeatWrapping

// colorTexture.offset.setX(.5)
// colorTexture.offset.setY(.5)
//默认 旋转中心为左下角 也就是uv(0,0)
// colorTexture.rotation = Math.PI / 4

// colorTexture.center.setX(.5)
// colorTexture.center.setY(.5) 
//当 minFilter设置为THREE.NearestFilter时，不需要mipmaps 所以将colorTexture.generateMipmaps设置为false
colorTexture.generateMipmaps = false
//纹理被缩小显示时（远处物体）
colorTexture.minFilter = THREE.NearestFilter
// 纹理被放大显示时（近处物体）
colorTexture.magFilter = THREE.NearestFilter
/**
 * Base
 */
// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()

/**
 * Object
 */
const geometry = new THREE.BoxGeometry(1, 1, 1)
// const geometry = new THREE.SphereGeometry(1, 32, 32)
const material = new THREE.MeshBasicMaterial({ map: colorTexture })
const mesh = new THREE.Mesh(geometry, material)
scene.add(mesh)

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
camera.position.z = 1
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