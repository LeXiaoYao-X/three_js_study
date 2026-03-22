import * as THREE from 'three'  // 导入 Three.js 核心库
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'  // 导入轨道控制器，用于鼠标交互控制相机

import GUI from 'lil-gui'
import { HDRLoader, MarchingCubes } from 'three/examples/jsm/Addons.js'
/**
 * Debug
 * 
 */
const gui = new GUI()


/**
 * Base
 */
// Canvas  // 画布相关注释标记
const canvas = document.querySelector('canvas.webgl')  // 获取 HTML 中 class 为 webgl 的 canvas 元素

// Scene  // 场景相关注释标记
const scene = new THREE.Scene()  // 创建 Three.js 场景，用于存放所有 3D 对象

//Texures  // 纹理相关注释标记
const texturesLoader = new THREE.TextureLoader()  // 创建纹理加载器实例，用于加载图片纹理
const doorColorTexture = texturesLoader.load("./textures/door/color.jpg")  // 加载门的颜色纹理（基础颜色贴图）
const doorAlphaTexture = texturesLoader.load("./textures/door/alpha.jpg")  // 加载门的透明度纹理（控制透明区域）
const doorAmbientOcclusionTexture = texturesLoader.load("./textures/door/ambientOcclusion.jpg")  // 加载门的环境光遮蔽纹理（模拟阴影细节）
const doorHeightTexture = texturesLoader.load("./textures/door/height.jpg")  // 加载门的高度/位移纹理（创建凹凸效果）
const doorNormalTexture = texturesLoader.load("./textures/door/normal.jpg")  // 加载门的法线纹理（模拟表面细节光照）
const doorMetalnessTexture = texturesLoader.load("./textures/door/metalness.jpg")  // 加载门的金属度纹理（控制金属反光程度）
const doorRoughnessTexture = texturesLoader.load("./textures/door/roughness.jpg")  // 加载门的粗糙度纹理（控制表面光滑程度）

const matcapTexture = texturesLoader.load("./textures/matcaps/1.png")  // 加载 MatCap 纹理（材质捕捉，用于模拟光照效果）

const gradientTexture = texturesLoader.load("./textures/gradients/3.jpg")  // 加载渐变纹理（注意：路径 texture 可能是 textures 的拼写错误）

doorColorTexture.colorSpace = THREE.SRGBColorSpace  // 设置门颜色纹理的色彩空间为 SRGB，确保颜色正确显示
matcapTexture.colorSpace = THREE.SRGBColorSpace  // 设置 MatCap 纹理的色彩空间为 SRGB

//MeshBasicMaterial  // MeshBasicMaterial 材质相关注释标记
// const material = new THREE.MeshBasicMaterial()  // 创建基础材质实例，不受光照影响，均匀着色
// material.map = matcapTexture  // 注释掉的代码：将 MatCap 纹理应用到材质（作为颜色贴图）
// material.color = new THREE.Color(0xff0000)  // 注释掉的代码：设置材质颜色为红色
// material.wireframe = true  // 注释掉的代码：开启线框模式，显示网格结构
// material.transparent = true  // 注释掉的代码：开启透明效果
// material.opacity = .5  // 注释掉的代码：设置透明度为 50%
// material.alphaMap = doorAlphaTexture  // 注释掉的代码：应用透明度贴图控制透明区域
// material.side = THREE.DoubleSide  // 设置材质为双面渲染，物体两面都可见


// MeshNormalMaterial   法线材质  
// 法线（Normal） 是垂直于物体表面的向量（一个方向箭头），用于：
// 1. 确定表面朝向 - 指向物体外部的方向
// 2. 计算光照 - 光线与法线的夹角决定表面明暗
// 3. 反射和折射 - 决定光线如何反弹或穿透
// - X 轴 → 红色 (R)
// - Y 轴 → 绿色 (G)  
// - Z 轴 → 蓝色 (B)
// const material = new THREE.MeshNormalMaterial()
// material.flatShading = true

// MeshMatcapMaterial
// const material = new THREE.MeshMatcapMaterial()
// material.matcap = matcapTexture

// MeshDepthMaterial
//当物体离摄像机越近，物体越亮
// const material= new THREE.MeshDepthMaterial()

