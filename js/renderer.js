/**
 * Renderer - Three.js 渲染器管理
 */

import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

let camera, renderer, scene, controls;
let canvasContainer;
let particles;
let groundMirror;
let animFrameId;

/**
 * 初始化渲染器
 * @param {HTMLElement} container - canvas 容器元素
 */
function initRenderer(container) {
    canvasContainer = container;
    
    // 创建场景
    scene = new THREE.Scene();
    // 深空背景，配合 fog 营造纵深
    scene.background = new THREE.Color(0x060810);
    scene.fog = new THREE.FogExp2(0x060810, 0.18);
    
    // 创建相机
    camera = new THREE.PerspectiveCamera(
        45,
        container.clientWidth / container.clientHeight,
        0.1,
        100
    );
    camera.position.set(0, 1.5, 4);
    
    // 创建渲染器
    renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.2;
    container.appendChild(renderer.domElement);
    
    // 环境光
    const ambientLight = new THREE.AmbientLight(0x1a2040, 0.8);
    scene.add(ambientLight);
    
    // 主光源 — 从右上方打下来，增加立体感
    const keyLight = new THREE.DirectionalLight(0xffffff, 1.2);
    keyLight.position.set(4, 8, 4);
    keyLight.castShadow = true;
    keyLight.shadow.mapSize.width = 1024;
    keyLight.shadow.mapSize.height = 1024;
    scene.add(keyLight);
    
    // 青色侧光 — 左前
    const sideLight = new THREE.PointLight(0x00f0ff, 1.5, 15);
    sideLight.position.set(-3, 2, 2);
    scene.add(sideLight);
    
    // 紫色补光 — 右后
    const rimLight = new THREE.PointLight(0xb44aff, 1.0, 12);
    rimLight.position.set(3, 1, -3);
    scene.add(rimLight);
    
    // 底部反光 — 模拟地面反射
    const bottomGlow = new THREE.PointLight(0x00f0ff, 0.6, 8);
    bottomGlow.position.set(0, -2, 0);
    scene.add(bottomGlow);
    
    // 地面反光层
    addGroundPlane();
    
    // 空间深度粒子
    addDepthParticles();
    
    // 轨道控制器（更好的旋转体验）
    controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    controls.minDistance = 2;
    controls.maxDistance = 10;
    controls.target.set(0, 1, 0);
    
    // 响应式
    window.addEventListener('resize', onResize);
    
    return scene;
}

/**
 * 添加地面反光层 — 营造空间底座感，无网格
 */
function addGroundPlane() {
    // 地面几何体
    const groundGeo = new THREE.PlaneGeometry(30, 30);
    const groundMat = new THREE.MeshStandardMaterial({
        color: 0x080c18,
        roughness: 0.2,
        metalness: 0.8,
        transparent: true,
        opacity: 0.6,
    });
    groundMirror = new THREE.Mesh(groundGeo, groundMat);
    groundMirror.rotation.x = -Math.PI / 2;
    groundMirror.position.y = -0.5;
    groundMirror.receiveShadow = true;
    scene.add(groundMirror);
    
    // 地面边缘淡化环
    const ringGeo = new THREE.RingGeometry(0.5, 8, 64);
    const ringMat = new THREE.MeshBasicMaterial({
        color: 0x00f0ff,
        transparent: true,
        opacity: 0.08,
        side: THREE.DoubleSide,
    });
    const ring = new THREE.Mesh(ringGeo, ringMat);
    ring.rotation.x = -Math.PI / 2;
    ring.position.y = -0.49;
    scene.add(ring);
    
    // 外层淡环
    const outerRingGeo = new THREE.RingGeometry(7.5, 12, 64);
    const outerRingMat = new THREE.MeshBasicMaterial({
        color: 0x00f0ff,
        transparent: true,
        opacity: 0.03,
        side: THREE.DoubleSide,
    });
    const outerRing = new THREE.Mesh(outerRingGeo, outerRingMat);
    outerRing.rotation.x = -Math.PI / 2;
    outerRing.position.y = -0.49;
    scene.add(outerRing);
}

/**
 * 添加空间深度粒子 — 多层次分布
 */
