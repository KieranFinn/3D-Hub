/**
 * Main - 3D Hub 入口文件
 */

import { initRenderer, startRenderLoop, getScene, setAnimUpdater, hideLoading } from './renderer.js';
import { initCharacter, getAnimationUpdater } from './character.js';
import { initControls } from './controls.js';

/**
 * 初始化应用
 */
function init() {
    console.log('3D Hub initializing...');
    
    // 获取容器
    const container = document.getElementById('canvas-container');
    if (!container) {
        console.error('Canvas container not found');
        return;
    }
    
    // 初始化渲染器
    const scene = initRenderer(container);
    
    // 初始化角色（会触发 GLB 加载）
    initCharacter(scene);
    
    // 注册动画更新器
    const animUpdater = getAnimationUpdater();
    if (animUpdater) setAnimUpdater(animUpdater);
    
    // 初始化控件
    initControls();
    
    // 开始渲染循环
    startRenderLoop();
    
    // 隐藏加载提示
    hideLoading();
    
    console.log('3D Hub initialized!');
}

// DOM 加载完成后初始化
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
} else {
    init();
}
