/**
 * Character - 3D 角色模型管理
 * 优先加载 GLB 模型，fallback 到基础几何体
 */

import * as THREE from 'three';

let characterGroup;
let gltfModel = null;
let mixer = null;
let animations = {};
let currentAction = null;
let scene;
let isModelLoaded = false;
let pendingConfig = null;

/**
 * 初始化角色
 */
function initCharacter(sceneRef) {
    scene = sceneRef;
    characterGroup = new THREE.Group();
    characterGroup.position.set(0, -0.5, 0);
    scene.add(characterGroup);

    loadGLBFromURL('./models/robot.glb');
}

/**
 * 用 fetch 加载相对路径模型，再用 GLTFLoader 解析
 * 兼容本地服务器（Live Server）和线上部署
 */
function loadGLBFromURL(url) {
    fetch(url)
        .then((res) => {
            if (!res.ok) throw new Error(`HTTP ${res.status}`);
            return res.arrayBuffer();
        })
        .then((buf) => parseGLB(buf))
        .catch((e) => {
            console.warn('GLB load failed, using fallback:', e);
            createFallbackCharacter();
        });
}

/**
 * 解析 ArrayBuffer 为 Three.js 模型
 */
function parseGLB(arrayBuffer) {
    // 动态 import GLTFLoader（兼容 ES module 和本地 file 协议）
    import('three/addons/loaders/GLTFLoader.js').then(({ GLTFLoader }) => {
        const loader = new GLTFLoader();
        const blob = new Blob([arrayBuffer]);
        const url = URL.createObjectURL(blob);

        loader.load(
            url,
            (gltf) => {
                URL.revokeObjectURL(url);
                onGLBLoaded(gltf);
            },
            (progress) => {
                const pct = progress.loaded / (progress.total || 1) * 100;
                const el = document.getElementById('loading');
                if (el) el.querySelector('span').textContent = `LOADING... ${Math.round(pct)}%`;
            },
            (err) => {
                console.warn('GLB parse error, using fallback:', err);
                createFallbackCharacter();
            }
        );
    }).catch((e) => {
        console.warn('GLTFLoader import failed, using fallback:', e);
        createFallbackCharacter();
    });
}

/**
 * GLB 加载成功回调
 */
function onGLBLoaded(gltf) {
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
        playAnimation('Idle');
    }

    if (pendingConfig) {
        applyCharacterConfig(pendingConfig);
        pendingConfig = null;
    }

    const loading = document.getElementById('loading');
    if (loading) loading.style.display = 'none';

    console.log('GLB model loaded successfully from:', './models/robot.glb');
}

/**
 * Fallback 几何体角色
 */
function createFallbackCharacter() {
    const skinMat = new THREE.MeshStandardMaterial({ color: 0xffd5c8, roughness: 0.7, metalness: 0.1 });
    const eyeMat = new THREE.MeshStandardMaterial({ color: 0x333333 });
    const noseMat = new THREE.MeshStandardMaterial({ color: 0xffc8b8 });
    const mouthMat = new THREE.MeshStandardMaterial({ color: 0xcc8888 });
    const hairMat = new THREE.MeshStandardMaterial({ color: 0x2a1810 });
    const bodyMat = new THREE.MeshStandardMaterial({ color: 0x4a90d9, roughness: 0.6, metalness: 0.2 });

    const add = (geo, mat, x, y, z, shadow = false) => {
        const m = new THREE.Mesh(geo, mat);
        m.position.set(x, y, z);
        if (shadow) m.castShadow = true;
        characterGroup.add(m);
        return m;
    };

    const head = add(new THREE.SphereGeometry(0.4, 32, 32), skinMat, 0, 1.7, 0, true);
    add(new THREE.SphereGeometry(0.06, 16, 16), eyeMat, -0.14, 1.8, 0.32);
    add(new THREE.SphereGeometry(0.06, 16, 16), eyeMat, 0.14, 1.8, 0.32);
    const nose = add(new THREE.ConeGeometry(0.04, 0.1, 8), noseMat, 0, 1.7, 0.38);
    nose.rotation.x = -0.4;
    add(new THREE.TorusGeometry(0.06, 0.015, 8, 16, Math.PI), mouthMat, 0, 1.58, 0.36);
    const hair = add(new THREE.SphereGeometry(0.43, 16, 16, 0, Math.PI * 2, 0, Math.PI / 2), hairMat, 0, 1.75, 0);
    add(new THREE.CylinderGeometry(0.22, 0.28, 0.9, 16), bodyMat, 0, 0.95, 0, true);
    add(new THREE.CylinderGeometry(0.06, 0.06, 0.7, 8), bodyMat, -0.35, 1.1, 0, true).rotation.z = 0.3;
    add(new THREE.CylinderGeometry(0.06, 0.06, 0.7, 8), bodyMat, 0.35, 1.1, 0, true).rotation.z = -0.3;
    add(new THREE.CylinderGeometry(0.08, 0.08, 0.8, 8), bodyMat, -0.12, 0.25, 0, true);
    add(new THREE.CylinderGeometry(0.08, 0.08, 0.8, 8), bodyMat, 0.12, 0.25, 0, true);

    window._fallbackMeshes = { head, nose, hair };
    isModelLoaded = true;

    const loading = document.getElementById('loading');
    if (loading) loading.style.display = 'none';
}

/**
 * 播放动画
 */
function playAnimation(name) {
    if (!mixer) return;
    const action = animations[name];
    if (!action) return;
    if (currentAction && currentAction !== action) currentAction.fadeOut(0.3);
    action.reset().fadeIn(0.3).play();
    currentAction = action;
}

/**
 * 更新动画
 */
function updateAnimations(delta) {
    if (mixer) mixer.update(delta);
}

/**
 * 应用配置
 */
function applyCharacterConfig(config) {
    if (!isModelLoaded) { pendingConfig = config; return; }
    if (!config) return;

    if (gltfModel && config.scale !== undefined) {
        gltfModel.scale.setScalar(config.scale);
    }
    if (window._fallbackMeshes && config.face && config.face.size !== undefined) {
        window._fallbackMeshes.head.scale.setScalar(config.face.size);
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
    setAnimation
};
