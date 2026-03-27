/**
 * Character - 3D 角色模型管理
 * 优先加载 GLB 模型，fallback 到基础几何体
 */

import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { getCharacterState, subscribeToChanges } from './state.js';

let characterGroup;
let gltfModel = null;
let mixer = null;
let animations = {};
let currentAction = null;
let scene;
let isModelLoaded = false;
let pendingConfig = null;

// GLB 模型路径
const MODEL_PATH = './models/robot.glb';

/**
 * 初始化角色（优先加载 GLB，否则用 fallback 几何体）
 * @param {THREE.Scene} sceneRef
 */
function initCharacter(sceneRef) {
    scene = sceneRef;
    characterGroup = new THREE.Group();
    characterGroup.position.set(0, -0.5, 0); // 让模型站在地面上
    scene.add(characterGroup);

    loadGLBModel();
    subscribeToChanges(applyCharacterConfig);
}

/**
 * 加载 GLB 模型
 */
function loadGLBModel() {
    const loader = new GLTFLoader();

    loader.load(
        MODEL_PATH,
        (gltf) => {
            gltfModel = gltf.scene;
            gltfModel.scale.setScalar(1.2);
            gltfModel.castShadow = true;
            gltfModel.receiveShadow = true;

            characterGroup.add(gltfModel);
            isModelLoaded = true;

            // 动画混合器
            if (gltf.animations && gltf.animations.length > 0) {
                mixer = new THREE.AnimationMixer(gltfModel);
                gltf.animations.forEach((clip) => {
                    animations[clip.name] = mixer.clipAction(clip);
                });
                // 默认播放 Idle
                playAnimation('Idle');
            }

            // 应用挂起的配置
            if (pendingConfig) {
                applyCharacterConfig(pendingConfig);
                pendingConfig = null;
            }

            // 隐藏加载提示
            const loading = document.getElementById('loading');
            if (loading) loading.style.display = 'none';

            console.log('GLB model loaded:', MODEL_PATH);
        },
        (progress) => {
            // 加载进度
            const pct = progress.loaded / (progress.total || 1) * 100;
            const el = document.getElementById('loading');
            if (el) el.querySelector('span').textContent = `LOADING... ${Math.round(pct)}%`;
        },
        (err) => {
            console.warn('GLB load failed, using fallback primitives:', err);
            createFallbackCharacter();
        }
    );
}

/**
 * Fallback：简单几何体角色（GLB 加载失败时使用）
 */
