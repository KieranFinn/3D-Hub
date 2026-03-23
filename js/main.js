/**
 * Main - 3D Hub 入口文件
 */

import { initRenderer, startRenderLoop, getScene, hideLoading } from './renderer.js';
import { initCharacter } from './character.js';
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
    
    // 初始化角色
    initCharacter(scene);
    
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