// MeshLambertMaterial 有关照时候性能最好
// const material = new THREE.MeshLambertMaterial()


// // MeshPhongMaterial
// const material = new THREE.MeshPhongMaterial()
// material.shininess = 1000
// material.specular = new THREE.Color(0x1188ff)

// MeshToonMaterial
// const material = new THREE.MeshToonMaterial()
// gradientTexture.minFilter = THREE.NearestFilter
// gradientTexture.magFilter = THREE.NearestFilter
// gradientTexture.generateMipmaps = false
// material.gradientMap = gradientTexture


// MeshStandardMaterial
// const material = new THREE.MeshStandardMaterial()
// material.metalness = 1
// material.roughness = 1
// material.map = doorColorTexture

// material.aoMap = doorAmbientOcclusionTexture
// material.aoMapIntensity = 1
// material.displacementMap = doorHeightTexture
// material.displacementScale = .1
// material.metalnessMap = doorMetalnessTexture
// material.roughnessMap = doorRoughnessTexture
// material.normalMap = doorNormalTexture
// material.normalScale.set(.5, .5)
// material.alphaMap = doorAlphaTexture
// material.transparent = true

// MeshPhysicalMaterial
const material = new THREE.MeshPhysicalMaterial()
material.metalness = 0
material.roughness = 0
// material.map = doorColorTexture

// material.aoMap = doorAmbientOcclusionTexture
// material.aoMapIntensity = 1
// material.displacementMap = doorHeightTexture
// material.displacementScale = .1
// material.metalnessMap = doorMetalnessTexture
// material.roughnessMap = doorRoughnessTexture
// material.normalMap = doorNormalTexture
// material.normalScale.set(.5, .5)
// material.alphaMap = doorAlphaTexture
// material.transparent = true

// gui.add(material, "metalness").min(0).max(1).step(.0001)
// gui.add(material, "roughness").min(0).max(1).step(.0001)


// Clearcoat
// material.clearcoat = 1
// material.clearcoatRoughness = 0
// gui.add(material, "clearcoat").min(0).max(1).step(.0001)
// gui.add(material, "clearcoatRoughness").min(0).max(1).step(.0001)

// Sheen
// material.sheen = 1
// material.sheenRoughness = .25
// material.sheenColor.set(1, 1, 1)
// gui.add(material, "sheen").min(0).max(1).step(.0001)
// gui.add(material, "sheenRoughness").min(0).max(1).step(.0001)
// gui.addColor(material, "sheenColor")

// Iridescence
// material.iridescence = 1
// material.iridescenceIOR = 1
// material.iridescenceThicknessRange = [100, 800]
// gui.add(material, "iridescence").min(0).max(1).step(.0001)
// gui.add(material, "iridescenceIOR").min(1).max(2.333).step(.0001)
// gui.add(material.iridescenceThicknessRange, "0").min(1).max(1000).step(1)
// gui.add(material.iridescenceThicknessRange, "1").min(1).max(1000).step(1)

// Transmission
material.transmission = 1
material.ior = 1.5
material.thickness = .5
gui.add(material, "transmission").min(0).max(1).step(.0001)
gui.add(material, "ior").min(1).max(10).step(.0001)
gui.add(material, "thickness").min(0).max(1).step(.0001)


const sphere = new THREE.Mesh(new THREE.SphereGeometry(.5, 64, 64), material)  // 创建球体网格，半径0.5，64个分段，使用上面创建的材质
sphere.position.setX(-1.5)  // 将球体沿 X 轴向左移动 1.5 个单位
const plane = new THREE.Mesh(new THREE.PlaneGeometry(1, 1, 100, 100), material)  // 创建平面网格，宽高均为1，使用相同材质

const torus = new THREE.Mesh(new THREE.TorusGeometry(.3, .2, 64, 128), material)  // 创建圆环网格，半径0.3，管道半径0.2，64个分段，128个径向分段
torus.position.setX(1.5)  // 将圆环沿 X 轴向右移动 1.5 个单位
scene.add(sphere, plane, torus)  // 将球体、平面、圆环添加到场景中


/**
 * Light
 * 
 */

