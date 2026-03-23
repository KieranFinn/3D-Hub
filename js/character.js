/**
 * Character - 3D 角色模型管理
 * 负责创建和更新角色网格
 */

import * as THREE from 'three';
import { getCharacterState, subscribeToChanges } from './state.js';

let characterGroup;
let meshes = {};
let scene;

// 材质
const skinMaterial = new THREE.MeshStandardMaterial({ color: 0xffd5c8 });
const eyeMaterial = new THREE.MeshStandardMaterial({ color: 0x333333 });
const noseMaterial = new THREE.MeshStandardMaterial({ color: 0xffc8b8 });
const mouthMaterial = new THREE.MeshStandardMaterial({ color: 0xcc8888 });
const hairMaterial = new THREE.MeshStandardMaterial({ color: 0x2a1810 });
const bodyMaterial = new THREE.MeshStandardMaterial({ color: 0x4a90d9 });

/**
 * 初始化角色
 * @param {THREE.Scene} sceneRef - Three.js 场景引用
 */
function initCharacter(sceneRef) {
    scene = sceneRef;
    characterGroup = new THREE.Group();
    scene.add(characterGroup);
    
    createHead();
    createEyes();
    createNose();
    createMouth();
    createBody();
    createHair();
    
    // 订阅状态变化
    subscribeToChanges(applyCharacterConfig);
}

/**
 * 创建头部
 */
function createHead() {
    const headGeom = new THREE.SphereGeometry(0.4, 32, 32);
    meshes.head = new THREE.Mesh(headGeom, skinMaterial);
    meshes.head.position.y = 1.2;
    characterGroup.add(meshes.head);
}

/**
 * 创建眼睛
 */
function createEyes() {
    const eyeGeom = new THREE.SphereGeometry(0.08, 16, 16);
    
    meshes.leftEye = new THREE.Mesh(eyeGeom, eyeMaterial);
    meshes.leftEye.position.set(-0.15, 1.3, 0.32);
    characterGroup.add(meshes.leftEye);
    
    meshes.rightEye = new THREE.Mesh(eyeGeom, eyeMaterial);
    meshes.rightEye.position.set(0.15, 1.3, 0.32);
    characterGroup.add(meshes.rightEye);
}

/**
 * 创建鼻子
 */
function createNose() {
    const noseGeom = new THREE.ConeGeometry(0.05, 0.12, 8);
    meshes.nose = new THREE.Mesh(noseGeom, noseMaterial);
    meshes.nose.position.set(0, 1.18, 0.38);
    meshes.nose.rotation.x = -0.5;
    characterGroup.add(meshes.nose);
}

/**
 * 创建嘴巴
 */
function createMouth() {
    const mouthGeom = new THREE.TorusGeometry(0.08, 0.02, 8, 16, Math.PI);
    meshes.mouth = new THREE.Mesh(mouthGeom, mouthMaterial);
    meshes.mouth.position.set(0, 1.05, 0.35);
    meshes.mouth.rotation.x = -0.2;
    characterGroup.add(meshes.mouth);
}

/**
 * 创建身体
 */
function createBody() {
    const bodyGeom = new THREE.CylinderGeometry(0.25, 0.3, 1, 16);
    meshes.body = new THREE.Mesh(bodyGeom, bodyMaterial);
    meshes.body.position.y = 0.3;
    characterGroup.add(meshes.body);
}

/**
 * 创建头发（简单半球形）
 */
function createHair() {
    const hairGeom = new THREE.SphereGeometry(0.42, 16, 16, 0, Math.PI * 2, 0, Math.PI / 2);
    meshes.hair = new THREE.Mesh(hairGeom, hairMaterial);
    meshes.hair.position.y = 1.25;
    characterGroup.add(meshes.hair);
}

/**
 * 应用角色配置到网格
 * 这是统一的更新入口
 */
function applyCharacterConfig(config) {
    if (!config || !meshes.head) return;
    
    // 头部
    if (config.face) {
        if (config.face.size !== undefined) {
            meshes.head.scale.setScalar(config.face.size);
        }
    }
    
    // 眼睛
    if (config.eyes) {
        if (config.eyes.size !== undefined) {
            const eyeScale = config.eyes.size;
            meshes.leftEye.scale.setScalar(eyeScale);
            meshes.rightEye.scale.setScalar(eyeScale);
        }
        if (config.eyes.spacing !== undefined) {
            const spacing = config.eyes.spacing;
            meshes.leftEye.position.x = -0.15 * spacing;
            meshes.rightEye.position.x = 0.15 * spacing;
        }
        if (config.eyes.color !== undefined) {
            eyeMaterial.color.set(config.eyes.color);
        }
    }
    
    // 鼻子
    if (config.nose && config.nose.size !== undefined) {
        meshes.nose.scale.setScalar(config.nose.size);
    }
    
    // 嘴巴
    if (config.mouth) {
        if (config.mouth.width !== undefined) {
            meshes.mouth.scale.x = config.mouth.width;
        }
    }
    
    // 头发颜色
    if (config.hair && config.hair.color !== undefined) {
        hairMaterial.color.set(config.hair.color);
    }
}

/**
 * 获取角色组（用于外部控制旋转等）
 */
function getCharacterGroup() {
    return characterGroup;
}

/**
 * 根据预设批量应用配置
 */
function applyPreset(preset) {
    if (!preset) return;
    applyCharacterConfig(preset);
}

export {
    initCharacter,
    applyCharacterConfig,
    getCharacterGroup,
    applyPreset,
    meshes
};
