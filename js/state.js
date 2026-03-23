/**
 * State Management - Character Parameter Object
 * 统一角色参数对象 - 所有模块共享的数据源
 */

// 默认角色参数
const defaultCharacter = {
    face: {
        shape: 1.0,    // 脸型
        size: 1.0      // 头大小
    },
    eyes: {
        size: 1.0,     // 眼睛大小
        spacing: 1.0,   // 眼睛间距
        color: '#333333' // 眼睛颜色
    },
    nose: {
        size: 1.0      // 鼻子大小
    },
    mouth: {
        width: 1.0,    // 嘴巴宽度
        curve: 0.5      // 嘴巴弧度
    },
    hair: {
        style: 'short', // 发型
        color: '#2a1810'  // 头发颜色
    },
    style: 'realistic' // 风格
};

// 当前角色状态
let characterState = JSON.parse(JSON.stringify(defaultCharacter));

// 监听器列表
const listeners = [];

/**
 * 获取当前角色状态（只读副本）
 */
function getCharacterState() {
    return JSON.parse(JSON.stringify(characterState));
}

/**
 * 获取角色状态的引用（可修改）
 */
function getCharacterRef() {
    return characterState;
}

/**
 * 更新角色状态
 * @param {Object} newState - 新状态（会合并到现有状态）
 */
function updateCharacterState(newState) {
    characterState = mergeDeep(characterState, newState);
    notifyListeners();
}

/**
 * 重置为默认状态
 */
function resetCharacterState() {
    characterState = JSON.parse(JSON.stringify(defaultCharacter));
    notifyListeners();
}

/**
 * 订阅状态变化
 * @param {Function} callback - 回调函数
 */
function subscribeToChanges(callback) {
    listeners.push(callback);
}

/**
 * 通知所有监听器
 */
function notifyListeners() {
    listeners.forEach(cb => cb(characterState));
}

/**
 * 深度合并对象
 */
function mergeDeep(target, source) {
    const output = { ...target };
    for (const key in source) {
        if (source[key] && typeof source[key] === 'object' && !Array.isArray(source[key])) {
            output[key] = mergeDeep(target[key] || {}, source[key]);
        } else {
            output[key] = source[key];
        }
    }
    return output;
}

/**
 * 导出角色配置为 JSON 字符串
 */
function exportCharacterConfig() {
    return JSON.stringify(characterState, null, 2);
}

/**
 * 从 JSON 导入角色配置
 */
function importCharacterConfig(jsonString) {
    try {
        const imported = JSON.parse(jsonString);
        updateCharacterState(imported);
        return true;
    } catch (e) {
        console.error('Failed to import config:', e);
        return false;
    }
}

// 调试用
function logState() {
    console.log('Character State:', characterState);
}

export {
    getCharacterState,
    getCharacterRef,
    updateCharacterState,
    resetCharacterState,
    subscribeToChanges,
    exportCharacterConfig,
    importCharacterConfig,
    defaultCharacter,
    logState
};
