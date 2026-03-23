/**
 * Renderer - Three.js 渲染器管理
 */

import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

let camera, renderer, scene, controls;
let canvasContainer;

/**
 * 初始化渲染器
 * @param {HTMLElement} container - canvas 容器元素
 */
function initRenderer(container) {
    canvasContainer = container;
    
    // 创建场景
    scene = new THREE.Scene();
    scene.background = new THREE.Color(0x1a1a2e);
    
    // 创建相机
    camera = new THREE.PerspectiveCamera(
        45,
        container.clientWidth / container.clientHeight,
        0.1,
        1000
    );
    camera.position.set(0, 1.5, 4);
    
    // 创建渲染器
    renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.setPixelRatio(window.devicePixelRatio);
    container.appendChild(renderer.domElement);
    
    // 添加光源
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    scene.add(ambientLight);
    
    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
    directionalLight.position.set(5, 5, 5);
    scene.add(directionalLight);
    
    // 添加补光
    const fillLight = new THREE.DirectionalLight(0xffffff, 0.3);
    fillLight.position.set(-5, 0, -5);
    scene.add(fillLight);
    
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
    function animate() {
        requestAnimationFrame(animate);
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