function createFallbackCharacter() {
    const skinMat = new THREE.MeshStandardMaterial({ color: 0xffd5c8, roughness: 0.7, metalness: 0.1 });
    const eyeMat = new THREE.MeshStandardMaterial({ color: 0x333333 });
    const noseMat = new THREE.MeshStandardMaterial({ color: 0xffc8b8 });
    const mouthMat = new THREE.MeshStandardMaterial({ color: 0xcc8888 });
    const hairMat = new THREE.MeshStandardMaterial({ color: 0x2a1810 });
    const bodyMat = new THREE.MeshStandardMaterial({ color: 0x4a90d9, roughness: 0.6, metalness: 0.2 });

    const headGeo = new THREE.SphereGeometry(0.4, 32, 32);
    const head = new THREE.Mesh(headGeo, skinMat);
    head.position.y = 1.7;
    head.castShadow = true;
    characterGroup.add(head);

    const eyeGeo = new THREE.SphereGeometry(0.06, 16, 16);
    const leftEye = new THREE.Mesh(eyeGeo, eyeMat);
    leftEye.position.set(-0.14, 1.8, 0.32);
    characterGroup.add(leftEye);
    const rightEye = new THREE.Mesh(eyeGeo, eyeMat);
    rightEye.position.set(0.14, 1.8, 0.32);
    characterGroup.add(rightEye);

    const noseGeo = new THREE.ConeGeometry(0.04, 0.1, 8);
    const nose = new THREE.Mesh(noseGeo, noseMat);
    nose.position.set(0, 1.7, 0.38);
    nose.rotation.x = -0.4;
    characterGroup.add(nose);

    const mouthGeo = new THREE.TorusGeometry(0.06, 0.015, 8, 16, Math.PI);
    const mouth = new THREE.Mesh(mouthGeo, mouthMat);
    mouth.position.set(0, 1.58, 0.36);
    mouth.rotation.x = -0.2;
    characterGroup.add(mouth);

    const hairGeo = new THREE.SphereGeometry(0.43, 16, 16, 0, Math.PI * 2, 0, Math.PI / 2);
    const hair = new THREE.Mesh(hairGeo, hairMat);
    hair.position.y = 1.75;
    characterGroup.add(hair);

    const bodyGeo = new THREE.CylinderGeometry(0.22, 0.28, 0.9, 16);
    const body = new THREE.Mesh(bodyGeo, bodyMat);
    body.position.y = 0.95;
    body.castShadow = true;
    characterGroup.add(body);

    const armGeo = new THREE.CylinderGeometry(0.06, 0.06, 0.7, 8);
    const leftArm = new THREE.Mesh(armGeo, bodyMat);
    leftArm.position.set(-0.35, 1.1, 0);
    leftArm.rotation.z = 0.3;
    leftArm.castShadow = true;
    characterGroup.add(leftArm);
    const rightArm = new THREE.Mesh(armGeo, bodyMat);
    rightArm.position.set(0.35, 1.1, 0);
    rightArm.rotation.z = -0.3;
    rightArm.castShadow = true;
    characterGroup.add(rightArm);

    const legGeo = new THREE.CylinderGeometry(0.08, 0.08, 0.8, 8);
    const leftLeg = new THREE.Mesh(legGeo, bodyMat);
    leftLeg.position.set(-0.12, 0.25, 0);
    leftLeg.castShadow = true;
    characterGroup.add(leftLeg);
    const rightLeg = new THREE.Mesh(legGeo, bodyMat);
    rightLeg.position.set(0.12, 0.25, 0);
    rightLeg.castShadow = true;
    characterGroup.add(rightLeg);

    // 标记为 fallback，等 GLB 加载成功会替换
    window._fallbackMeshes = { head, leftEye, rightEye, nose, mouth, hair, body, leftArm, rightArm, leftLeg, rightLeg };
    isModelLoaded = true;
    pendingConfig = null;

    const loading = document.getElementById('loading');
    if (loading) loading.style.display = 'none';
}

/**
 * 播放动画
 * @param {string} name - 动画名称
 */
function playAnimation(name) {
    if (!mixer) return;
    const action = animations[name];
    if (!action) return;
    if (currentAction && currentAction !== action) {
        currentAction.fadeOut(0.3);
    }
    action.reset().fadeIn(0.3).play();
    currentAction = action;
}

/**
 * 更新动画（每帧调用）
 * @param {number} delta
 */
function updateAnimations(delta) {
    if (mixer) mixer.update(delta);
}

/**
 * 应用角色配置
 */
function applyCharacterConfig(config) {
    if (!isModelLoaded) {
        pendingConfig = config;
        return;
    }

    if (!config) return;

    // GLB 模型：通过 scale / rotation / position 调整
    if (gltfModel) {
        gltfModel.scale.setScalar(config.scale || 1.2);
    }

    // Fallback 几何体：按字段调整
    if (window._fallbackMeshes) {
        const m = window._fallbackMeshes;
        if (config.face && config.face.size !== undefined) {
            m.head.scale.setScalar(config.face.size);
        }
        if (config.eyes) {
            if (config.eyes.size !== undefined) {
                const s = config.eyes.size;
                m.leftEye.scale.setScalar(s);
                m.rightEye.scale.setScalar(s);
            }
            if (config.eyes.spacing !== undefined) {
                const sp = config.eyes.spacing;
                m.leftEye.position.x = -0.14 * sp;
                m.rightEye.position.x = 0.14 * sp;
            }
        }
        if (config.nose && config.nose.size !== undefined) {
            m.nose.scale.setScalar(config.nose.size);
        }
        if (config.mouth && config.mouth.width !== undefined) {
            m.mouth.scale.x = config.mouth.width;
        }
        if (config.hair && config.hair.color !== undefined) {
            m.hair.material.color.set(config.hair.color);
        }
    }
}

/**
 * 获取角色组
 */
function getCharacterGroup() {
    return characterGroup;
}

/**
 * 获取动画更新函数
 */
function getAnimationUpdater() {
    return updateAnimations;
}

/**
 * 切换动画
 */
function setAnimation(name) {
    playAnimation(name);
}

export {
    initCharacter,
    applyCharacterConfig,
    getCharacterGroup,
    getAnimationUpdater,
    setAnimation,
    playAnimation
};