function addDepthParticles() {
    const particleCount = 400;
    const positions = new Float32Array(particleCount * 3);
    const colors = new Float32Array(particleCount * 3);
    const sizes = new Float32Array(particleCount);
    
    const cyanColor = new THREE.Color(0x00f0ff);
    const purpleColor = new THREE.Color(0xb44aff);
    const whiteColor = new THREE.Color(0xaabbcc);
    
    for (let i = 0; i < particleCount; i++) {
        // 远近分层：y 值越小越远
        const layer = Math.random();
        let x, y, z;
        
        if (layer < 0.5) {
            // 远层 — 背景漂浮
            x = (Math.random() - 0.5) * 20;
            y = Math.random() * 8 - 1;
            z = (Math.random() - 0.5) * 20;
        } else if (layer < 0.8) {
            // 中层 — 角色周围
            x = (Math.random() - 0.5) * 8;
            y = Math.random() * 5;
            z = (Math.random() - 0.5) * 8;
        } else {
            // 近层 — 镜头附近（更大更亮）
            x = (Math.random() - 0.5) * 4;
            y = Math.random() * 3 + 0.5;
            z = (Math.random() - 0.5) * 4;
        }
        
        positions[i * 3] = x;
        positions[i * 3 + 1] = y;
        positions[i * 3 + 2] = z;
        
        // 颜色混合
        const colorChoice = Math.random();
        let color;
        if (colorChoice < 0.6) {
            color = cyanColor.clone().lerp(whiteColor, Math.random() * 0.3);
        } else {
            color = purpleColor.clone().lerp(whiteColor, Math.random() * 0.3);
        }
        colors[i * 3] = color.r;
        colors[i * 3 + 1] = color.g;
        colors[i * 3 + 2] = color.b;
        
        // 粒子大小：远的更小
        sizes[i] = layer < 0.5 ? Math.random() * 1.0 : Math.random() * 2.0 + 1.0;
    }
    
    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
    geometry.setAttribute('size', new THREE.BufferAttribute(sizes, 1));
    
    const material = new THREE.PointsMaterial({
        size: 0.05,
        vertexColors: true,
        transparent: true,
        opacity: 0.6,
        sizeAttenuation: true,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
    });
    
    particles = new THREE.Points(geometry, material);
    scene.add(particles);
}


/**
 * 窗口大小变化处理
 */
function onResize() {
    if (!canvasContainer) return;
    
    camera.aspect = canvasContainer.clientWidth / canvasContainer.clientHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(canvasContainer.clientWidth, canvasContainer.clientHeight);
}

/**
 * 开始渲染循环
 */
function startRenderLoop() {
    let time = 0;
    function animate() {
        animFrameId = requestAnimationFrame(animate);
        time += 0.005;
        
        // 粒子漂浮动画 — 营造空间深度感
        if (particles) {
            const positions = particles.geometry.attributes.position.array;
            const count = positions.length / 3;
            for (let i = 0; i < count; i++) {
                // 每层粒子漂浮速度不同：远的慢，近的快
                const y = positions[i * 3 + 1];
                const speed = y > 2 ? 0.003 : y > 0.5 ? 0.0015 : 0.001;
                positions[i * 3 + 1] += Math.sin(time * (0.5 + i * 0.01) + i) * speed;
                
                // 横向轻微漂移
                positions[i * 3] += Math.cos(time * 0.3 + i * 0.05) * 0.0005;
            }
            particles.geometry.attributes.position.needsUpdate = true;
            
            // 粒子呼吸效果：透明度随时间微微变化
            particles.material.opacity = 0.4 + Math.sin(time * 2) * 0.15;
        }
        
        controls.update();
        renderer.render(scene, camera);
    }
    animate();
}

/**
 * 获取场景引用
 */
function getScene() {
    return scene;
}

/**
 * 获取相机引用
 */
function getCamera() {
    return camera;
}

/**
 * 获取渲染器引用
 */
function getRenderer() {
    return renderer;
}

/**
 * 获取控制器引用
 */
function getControls() {
    return controls;
}

/**
 * 隐藏加载提示
 */
function hideLoading() {
    const loading = document.getElementById('loading');
    if (loading) {
        loading.style.display = 'none';
    }
}

export {
    initRenderer,
    startRenderLoop,
    getScene,
    getCamera,
    getRenderer,
    getControls,
    hideLoading
};
