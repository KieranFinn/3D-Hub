/**
 * Controls - UI 控件事件处理
 */

import { 
    getCharacterRef, 
    subscribeToChanges,
    updateCharacterState,
    exportCharacterConfig,
    importCharacterConfig
} from './state.js';
import { applyCharacterConfig } from './character.js';

// DOM 元素引用
let promptInput, generateBtn, resetBtn, saveBtn;

/**
 * 初始化控件
 */
function initControls() {
    // 获取 DOM 引用
    promptInput = document.getElementById('characterPrompt');
    generateBtn = document.getElementById('generateBtn');
    resetBtn = document.getElementById('resetBtn');
    saveBtn = document.getElementById('saveBtn');
    
    // 绑定事件
    bindSliderEvents();
    bindButtonEvents();
    bindPresetEvents();
    
    // 订阅状态变化，同步 UI
    subscribeToChanges(syncUIFromState);
    
    // 初始化 UI
    syncUIFromState(getCharacterRef());
}

/**
 * 绑定滑杆事件
 */
function bindSliderEvents() {
    const sliders = [
        { id: 'eyeSize', path: ['eyes', 'size'] },
        { id: 'eyeSpacing', path: ['eyes', 'spacing'] },
        { id: 'noseSize', path: ['nose', 'size'] },
        { id: 'mouthWidth', path: ['mouth', 'width'] },
        { id: 'headSize', path: ['face', 'size'] }
    ];
    
    sliders.forEach(({ id, path }) => {
        const slider = document.getElementById(id);
        if (!slider) return;
        
        slider.addEventListener('input', (e) => {
            const value = parseFloat(e.target.value);
            const state = getCharacterRef();
            
            // 深度设置
            let target = state;
            for (let i = 0; i < path.length - 1; i++) {
                target = target[path[i]];
            }
            target[path[path.length - 1]] = value;
            
            // 更新状态
            updateCharacterState(state);
            
            // 同步显示值
            const valueDisplay = document.getElementById(`${id}Value`);
            if (valueDisplay) {
                valueDisplay.textContent = value.toFixed(1) + 'x';
            }
        });
    });
}

/**
 * 绑定按钮事件
 */
function bindButtonEvents() {
    // 生成按钮
    if (generateBtn) {
        generateBtn.addEventListener('click', handleGenerate);
    }
    
    // 重置按钮
    if (resetBtn) {
        resetBtn.addEventListener('click', () => {
            updateCharacterState({
                face: { shape: 1.0, size: 1.0 },
                eyes: { size: 1.0, spacing: 1.0, color: '#333333' },
                nose: { size: 1.0 },
                mouth: { width: 1.0, curve: 0.5 },
                hair: { style: 'short', color: '#2a1810' }
            });
        });
    }
    
    // 保存按钮
    if (saveBtn) {
        saveBtn.addEventListener('click', handleSave);
    }
}

/**
 * 绑定预设按钮事件
 */
function bindPresetEvents() {
    const presets = document.querySelectorAll('.preset-btn');
    presets.forEach(btn => {
        btn.addEventListener('click', () => {
            // 移除其他 active
            presets.forEach(b => b.classList.remove('active'));
            // 添加 active
            btn.classList.add('active');
            
            // 应用预设
            const presetName = btn.dataset.preset;
            applyPresetByName(presetName);
        });
    });
}

/**
 * 根据预设名称应用预设
 */
function applyPresetByName(name) {
    const presets = {
        'young': {
            face: { size: 1.1 },
            eyes: { size: 1.2, spacing: 1.0 },
            nose: { size: 0.9 },
            mouth: { width: 0.8 }
        },
        'mature': {
            face: { size: 1.0 },
            eyes: { size: 0.9, spacing: 1.1 },
            nose: { size: 1.1 },
            mouth: { width: 1.0 }
        },
        'cute': {
            face: { size: 1.2 },
            eyes: { size: 1.4, spacing: 0.9 },
            nose: { size: 0.8 },
            mouth: { width: 1.2 }
        },
        'cool': {
            face: { size: 0.95 },
            eyes: { size: 0.85, spacing: 1.2 },
            nose: { size: 1.0 },
            mouth: { width: 0.7 }
        }
    };
    
    const preset = presets[name];
    if (preset) {
        updateCharacterState(preset);
    }
}

/**
 * 处理生成（文本解析 - 假数据版本）
 */
function handleGenerate() {
    const text = promptInput.value.trim();
    if (!text) return;
    
    // 假数据映射（后续接入 LLM）
    const textMappings = {
        '少年': { face: { size: 1.15 }, eyes: { size: 1.25, spacing: 0.95 } },
        '成熟': { face: { size: 1.0 }, eyes: { size: 0.9, spacing: 1.1 } },
        '可爱': { face: { size: 1.25 }, eyes: { size: 1.4, spacing: 0.85 } },
        '冷酷': { face: { size: 0.95 }, eyes: { size: 0.8, spacing: 1.2 } }
    };
    
    // 简单的关键词匹配
    let matched = false;
    for (const [keyword, config] of Object.entries(textMappings)) {
        if (text.includes(keyword)) {
            updateCharacterState(config);
            matched = true;
            break;
        }
    }
    
    if (!matched) {
        // 默认应用"可爱"预设作为示例
        updateCharacterState(textMappings['可爱']);
    }
}

/**
 * 处理保存
 */
function handleSave() {
    const config = exportCharacterConfig();
    const blob = new Blob([config], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    
    const a = document.createElement('a');
    a.href = url;
    a.download = 'character-config.json';
    a.click();
    
    URL.revokeObjectURL(url);
}

/**
 * 从状态同步 UI
 */
function syncUIFromState(state) {
    // 同步滑杆
    if (state.eyes) {
        syncSlider('eyeSize', state.eyes.size);
        syncSlider('eyeSpacing', state.eyes.spacing);
    }
    if (state.nose) {
        syncSlider('noseSize', state.nose.size);
    }
    if (state.mouth) {
        syncSlider('mouthWidth', state.mouth.width);
    }
    if (state.face) {
        syncSlider('headSize', state.face.size);
    }
    
    // 应用到 3D 模型
    applyCharacterConfig(state);
}

/**
 * 同步单个滑杆
 */
function syncSlider(id, value) {
    const slider = document.getElementById(id);
    const valueDisplay = document.getElementById(`${id}Value`);
    
    if (slider) {
        slider.value = value;
    }
    if (valueDisplay) {
        valueDisplay.textContent = parseFloat(value).toFixed(1) + 'x';
    }
}

export {
    initControls
};