// const color = new THREE.Color(0xfffff)
// const ambientLight = new THREE.AmbientLight(0xffffff, 1)
// scene.add(ambientLight)

// const pointLight = new THREE.PointLight(0xffffff, 10)

// pointLight.position.x = 2
// pointLight.position.y = 2
// pointLight.position.z = 3

// scene.add(pointLight)

/**
 * 环境贴图
 */
const hdrLoader = new HDRLoader()
hdrLoader.load("./textures/environmentMap/2k.hdr", (environmentMap) => {
    // console.log(environmentMap);
    environmentMap.mapping = THREE.EquirectangularReflectionMapping
    scene.background = environmentMap
    scene.environment = environmentMap
})

/**
 * Sizes
 */
const sizes = {  // 定义尺寸对象
    width: window.innerWidth,  // 获取浏览器窗口宽度
    height: window.innerHeight  // 获取浏览器窗口高度
}

window.addEventListener('resize', () => {  // 监听浏览器窗口大小变化事件
    // Update sizes  // 更新尺寸注释标记
    sizes.width = window.innerWidth  // 更新宽度为新的窗口宽度
    sizes.height = window.innerHeight  // 更新高度为新的窗口高度

    // Update camera  // 更新相机注释标记
    camera.aspect = sizes.width / sizes.height  // 更新相机宽高比，防止画面变形
    camera.updateProjectionMatrix()  // 更新相机投影矩阵，应用新的宽高比

    // Update renderer  // 更新渲染器注释标记
    renderer.setSize(sizes.width, sizes.height)  // 调整渲染器尺寸以匹配新窗口大小
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))  // 设置像素比例，限制最大为2以优化性能
})

/**
 * Camera
 */
// Base camera  // 基础相机注释标记
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 100)  // 创建透视相机，视野角度75度，近裁切面0.1，远裁切面100
camera.position.x = 1  // 设置相机 X 轴位置为 1
camera.position.y = 1  // 设置相机 Y 轴位置为 1
camera.position.z = 2  // 设置相机 Z 轴位置为 2（距离原点2个单位）
scene.add(camera)  // 将相机添加到场景中

// Controls  // 控制器注释标记
const controls = new OrbitControls(camera, canvas)  // 创建轨道控制器，绑定相机和画布
controls.enableDamping = true  // 开启阻尼效果，使相机移动更平滑

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({  // 创建 WebGL 渲染器
    canvas: canvas  // 指定渲染目标为获取到的 canvas 元素
})
renderer.setSize(sizes.width, sizes.height)  // 设置渲染器尺寸
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))  // 设置像素比例，限制最大为2

/**
 * Animate
 */
const clock = new THREE.Clock()  // 创建时钟实例，用于计算动画时间

const tick = () => {  // 定义动画循环函数
    const elapsedTime = clock.getElapsedTime()  // 获取从开始到现在经过的时间（秒）
    // Update objects  // 更新物体注释标记

    sphere.rotation.x = -0.15 * elapsedTime  // 让球体绕 X 轴旋转，速度为 -0.15 弧度/秒

    plane.rotation.x = -0.15 * elapsedTime  // 让平面绕 X 轴旋转，速度与球体相同
    torus.rotation.x = -0.15 * elapsedTime  // 让圆环绕 X 轴旋转，速度相同

    sphere.rotation.y = 0.1 * elapsedTime  // 让球体绕 Y 轴旋转，速度为 0.1 弧度/秒

    plane.rotation.y = 0.1 * elapsedTime  // 让平面绕 Y 轴旋转，速度与球体相同
    torus.rotation.y = 0.1 * elapsedTime  // 让圆环绕 Y 轴旋转，速度相同


    // Update controls  // 更新控制器注释标记
    controls.update()  // 更新控制器状态，处理阻尼效果

    // Render  // 渲染注释标记
    renderer.render(scene, camera)  // 使用渲染器渲染场景和相机视角

    // Call tick again on the next frame  // 在下一帧再次调用 tick 函数
    window.requestAnimationFrame(tick)  // 请求浏览器在下一帧重绘时调用 tick，形成动画循环
}

tick()  // 启动动画循环