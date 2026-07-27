/* ════════════════════════════════════════════════════════════════
   DIGITAL GIANT CHERRY TREE — 3D EDITION (MATCHING CHERRY.JPG)
   ════════════════════════════════════════════════════════════════
   Design References (cherry.jpg):
   - Massive Umbrella Dome Canopy in Deep Violet / Magenta (#6b10a8 -> #d840e8)
   - Twisted Spiral Bark Trunk with Maroon/Purple Texture
   - Glowing Light Fixtures & Crystal Lanterns Under Canopy
   - Long Weeping Vertical Drapes Hanging from Canopy Tips
   - Stepped Hill Base, Wooden Fence Railing, & Tranquil Water Pond
   - Breathtaking Twilight Sunset Sky with Golden Horizon
   - Full Interactive 3D Perspective Engine (60-144 FPS)
   ════════════════════════════════════════════════════════════════ */
'use strict';

// ── DOM ELEMENTS ──────────────────────────────────────────────
const overlay = document.getElementById('opening-overlay');
const enterBtn = document.getElementById('enter-btn');
const scene = document.getElementById('scene');

const sCanvas = document.getElementById('sky-canvas');
const tCanvas = document.getElementById('tree-canvas');
const pCanvas = document.getElementById('petal-canvas');

const sCtx = sCanvas.getContext('2d');
const tCtx = tCanvas.getContext('2d');
const pCtx = pCanvas.getContext('2d');

const skySelect = document.getElementById('sky-select');
const selectIcon = document.querySelector('.select-icon');
const btnSound = document.getElementById('btn-sound');
const soundLabel = document.getElementById('sound-label');

// ── GLOBAL STATE & 3D CAMERA ──────────────────────────────────
let W = 0, H = 0;
let sceneActive = false;
let time = 0;
let currentWind = 0.04;

// 3D Camera Controls
let rotY = 0;
let rotX = 0.08;
let targetRotY = 0;
let targetRotX = 0.08;
let isDragging = false;
let lastMouseX = 0;
let lastMouseY = 0;

let currentSkyIndex = 0;
const SKY_THEMES = [
    { name: 'Sunset Glow', icon: '🌆' },
    { name: 'Golden Sunrise', icon: '🌅' },
    { name: 'Peaceful Dawn', icon: '🌄' },
    { name: 'Dusk Twilight', icon: '🌆' },
    { name: 'Moonlight Violet', icon: '🌙' },
    { name: 'Golden Hour', icon: '☀️' },
    { name: 'Starlit Night', icon: '✨' },
    { name: 'Midnight Sky', icon: '🌌' },
    { name: 'Aurora Dream', icon: '🌌' },
    { name: 'Pink Horizon', icon: '🌸' },
    { name: 'Blue Serenity', icon: '💙' },
    { name: 'Cloudy Afternoon', icon: '☁️' },
    { name: 'Silver Moon', icon: '🌕' },
    { name: 'Celestial Night', icon: '🌠' },
    { name: 'Crimson Sunset', icon: '🌇' },
    { name: 'Lavender Sky', icon: '💜' },
    { name: 'Misty Morning', icon: '🌫️' },
    { name: 'Rainy Calm', icon: '🌦️' },
    { name: 'Stormy Horizon', icon: '⛈️' },
    { name: 'Cotton Clouds', icon: '☁️' },
    { name: 'Ocean Breeze', icon: '🌊' },
    { name: 'Arctic Twilight', icon: '❄️' },
    { name: 'Galaxy Dreams', icon: '🌌' },
    { name: 'Comet Trail', icon: '☄️' },
    { name: 'Northern Lights', icon: '🌈' },
    { name: 'Sakura Sky', icon: '🌸' },
    { name: 'Amber Evening', icon: '🧡' },
    { name: 'Crystal Dawn', icon: '💎' },
    { name: 'Velvet Night', icon: '🌑' },
    { name: 'Dreamy Horizon', icon: '🌤️' }
];

const SKY_GRADIENTS = [
    ['#0c0414', '#220836', '#621658', '#ad2e66', '#e56d62', '#ffc266'],
    ['#0f172a', '#1e1b4b', '#5b21b6', '#b91c1c', '#f97316', '#fde047'],
    ['#170b2c', '#4a1a52', '#993a70', '#e06f88', '#ffe6b8'],
    ['#180e29', '#38143e', '#781c53', '#b92b60', '#ff8a5c'],
    ['#03010a', '#0e0b28', '#231847', '#3b2563', '#57367c'],
    ['#1e1022', '#4a153b', '#9a2c4e', '#d96b43', '#facc15'],
    ['#020617', '#0f172a', '#1e1b4b', '#312e81', '#4338ca'],
    ['#020617', '#090d16', '#111827', '#1f2937', '#374151'],
    ['#050515', '#0f172a', '#065f46', '#0d9488', '#2dd4bf', '#a7f3d0'],
    ['#1e0b26', '#4a1038', '#86195c', '#be185d', '#f472b6', '#fbcfe8'],
    ['#0c4a6e', '#0284c7', '#0369a1', '#38bdf8', '#7dd3fc', '#e0f2fe'],
    ['#1e293b', '#334155', '#475569', '#64748b', '#94a3b8', '#cbd5e1'],
    ['#020617', '#0f172a', '#1e293b', '#334155', '#475569', '#e2e8f0'],
    ['#030712', '#0c0a20', '#1a103c', '#2e1065', '#581c87'],
    ['#1a0505', '#450a0a', '#7f1d1d', '#991b1b', '#dc2626', '#f87171'],
    ['#1e1b4b', '#3730a3', '#5b21b6', '#7c3aed', '#a855f7', '#e9d5ff'],
    ['#0f172a', '#1e293b', '#334155', '#52525b', '#71717a', '#d4d4d8'],
    ['#09131d', '#132336', '#1c3552', '#2a4c73', '#416896', '#6f96c2'],
    ['#050811', '#0f172a', '#1e293b', '#334155', '#475569', '#94a3b8'],
    ['#1e1b4b', '#4338ca', '#6366f1', '#818cf8', '#a5b4fc', '#e0e7ff'],
    ['#042f2e', '#0d9488', '#14b8a6', '#2dd4bf', '#5eead4', '#ccfbf1'],
    ['#030712', '#0f172a', '#164e63', '#0891b2', '#22d3ee', '#cffaff'],
    ['#05030f', '#18072b', '#33084d', '#580c7a', '#8b12b3', '#d946ef'],
    ['#020617', '#0f172a', '#1e1b4b', '#3730a3', '#4f46e5', '#a5b4fc'],
    ['#030712', '#064e3b', '#047857', '#059669', '#10b981', '#6ee7b7'],
    ['#2a081a', '#5c1038', '#991b5c', '#c02673', '#e11d48', '#fda4af'],
    ['#1c0a00', '#451a03', '#78350f', '#92400e', '#b45309', '#fef08a'],
    ['#0c0a20', '#1e1b4b', '#312e81', '#4338ca', '#6366f1', '#e0e7ff'],
    ['#02040a', '#080d1a', '#0f172a', '#1e293b', '#334155'],
    ['#1a0c27', '#421447', '#731c63', '#ad2879', '#e0569a', '#fbcfe8']
];

let audioEnabled = true;
let audioCtx = null;

// ── PALETTE MATCHING CHERRY.JPG ────────────────────────────────
const BLOSSOM_COLORS = [
    { fill: '#7b1fa2', shadow: '#4a0072', center: '#aa26d0' }, // Deep Violet Base
    { fill: '#9c27b0', shadow: '#6a0080', center: '#c834e0' }, // Rich Purple
    { fill: '#ab47bc', shadow: '#7b1fa2', center: '#e056f0' }, // Vibrant Magenta
    { fill: '#ce93d8', shadow: '#9c27b0', center: '#f570ff' }, // Soft Lavender
    { fill: '#f3e5f5', shadow: '#ab47bc', center: '#ffffff' }  // Glowing Pink White
];

const WOOD_COLORS = {
    dark: '#22081c',
    mid: '#421235',
    light: '#6e204c',
    accent: '#9c346a'
};

const blossomSprites = [];
const drapeSprites = [];
const petalSprites = [];
const cherrySprites = [];

function getThemeBlossomColors(themeIdx) {
    const autumnThemes = [1, 5, 14, 26];
    const violetThemes = [4, 6, 7, 13, 15, 22, 23, 28];
    const frostThemes = [8, 10, 17, 18, 20, 21, 24];

    if (autumnThemes.includes(themeIdx)) {
        return [
            { fill: '#b91c1c', shadow: '#7f1d1d', center: '#f97316' },
            { fill: '#c2410c', shadow: '#9a3412', center: '#fbbf24' },
            { fill: '#d97706', shadow: '#b45309', center: '#fef08a' },
            { fill: '#eab308', shadow: '#ca8a04', center: '#ffffff' },
            { fill: '#fef08a', shadow: '#f59e0b', center: '#ffffff' }
        ];
    } else if (violetThemes.includes(themeIdx)) {
        return [
            { fill: '#4c1d95', shadow: '#2e1065', center: '#a855f7' },
            { fill: '#6b21a8', shadow: '#4c1d95', center: '#c084fc' },
            { fill: '#7e22ce', shadow: '#581c87', center: '#e9d5ff' },
            { fill: '#a855f7', shadow: '#7e22ce', center: '#f5d0fe' },
            { fill: '#e9d5ff', shadow: '#a855f7', center: '#ffffff' }
        ];
    } else if (frostThemes.includes(themeIdx)) {
        return [
            { fill: '#0369a1', shadow: '#0c4a6e', center: '#38bdf8' },
            { fill: '#0284c7', shadow: '#0369a1', center: '#7dd3fc' },
            { fill: '#0d9488', shadow: '#047857', center: '#5eead4' },
            { fill: '#38bdf8', shadow: '#0284c7', center: '#e0f2fe' },
            { fill: '#e0f2fe', shadow: '#38bdf8', center: '#ffffff' }
        ];
    } else {
        return [
            { fill: '#7b1fa2', shadow: '#4a0072', center: '#aa26d0' },
            { fill: '#9c27b0', shadow: '#6a0080', center: '#c834e0' },
            { fill: '#ab47bc', shadow: '#7b1fa2', center: '#e056f0' },
            { fill: '#ce93d8', shadow: '#9c27b0', center: '#f570ff' },
            { fill: '#f3e5f5', shadow: '#ab47bc', center: '#ffffff' }
        ];
    }
}

function preRenderSprites() {
    blossomSprites.length = 0;
    drapeSprites.length = 0;
    petalSprites.length = 0;

    const themeColors = getThemeBlossomColors(currentSkyIndex);

    // Pre-render Blossom Sprites
    const sizes = [14, 20, 28];
    themeColors.forEach(c => {
        sizes.forEach(s => {
            const canvas = document.createElement('canvas');
            const dim = s * 2.6;
            canvas.width = Math.ceil(dim);
            canvas.height = Math.ceil(dim);
            const ctx = canvas.getContext('2d');
            const center = dim / 2;

            ctx.save();
            ctx.translate(center, center);

            // Glowing Underside Light Base
            const glowGrad = ctx.createRadialGradient(0, 0, 0, 0, 0, s * 1.2);
            glowGrad.addColorStop(0, 'rgba(255, 140, 255, 0.45)');
            glowGrad.addColorStop(0.6, 'rgba(180, 40, 200, 0.2)');
            glowGrad.addColorStop(1, 'rgba(0, 0, 0, 0)');
            ctx.beginPath();
            ctx.arc(0, 0, s * 1.2, 0, Math.PI * 2);
            ctx.fillStyle = glowGrad;
            ctx.fill();

            // 5 Petals
            for (let i = 0; i < 5; i++) {
                ctx.save();
                ctx.rotate((i * Math.PI * 2) / 5);
                ctx.beginPath();
                ctx.moveTo(0, 0);
                ctx.bezierCurveTo(-s * 0.55, -s * 0.7, -s * 0.4, -s * 1.25, 0, -s * 1.3);
                ctx.bezierCurveTo(s * 0.4, -s * 1.25, s * 0.55, -s * 0.7, 0, 0);

                const pGrad = ctx.createLinearGradient(0, 0, 0, -s * 1.3);
                pGrad.addColorStop(0, c.shadow);
                pGrad.addColorStop(0.55, c.fill);
                pGrad.addColorStop(1, c.center);

                ctx.fillStyle = pGrad;
                ctx.fill();
                ctx.restore();
            }

            ctx.beginPath();
            ctx.arc(0, 0, s * 0.25, 0, Math.PI * 2);
            ctx.fillStyle = '#fff2a8';
            ctx.fill();
            ctx.restore();

            blossomSprites.push(canvas);
        });
    });

    // Pre-render Vertical Weeping Drape / Tendril Sprites (cherry.jpg signature feature)
    [40, 70, 100].forEach(len => {
        const canvas = document.createElement('canvas');
        canvas.width = 16;
        canvas.height = len;
        const ctx = canvas.getContext('2d');

        const grad = ctx.createLinearGradient(8, 0, 8, len);
        grad.addColorStop(0, 'rgba(240, 130, 255, 0.95)');
        grad.addColorStop(0.5, 'rgba(180, 50, 220, 0.75)');
        grad.addColorStop(1, 'rgba(120, 20, 160, 0)');

        ctx.beginPath();
        ctx.moveTo(8, 0);
        ctx.lineTo(8, len);
        ctx.strokeStyle = grad;
        ctx.lineWidth = 3;
        ctx.stroke();

        // Glowing Crystal Droplets
        for (let y = 10; y < len - 10; y += 14) {
            ctx.beginPath();
            ctx.arc(8, y, 2.5, 0, Math.PI * 2);
            ctx.fillStyle = 'rgba(255, 200, 255, 0.9)';
            ctx.fill();
        }

        drapeSprites.push(canvas);
    });

    // Pre-render Falling Petals
    BLOSSOM_COLORS.forEach(c => {
        [12, 16, 22].forEach(s => {
            const canvas = document.createElement('canvas');
            const w = s * 1.5;
            const h = s * 1.8;
            canvas.width = Math.ceil(w);
            canvas.height = Math.ceil(h);
            const ctx = canvas.getContext('2d');

            ctx.translate(w / 2, h - 2);
            ctx.beginPath();
            ctx.moveTo(0, 0);
            ctx.bezierCurveTo(-s * 0.6, -s * 0.5, -s * 0.4, -s * 1.2, 0, -s * 1.3);
            ctx.bezierCurveTo(s * 0.4, -s * 1.2, s * 0.6, -s * 0.5, 0, 0);

            const grad = ctx.createLinearGradient(0, 0, 0, -s * 1.3);
            grad.addColorStop(0, c.shadow);
            grad.addColorStop(0.6, c.fill);
            grad.addColorStop(1, c.center);

            ctx.fillStyle = grad;
            ctx.fill();

            petalSprites.push(canvas);
        });
    });

    // Pre-render Ripe Cherry Fruit Pair Sprites (🍒)
    cherrySprites.length = 0;
    [14, 18, 22].forEach(s => {
        const canvas = document.createElement('canvas');
        canvas.width = Math.ceil(s * 1.8);
        canvas.height = Math.ceil(s * 2.2);
        const ctx = canvas.getContext('2d');
        const midX = canvas.width / 2;

        // Curved Green Stem
        ctx.strokeStyle = '#22c55e';
        ctx.lineWidth = 1.8;
        ctx.beginPath();
        ctx.moveTo(midX, 2);
        ctx.quadraticCurveTo(midX - 4, s * 0.6, midX - 5, s * 1.1);
        ctx.moveTo(midX, 2);
        ctx.quadraticCurveTo(midX + 4, s * 0.6, midX + 5, s * 1.2);
        ctx.stroke();

        // Leaf at stem top
        ctx.fillStyle = '#15803d';
        ctx.beginPath();
        ctx.ellipse(midX - 2, 3, 4, 2, -0.4, 0, Math.PI * 2);
        ctx.fill();

        // Left Cherry Fruit (Ruby Red)
        ctx.beginPath();
        ctx.arc(midX - 5, s * 1.1 + 4, s * 0.28, 0, Math.PI * 2);
        ctx.fillStyle = '#dc2626';
        ctx.fill();
        ctx.beginPath();
        ctx.arc(midX - 6.5, s * 1.1 + 2.5, s * 0.09, 0, Math.PI * 2);
        ctx.fillStyle = '#f87171';
        ctx.fill();

        // Right Cherry Fruit
        ctx.beginPath();
        ctx.arc(midX + 5, s * 1.2 + 4, s * 0.3, 0, Math.PI * 2);
        ctx.fillStyle = '#b91c1c';
        ctx.fill();
        ctx.beginPath();
        ctx.arc(midX + 3.5, s * 1.2 + 2.5, s * 0.1, 0, Math.PI * 2);
        ctx.fillStyle = '#fca5a5';
        ctx.fill();

        cherrySprites.push(canvas);
    });
}
preRenderSprites();

// ── RESIZE & HI-DPI SETUP ──────────────────────────────────────
function resize() {
    W = window.innerWidth;
    H = window.innerHeight;

    [sCanvas, tCanvas, pCanvas].forEach(c => {
        c.width = W;
        c.height = H;
        c.style.width = W + 'px';
        c.style.height = H + 'px';
    });

    if (sceneActive) {
        build3DTree();
        drawSky();
    }
}
window.addEventListener('resize', resize);

// ── 3D PERSPECTIVE PROJECTION ENGINE ───────────────────────────
function project3D(x, y, z, rX, rY) {
    const cosY = Math.cos(rY), sinY = Math.sin(rY);
    const x1 = x * cosY - z * sinY;
    const z1 = x * sinY + z * cosY;

    const cosX = Math.cos(rX), sinX = Math.sin(rX);
    const y2 = y * cosX - z1 * sinX;
    const z2 = y * sinX + z1 * cosX;

    const isMobile = W < 600;
    const cameraFov = isMobile ? 650 : 720;
    const cameraDist = isMobile ? 960 : 860;
    const scale = cameraFov / (cameraDist + z2);

    const screenX = W * 0.5 + x1 * scale;
    const screenY = H * (isMobile ? 0.68 : 0.70) - y2 * scale;

    return {
        x: screenX,
        y: screenY,
        z: z2,
        scale: Math.max(0.08, scale)
    };
}

// ── 3D PROCEDURAL TREE MODEL (CHERRY.JPG STYLE) ────────────────
class Branch3D {
    constructor(x, y, z, length, thickness, pitch, yaw, depth, maxDepth) {
        this.startX = x;
        this.startY = y;
        this.startZ = z;
        this.length = length;
        this.thickness = thickness;
        this.pitch = pitch;
        this.yaw = yaw;
        this.depth = depth;
        this.maxDepth = maxDepth;

        // Twisted spiral displacement matching cherry.jpg trunk
        const spiralTwist = depth === 1 ? 0.35 * Math.sin(y * 0.02) : 0;
        const finalYaw = yaw + spiralTwist;

        const dx = Math.sin(pitch) * Math.cos(finalYaw) * length;
        const dy = Math.cos(pitch) * length;
        const dz = Math.sin(pitch) * Math.sin(finalYaw) * length;

        this.endX = x + dx;
        this.endY = y + dy;
        this.endZ = z + dz;

        // Organic 3D curvature midpoint for realistic gnarled boughs
        const curveAmount = (Math.random() - 0.5) * length * 0.24;
        this.midX = (x + this.endX) * 0.5 + Math.sin(yaw + Math.PI * 0.5) * curveAmount;
        this.midY = (y + this.endY) * 0.5 + (Math.random() - 0.5) * length * 0.14;
        this.midZ = (z + this.endZ) * 0.5 + Math.cos(yaw + Math.PI * 0.5) * curveAmount;

        this.children = [];
        this.clusters = [];
        this.drapes = [];
        this.phase = Math.random() * Math.PI * 2;
    }
}


let tree3DRoot = null;
const all3DClusters = [];
const all3DBranches = [];
const all3DDrapes = [];
const all3DCherries = [];

function build3DTree() {
    all3DClusters.length = 0;
    all3DBranches.length = 0;
    all3DDrapes.length = 0;
    all3DCherries.length = 0;

    const isMobile = W < 600;
    const sizeMult = isMobile ? 0.82 : 1.0;
    const trunkLength = Math.min(W, H) * 0.23 * sizeMult;
    const trunkThickness = Math.min(W, H) * 0.046 * sizeMult;

    tree3DRoot = new Branch3D(0, 0, 0, trunkLength, trunkThickness, 0, 0, 1, 5);
    grow3DBranch(tree3DRoot);
}


function grow3DBranch(node) {
    all3DBranches.push(node);

    if (node.depth >= node.maxDepth) {
        // Generate massive wide dome canopy clusters matching cherry.jpg
        const numClusters = 5 + Math.floor(Math.random() * 4);
        for (let i = 0; i < numClusters; i++) {
            const sprite = blossomSprites[Math.floor(Math.random() * blossomSprites.length)];
            const cluster = {
                x: node.endX + (Math.random() - 0.5) * 60,
                y: node.endY + (Math.random() - 0.5) * 40,
                z: node.endZ + (Math.random() - 0.5) * 60,
                sprite: sprite,
                phase: Math.random() * Math.PI * 2
            };
            node.clusters.push(cluster);
            all3DClusters.push(cluster);

            // Hanging weeping drapes from outer canopy edges
            if (Math.random() < 0.6) {
                const drapeSprite = drapeSprites[Math.floor(Math.random() * drapeSprites.length)];
                const drape = {
                    x: cluster.x,
                    y: cluster.y - 10,
                    z: cluster.z,
                    sprite: drapeSprite
                };
                node.drapes.push(drape);
                all3DDrapes.push(drape);
            }

            // Hanging Ripe Cherries (🍒)
            if (Math.random() < 0.65 && cherrySprites.length > 0) {
                const cherrySprite = cherrySprites[Math.floor(Math.random() * cherrySprites.length)];
                const cherry = {
                    x: cluster.x + (Math.random() - 0.5) * 20,
                    y: cluster.y - 12,
                    z: cluster.z + (Math.random() - 0.5) * 20,
                    sprite: cherrySprite
                };
                all3DCherries.push(cherry);
            }
        }
        return;
    }

    // Umbrella dome branching ratio
    const numChildren = node.depth === 1 ? 5 : (Math.random() < 0.4 ? 4 : 3);
    const lengthRatio = 0.74 + Math.random() * 0.1;
    const thicknessRatio = 0.64 + Math.random() * 0.1;

    for (let i = 0; i < numChildren; i++) {
        const yawSpread = (i / numChildren) * Math.PI * 2 + (Math.random() - 0.5) * 0.4;
        // Outer branches spread horizontally to form the wide dome canopy
        const pitchSpread = node.depth === 1 ? 0.35 + (i * 0.18) : (0.6 + Math.random() * 0.5);

        const childNode = new Branch3D(
            node.endX,
            node.endY,
            node.endZ,
            node.length * lengthRatio,
            node.thickness * thicknessRatio,
            pitchSpread,
            yawSpread,
            node.depth + 1,
            node.maxDepth
        );

        node.children.push(childNode);
        grow3DBranch(childNode);
    }

    if (node.depth >= 3) {
        const numMid = 3;
        for (let i = 0; i < numMid; i++) {
            const sprite = blossomSprites[Math.floor(Math.random() * blossomSprites.length)];
            const cluster = {
                x: node.endX + (Math.random() - 0.5) * 45,
                y: node.endY + (Math.random() - 0.5) * 35,
                z: node.endZ + (Math.random() - 0.5) * 45,
                sprite: sprite,
                phase: Math.random() * Math.PI * 2
            };
            node.clusters.push(cluster);
            all3DClusters.push(cluster);
        }
    }
}

// ── 3D FALLING PETAL PARTICLES ─────────────────────────────────
class Petal3D {
    constructor() {
        this.active = false;
        this.delay = 0;
        this.onGround = false;
        this.opacity = 0;
    }

    spawn(staggerDelay = 0) {
        this.active = true;
        this.delay = staggerDelay;
        this.onGround = false;
        this.life = 0;
        this.maxLife = 350 + Math.random() * 250;

        let spawnX = 0, spawnY = 250, spawnZ = 0;

        if (all3DBranches.length > 0 && Math.random() < 0.8) {
            const upperBranches = all3DBranches.filter(b => b.depth >= 2);
            const bList = upperBranches.length > 0 ? upperBranches : all3DBranches;
            const branch = bList[Math.floor(Math.random() * bList.length)];

            const t = Math.random();
            spawnX = branch.startX + (branch.endX - branch.startX) * t;
            spawnY = branch.startY + (branch.endY - branch.startY) * t;
            spawnZ = branch.startZ + (branch.endZ - branch.startZ) * t;
        } else if (all3DClusters.length > 0) {
            const c = all3DClusters[Math.floor(Math.random() * all3DClusters.length)];
            spawnX = c.x;
            spawnY = c.y;
            spawnZ = c.z;
        }

        this.x = spawnX + (Math.random() - 0.5) * 35;
        this.y = spawnY + (Math.random() - 0.5) * 20;
        this.z = spawnZ + (Math.random() - 0.5) * 35;

        const outwardDir = spawnX >= 0 ? 1 : -1;
        this.vx = outwardDir * (0.2 + Math.random() * 0.5);
        this.vy = -(0.7 + Math.random() * 0.6);
        this.vz = (Math.random() - 0.5) * 0.6;

        this.rotZ = (Math.random() - 0.5) * 0.4;
        this.vRotZ = 0;

        this.sprite = petalSprites[Math.floor(Math.random() * petalSprites.length)];
        this.opacity = 0.8 + Math.random() * 0.2;
    }

    update(wind) {
        if (!this.active) return;

        if (this.delay > 0) {
            this.delay--;
            return;
        }

        if (this.onGround) {
            this.life++;
            if (this.life > this.maxLife - 50) {
                this.opacity = Math.max(0, (this.maxLife - this.life) / 50);
                if (this.opacity <= 0) {
                    this.active = false;
                }
            }
            return;
        }

        this.vy -= 0.012; // Direct downward gravity acceleration
        this.vx += wind * 0.1; // Clean wind drift

        this.vx *= 0.98;
        this.vy *= 0.98;
        this.vz *= 0.98;

        this.x += this.vx;
        this.y += this.vy;
        this.z += this.vz;

        if (this.y <= 0) {
            this.y = 0;
            this.onGround = true;
            this.vy = 0;
            this.vx = 0;
            this.vz = 0;
        }

        if (this.x < -W || this.x > W || this.z < -900 || this.z > 900) {
            this.active = false;
        }
    }
}

const particles3D = [];
let leafReleaseTimer = 0;

function triggerLeafFallBatch() {
    // Release 2 to 3 leaves
    const count = 2 + Math.floor(Math.random() * 2);
    let released = 0;
    for (let p of particles3D) {
        if (!p.active) {
            p.spawn(released * 30 + Math.floor(Math.random() * 20));
            released++;
            if (released >= count) break;
        }
    }
}

function init3DParticles() {
    particles3D.length = 0;
    for (let i = 0; i < 20; i++) {
        particles3D.push(new Petal3D());
    }
    leafReleaseTimer = 0;
    triggerLeafFallBatch();
}


// ── SUNSET SKY & ENVIRONMENT (MATCHING CHERRY.JPG) ─────────────
let stars = [];
for (let i = 0; i < 90; i++) {
    stars.push({ x: Math.random(), y: Math.random() * 0.65, size: 1 + Math.random() * 1.5 });
}

function drawSky() {
    sCtx.clearRect(0, 0, W, H);

    const skyGrad = sCtx.createLinearGradient(0, 0, 0, H);
    const themeIdx = currentSkyIndex % SKY_THEMES.length;
    const colorStops = SKY_GRADIENTS[themeIdx] || SKY_GRADIENTS[0];

    for (let i = 0; i < colorStops.length; i++) {
        skyGrad.addColorStop(i / (colorStops.length - 1), colorStops[i]);
    }

    sCtx.fillStyle = skyGrad;
    sCtx.fillRect(0, 0, W, H);

    // Sun / Moon Disc & Atmosphere Radiant Glow
    const cx = W * 0.72;
    const cy = H * 0.32;
    const sunGrad = sCtx.createRadialGradient(cx, cy, 0, cx, cy, 190);

    const isNightTheme = [4, 6, 7, 8, 12, 13, 22, 23, 24, 28].includes(themeIdx);
    sunGrad.addColorStop(0, isNightTheme ? 'rgba(230, 210, 255, 0.95)' : 'rgba(255, 240, 190, 0.95)');
    sunGrad.addColorStop(0.35, isNightTheme ? 'rgba(160, 120, 255, 0.5)' : 'rgba(255, 140, 110, 0.55)');
    sunGrad.addColorStop(0.7, isNightTheme ? 'rgba(100, 50, 200, 0.2)' : 'rgba(200, 50, 120, 0.2)');
    sunGrad.addColorStop(1, 'rgba(0,0,0,0)');

    sCtx.beginPath();
    sCtx.arc(cx, cy, 190, 0, Math.PI * 2);
    sCtx.fillStyle = sunGrad;
    sCtx.fill();

    sCtx.beginPath();
    sCtx.arc(cx, cy, 40, 0, Math.PI * 2);
    sCtx.fillStyle = isNightTheme ? '#f8f4ff' : '#fff8eb';
    sCtx.fill();

    // Luminous Stars
    const starAlpha = isNightTheme ? 0.85 : 0.45;
    sCtx.fillStyle = `rgba(255, 250, 235, ${starAlpha})`;
    stars.forEach(s => {
        sCtx.beginPath();
        sCtx.arc(s.x * W, s.y * H, s.size, 0, Math.PI * 2);
        sCtx.fill();
    });
}

// ── SWIMMING ELEGANT SWANS FAMILY ANIMATION (FLY IN ONCE & SWIM PERMANENTLY) ──
let swanFlyTimer = 0;
let swansLanded = false;
let swanSwimProgress = 0.20;
let swanSwimDirection = 1;

function drawSwimmingSwans(ctx, pondX, pondY, pRadX, pRadY) {
    const isMobile = W < 600;
    const pondRadiusX = pRadX || W * (isMobile ? 0.35 : 0.25);

    let leadX = 0;
    let leadY = 0;
    let isFlying = false;

    if (!swansLanded) {
        swanFlyTimer += 0.016;

        const startX = -W * 0.25;
        const startY = H * 0.06;
        const targetX = pondX - pondRadiusX * 0.4;
        const targetY = pondY + Math.sin(time * 2.0) * 3 - H * 0.005;

        if (swanFlyTimer < 6.5) {
            const p = swanFlyTimer / 6.5;
            const easeP = Math.sin((p * Math.PI) / 2);
            leadX = startX + (targetX - startX) * easeP;
            leadY = startY + (targetY - startY) * easeP;
            isFlying = true;
        } else {
            swansLanded = true;
            swanSwimProgress = 0.30;
        }
    }

    if (swansLanded) {
        // Permanent Swimming on Pond (Never loops back to flying!)
        swanSwimProgress += 0.0015 * swanSwimDirection;
        if (swanSwimProgress > 0.82) {
            swanSwimProgress = 0.82;
            swanSwimDirection = -1;
        } else if (swanSwimProgress < 0.18) {
            swanSwimProgress = 0.18;
            swanSwimDirection = 1;
        }

        leadX = pondX - pondRadiusX + swanSwimProgress * (pondRadiusX * 2);
        leadY = pondY + Math.sin(time * 2.0) * 3 - H * 0.005;
        isFlying = false;
    }

    // Elegant Swan Family Array (Adult Swans & Baby Cygnets)
    const swans = [
        { type: 'royal', offsetX: 0, offsetY: 0, scale: isMobile ? 0.80 : 1.10 },
        { type: 'partner', offsetX: -32 * (isFlying ? 1 : swanSwimDirection), offsetY: 3, scale: isMobile ? 0.75 : 1.05 },
        { type: 'cygnet', offsetX: -55 * (isFlying ? 1 : swanSwimDirection), offsetY: 6, scale: isMobile ? 0.42 : 0.58 },
        { type: 'cygnet', offsetX: -72 * (isFlying ? 1 : swanSwimDirection), offsetY: 9, scale: isMobile ? 0.38 : 0.52 }
    ];

    swans.forEach(s => {
        const sx = leadX + s.offsetX;
        const sy = leadY + s.offsetY;

        ctx.save();
        ctx.translate(sx, sy);

        if (!isFlying) {
            const ripPhase = (time * 2.8 + s.offsetX * 0.1) % (Math.PI * 2);
            ctx.beginPath();
            ctx.ellipse(-10 * swanSwimDirection, 4, 12 + Math.sin(ripPhase) * 3, 3.5 + Math.sin(ripPhase) * 1.2, 0, 0, Math.PI * 2);
            ctx.strokeStyle = 'rgba(210, 240, 255, 0.45)';
            ctx.lineWidth = 1.2;
            ctx.stroke();

            ctx.scale(swanSwimDirection * s.scale, s.scale);
        } else {
            ctx.scale(s.scale, s.scale);
            const wingFlap = Math.sin(swanFlyTimer * 16 + s.offsetX * 0.1) * 14;
            ctx.fillStyle = '#ffffff';
            ctx.beginPath();
            ctx.moveTo(0, -6);
            ctx.quadraticCurveTo(-10, -22 + wingFlap, -22, -10 + wingFlap);
            ctx.lineTo(-2, -2);
            ctx.fill();

            ctx.beginPath();
            ctx.moveTo(0, -6);
            ctx.quadraticCurveTo(10, -22 + wingFlap, 22, -10 + wingFlap);
            ctx.lineTo(2, -2);
            ctx.fill();
        }

        const neckSway = Math.sin(time * 3 + s.offsetX * 0.2) * 1.5;

        if (s.type === 'royal' || s.type === 'partner' || s.type === 'graceful') {
            if (!isFlying) {
                ctx.beginPath();
                ctx.ellipse(0, 3, 14, 5, 0, 0, Math.PI * 2);
                ctx.fillStyle = 'rgba(15, 23, 42, 0.25)';
                ctx.fill();
            }

            ctx.beginPath();
            ctx.ellipse(0, -2, 15, 9, 0, 0, Math.PI * 2);
            ctx.fillStyle = '#ffffff';
            ctx.fill();
            ctx.strokeStyle = '#e2e8f0';
            ctx.lineWidth = 1.0;
            ctx.stroke();

            if (!isFlying) {
                ctx.beginPath();
                ctx.ellipse(-2, -4, 10, 5, -0.2, 0, Math.PI * 2);
                ctx.fillStyle = '#f8fafc';
                ctx.fill();
            }

            ctx.beginPath();
            ctx.moveTo(-13, -2);
            ctx.lineTo(-20, -7);
            ctx.lineTo(-12, -4);
            ctx.fillStyle = '#ffffff';
            ctx.fill();

            ctx.beginPath();
            ctx.moveTo(7, -6);
            ctx.bezierCurveTo(14, -18 + neckSway, 8, -28 + neckSway, 12, -32 + neckSway);
            ctx.strokeStyle = '#ffffff';
            ctx.lineWidth = 4.2;
            ctx.lineCap = 'round';
            ctx.stroke();

            ctx.beginPath();
            ctx.arc(12, -32 + neckSway, 4.2, 0, Math.PI * 2);
            ctx.fillStyle = '#ffffff';
            ctx.fill();

            ctx.beginPath();
            ctx.arc(13.5, -33 + neckSway, 0.9, 0, Math.PI * 2);
            ctx.fillStyle = '#0f172a';
            ctx.fill();

            ctx.beginPath();
            ctx.arc(14.5, -32.5 + neckSway, 1.2, 0, Math.PI * 2);
            ctx.fillStyle = '#0f172a';
            ctx.fill();

            ctx.beginPath();
            ctx.moveTo(15.5, -33 + neckSway);
            ctx.lineTo(21, -30.5 + neckSway);
            ctx.lineTo(15.5, -28 + neckSway);
            ctx.fillStyle = '#f97316';
            ctx.fill();

        } else {
            ctx.beginPath();
            ctx.ellipse(0, -1, 9, 6, 0, 0, Math.PI * 2);
            ctx.fillStyle = '#cbd5e1';
            ctx.fill();

            ctx.beginPath();
            ctx.moveTo(4, -3);
            ctx.quadraticCurveTo(8, -10 + neckSway, 7, -15 + neckSway);
            ctx.strokeStyle = '#cbd5e1';
            ctx.lineWidth = 3.0;
            ctx.stroke();

            ctx.beginPath();
            ctx.arc(7, -15 + neckSway, 3.2, 0, Math.PI * 2);
            ctx.fillStyle = '#cbd5e1';
            ctx.fill();

            ctx.beginPath();
            ctx.arc(8, -16 + neckSway, 0.8, 0, Math.PI * 2);
            ctx.fillStyle = '#0f172a';
            ctx.fill();

            ctx.beginPath();
            ctx.moveTo(9.5, -15 + neckSway);
            ctx.lineTo(13.5, -14 + neckSway);
            ctx.lineTo(9.5, -13 + neckSway);
            ctx.fillStyle = '#475569';
            ctx.fill();
        }

        ctx.restore();
    });
}

// ── FLYING & WATER-LANDING MALLARD DUCK ENGINE (FLY IN ONCE & SWIM PERMANENTLY) ──
let duckFlyTimer = 0;
let duckLanded = false;

function drawFlyingLandingDuck(ctx, pondX, pondY) {
    const isMobile = W < 600;
    const scale = isMobile ? 0.75 : 1.0;

    const startX = -W * 0.15;
    const startY = H * 0.12;
    const targetX = pondX - W * (isMobile ? 0.06 : 0.08);
    const targetY = pondY + Math.sin(time * 2.2) * 3;

    let duckX = targetX;
    let duckY = targetY;
    let isFlying = false;
    let isLanding = false;

    if (!duckLanded) {
        duckFlyTimer += 0.016;

        if (duckFlyTimer < 7.0) {
            // Phase 1: Flying in from high left sky
            const p = duckFlyTimer / 7.0;
            const easeP = Math.sin((p * Math.PI) / 2);
            duckX = startX + (targetX - startX) * easeP;
            duckY = startY + (targetY - startY) * easeP;
            isFlying = true;

        } else if (duckFlyTimer >= 7.0 && duckFlyTimer < 8.5) {
            // Phase 2: Touchdown & Water Splash
            const p = (duckFlyTimer - 7.0) / 1.5;
            duckX = targetX + p * 15;
            duckY = targetY;
            isLanding = true;

        } else {
            // Touchdown complete -> Stays PERMANENTLY swimming on the pond!
            duckLanded = true;
        }
    }

    if (duckLanded) {
        // Permanent Swimming on Pond (Never re-flies!)
        duckX = targetX + 15 + Math.sin(time * 0.8) * 20;
        duckY = targetY + Math.sin(time * 2.5) * 2;
        isFlying = false;
        isLanding = false;
    }

    ctx.save();
    ctx.translate(duckX, duckY);
    ctx.scale(scale, scale);

    // Water Splash Ripples when touching down
    if (isLanding) {
        const splashRadius = (duckFlyTimer - 7.0) * 16;
        ctx.beginPath();
        ctx.ellipse(0, 4, 10 + splashRadius, 3 + splashRadius * 0.3, 0, 0, Math.PI * 2);
        ctx.strokeStyle = 'rgba(210, 240, 255, 0.8)';
        ctx.lineWidth = 1.5;
        ctx.stroke();
    } else if (!isFlying) {
        // Soft Swimming Water Ripple Ring
        const ripPhase = (time * 3) % (Math.PI * 2);
        ctx.beginPath();
        ctx.ellipse(0, 3, 10 + Math.sin(ripPhase) * 2, 3 + Math.sin(ripPhase) * 0.8, 0, 0, Math.PI * 2);
        ctx.strokeStyle = 'rgba(210, 240, 255, 0.4)';
        ctx.lineWidth = 1.0;
        ctx.stroke();
    }

    // Wing Flapping Animation when flying vs folded when swimming
    if (isFlying) {
        const wingFlap = Math.sin(duckFlyTimer * 18) * 14;
        ctx.fillStyle = '#451a03';
        ctx.beginPath();
        ctx.moveTo(0, -4);
        ctx.quadraticCurveTo(-6, -18 + wingFlap, -18, -8 + wingFlap);
        ctx.lineTo(-2, -2);
        ctx.fill();

        ctx.beginPath();
        ctx.moveTo(0, -4);
        ctx.quadraticCurveTo(6, -18 + wingFlap, 18, -8 + wingFlap);
        ctx.lineTo(2, -2);
        ctx.fill();
    }

    // Mallard Duck Body (Warm Brown)
    ctx.beginPath();
    ctx.ellipse(0, 0, 12, 7.5, 0, 0, Math.PI * 2);
    ctx.fillStyle = '#92400e';
    ctx.fill();

    // Folded Wing accent when on water
    if (!isFlying) {
        ctx.beginPath();
        ctx.ellipse(-2, 1, 7, 4, -0.2, 0, Math.PI * 2);
        ctx.fillStyle = '#451a03';
        ctx.fill();
    }

    // Tail Feathers
    ctx.beginPath();
    ctx.moveTo(-11, 0);
    ctx.lineTo(-17, -4);
    ctx.lineTo(-10, -2);
    ctx.fillStyle = '#1e293b';
    ctx.fill();

    // Emerald Green Head
    const headBob = isFlying ? 0 : Math.sin(time * 5) * 1.2;
    ctx.beginPath();
    ctx.arc(8, -7 + headBob, 6, 0, Math.PI * 2);
    ctx.fillStyle = '#0f766e';
    ctx.fill();

    // White Neck Ring
    ctx.beginPath();
    ctx.arc(8, -1.5 + headBob, 4.5, 0, Math.PI);
    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 1.8;
    ctx.stroke();

    // Dark Eye
    ctx.beginPath();
    ctx.arc(10, -8 + headBob, 1.1, 0, Math.PI * 2);
    ctx.fillStyle = '#0f172a';
    ctx.fill();

    // Bright Yellow Beak
    ctx.beginPath();
    ctx.moveTo(12, -7 + headBob);
    ctx.lineTo(19, -5 + headBob);
    ctx.lineTo(12, -3 + headBob);
    ctx.fillStyle = '#eab308';
    ctx.fill();

    ctx.restore();
}

// ── FLYING & WATER-DRINKING BIRD ANIMATION ─────────────────────
let birdState = 0; // 0: Flying down, 1: Drinking, 2: Flying away
let birdX = W * 0.85;
let birdY = H * 0.15;
let birdTimer = 0;

function drawDrinkingBirds(ctx, pondX, pondY) {
    const isMobile = W < 600;
    const targetX = pondX + W * (isMobile ? 0.14 : 0.16);
    const targetY = pondY - H * 0.01;

    if (birdState === 0) {
        birdX += (targetX - birdX) * 0.035;
        birdY += (targetY - birdY) * 0.035;

        if (Math.hypot(targetX - birdX, targetY - birdY) < 6) {
            birdX = targetX;
            birdY = targetY;
            birdState = 1;
            birdTimer = 0;
        }
    } else if (birdState === 1) {
        birdTimer += 0.016;
        if (birdTimer > 12) {
            birdState = 2;
        }
    } else if (birdState === 2) {
        birdX += (W * 0.9 - birdX) * 0.03;
        birdY += (H * 0.1 - birdY) * 0.03;

        if (birdX > W * 0.82 && birdY < H * 0.18) {
            birdX = W * 0.88;
            birdY = H * 0.12;
            birdState = 0;
        }
    }

    ctx.save();
    ctx.translate(birdX, birdY);

    const scale = isMobile ? 0.72 : 0.92;
    const dir = birdState === 2 ? 1 : -1;
    ctx.scale(dir * scale, scale);

    if (birdState === 0 || birdState === 2) {
        ctx.beginPath();
        ctx.ellipse(0, 0, 8, 4.5, -0.2, 0, Math.PI * 2);
        ctx.fillStyle = '#bae6fd';
        ctx.fill();

        ctx.beginPath();
        ctx.arc(7, -3, 3.5, 0, Math.PI * 2);
        ctx.fillStyle = '#0284c7';
        ctx.fill();

        ctx.beginPath();
        ctx.moveTo(10, -3);
        ctx.lineTo(14, -2);
        ctx.lineTo(10, -1);
        ctx.fillStyle = '#f97316';
        ctx.fill();

        ctx.beginPath();
        ctx.moveTo(-1, -2);
        ctx.quadraticCurveTo(-6, -14 * Math.sin(time * 16), -10, -4);
        ctx.fillStyle = '#0369a1';
        ctx.fill();

    } else {
        const dipCycle = Math.sin(birdTimer * 3.5);
        const headDipY = dipCycle > 0 ? dipCycle * 5 : 0;

        if (dipCycle > 0.8) {
            ctx.beginPath();
            ctx.ellipse(12, 4, 7, 2, 0, 0, Math.PI * 2);
            ctx.strokeStyle = 'rgba(210, 240, 255, 0.65)';
            ctx.lineWidth = 1.2;
            ctx.stroke();
        }

        ctx.beginPath();
        ctx.ellipse(0, 0, 8, 5, 0, 0, Math.PI * 2);
        ctx.fillStyle = '#bae6fd';
        ctx.fill();

        ctx.beginPath();
        ctx.arc(6.5, -3 + headDipY, 3.5, 0, Math.PI * 2);
        ctx.fillStyle = '#0284c7';
        ctx.fill();

        ctx.beginPath();
        ctx.moveTo(9.5, -3 + headDipY);
        ctx.lineTo(14, -1 + headDipY);
        ctx.lineTo(9.5, 1 + headDipY);
        ctx.fillStyle = '#f97316';
        ctx.fill();

        ctx.beginPath();
        ctx.ellipse(-2, -1, 5, 3, -0.3, 0, Math.PI * 2);
        ctx.fillStyle = '#0369a1';
        ctx.fill();
    }

    ctx.restore();
}

// ── CUTE BUNNIES / RABBITS ANIMATION ────────────────────────────
function drawBunnies(ctx) {
    const isMobile = W < 600;

    // Bunny 1: Sitting White Bunny on left hill
    const b1X = W * (isMobile ? 0.16 : 0.18);
    const b1Y = H * (isMobile ? 0.73 : 0.72);

    ctx.save();
    ctx.translate(b1X, b1Y);
    ctx.scale(isMobile ? 0.75 : 0.95, isMobile ? 0.75 : 0.95);

    // Body
    ctx.beginPath();
    ctx.ellipse(0, 0, 9, 7, -0.2, 0, Math.PI * 2);
    ctx.fillStyle = '#f8fafc';
    ctx.fill();

    // Fluffy Tail
    ctx.beginPath();
    ctx.arc(-9, 2, 3, 0, Math.PI * 2);
    ctx.fillStyle = '#ffffff';
    ctx.fill();

    // Head
    ctx.beginPath();
    ctx.arc(6, -5, 5.5, 0, Math.PI * 2);
    ctx.fillStyle = '#f8fafc';
    ctx.fill();

    // Twitching Ears
    const earTwitch = Math.sin(time * 4) * 0.12;
    // Ear 1
    ctx.save();
    ctx.translate(5, -9);
    ctx.rotate(-0.1 + earTwitch);
    ctx.beginPath();
    ctx.ellipse(0, -6, 2.2, 6, 0, 0, Math.PI * 2);
    ctx.fillStyle = '#f8fafc';
    ctx.fill();
    ctx.beginPath();
    ctx.ellipse(0, -6, 1.2, 4.5, 0, 0, Math.PI * 2);
    ctx.fillStyle = '#f472b6';
    ctx.fill();
    ctx.restore();

    // Ear 2
    ctx.save();
    ctx.translate(8, -9);
    ctx.rotate(0.15 - earTwitch);
    ctx.beginPath();
    ctx.ellipse(0, -6, 2.2, 6, 0, 0, Math.PI * 2);
    ctx.fillStyle = '#f8fafc';
    ctx.fill();
    ctx.beginPath();
    ctx.ellipse(0, -6, 1.2, 4.5, 0, 0, Math.PI * 2);
    ctx.fillStyle = '#f472b6';
    ctx.fill();
    ctx.restore();

    // Eye
    ctx.beginPath();
    ctx.arc(8, -6, 0.9, 0, Math.PI * 2);
    ctx.fillStyle = '#0f172a';
    ctx.fill();

    // Pink Nose
    ctx.beginPath();
    ctx.arc(10.5, -4, 0.8, 0, Math.PI * 2);
    ctx.fillStyle = '#ec4899';
    ctx.fill();
    ctx.restore();

    // Bunny 2: Hopping Brown Bunny on hill
    const b2X = W * (isMobile ? 0.22 : 0.24);
    const hopY = Math.max(0, Math.sin(time * 3.2) * 7);
    const b2Y = H * (isMobile ? 0.74 : 0.73) - hopY;

    ctx.save();
    ctx.translate(b2X, b2Y);
    ctx.scale(isMobile ? 0.7 : 0.88, isMobile ? 0.7 : 0.88);

    // Shadow on ground while hopping
    ctx.beginPath();
    ctx.ellipse(0, 7 + hopY, 8 - hopY * 0.3, 2.5, 0, 0, Math.PI * 2);
    ctx.fillStyle = 'rgba(15, 8, 30, 0.35)';
    ctx.fill();

    // Brown Fur Body
    ctx.beginPath();
    ctx.ellipse(0, 0, 8.5, 6.5, -0.2, 0, Math.PI * 2);
    ctx.fillStyle = '#d97706';
    ctx.fill();

    // Tail
    ctx.beginPath();
    ctx.arc(-8, 2, 2.5, 0, Math.PI * 2);
    ctx.fillStyle = '#fef3c7';
    ctx.fill();

    // Head
    ctx.beginPath();
    ctx.arc(5, -4, 5, 0, Math.PI * 2);
    ctx.fillStyle = '#d97706';
    ctx.fill();

    // Ears
    ctx.beginPath();
    ctx.ellipse(4, -11, 1.8, 5, -0.2, 0, Math.PI * 2);
    ctx.fillStyle = '#b45309';
    ctx.fill();
    ctx.beginPath();
    ctx.ellipse(7, -10, 1.8, 5, 0.2, 0, Math.PI * 2);
    ctx.fillStyle = '#b45309';
    ctx.fill();

    // Eye
    ctx.beginPath();
    ctx.arc(7, -5, 0.8, 0, Math.PI * 2);
    ctx.fillStyle = '#0f172a';
    ctx.fill();
    ctx.restore();
}

// ── SKY BIRD FLOCK & PERCHED SONGBIRD ANIMATION ────────────────
let flockProgress = 0;

function drawSkyFlock(ctx) {
    flockProgress += 0.0008;
    if (flockProgress > 1.3) flockProgress = -0.3;

    const isMobile = W < 600;
    const fx = W * flockProgress;
    const fy = H * 0.18 + Math.sin(time * 0.8) * 12;

    // V-Formation Sky Flock (5 Birds flying in the sky)
    const birdPositions = [
        { rx: 0, ry: 0, s: 1.0 },
        { rx: -16, ry: 10, s: 0.85 },
        { rx: -32, ry: 20, s: 0.7 },
        { rx: -14, ry: -10, s: 0.85 },
        { rx: -28, ry: -18, s: 0.7 }
    ];

    birdPositions.forEach(bp => {
        const bx = fx + bp.rx;
        const by = fy + bp.ry;

        if (bx > -20 && bx < W + 20) {
            ctx.save();
            ctx.translate(bx, by);
            const scale = (isMobile ? 0.6 : 0.85) * bp.s;
            ctx.scale(scale, scale);

            // Flapping Silhouette Birds
            const flap = Math.sin(time * 10 + bp.rx * 0.1);
            ctx.beginPath();
            ctx.moveTo(-8, 0);
            ctx.quadraticCurveTo(-3, -8 * flap, 0, -1);
            ctx.quadraticCurveTo(3, -8 * flap, 8, 0);
            ctx.quadraticCurveTo(2, 2, 0, 1);
            ctx.quadraticCurveTo(-2, 2, -8, 0);
            ctx.fillStyle = 'rgba(235, 200, 255, 0.75)';
            ctx.fill();
            ctx.restore();
        }
    });

    // Perched Songbird on Bench Backrest
    const benchX = W * (isMobile ? 0.28 : 0.35);
    const benchY = H * (isMobile ? 0.74 : 0.73);
    const perchedX = benchX + 4;
    const perchedY = benchY - 18;

    ctx.save();
    ctx.translate(perchedX, perchedY);
    ctx.scale(isMobile ? 0.7 : 0.88, isMobile ? 0.7 : 0.88);

    const chirpBob = Math.sin(time * 6) * 0.8;

    // Body (Rose Pink / Blue Songbird)
    ctx.beginPath();
    ctx.ellipse(0, 0, 6, 4, -0.2, 0, Math.PI * 2);
    ctx.fillStyle = '#ec4899';
    ctx.fill();

    // Head
    ctx.beginPath();
    ctx.arc(5, -3 + chirpBob, 3, 0, Math.PI * 2);
    ctx.fillStyle = '#f43f5e';
    ctx.fill();

    // Yellow Beak
    ctx.beginPath();
    ctx.moveTo(7.5, -3 + chirpBob);
    ctx.lineTo(11, -2 + chirpBob);
    ctx.lineTo(7.5, -1 + chirpBob);
    ctx.fillStyle = '#f59e0b';
    ctx.fill();

    // Eye
    ctx.beginPath();
    ctx.arc(6.5, -4 + chirpBob, 0.7, 0, Math.PI * 2);
    ctx.fillStyle = '#0f172a';
    ctx.fill();

    // Tail
    ctx.beginPath();
    ctx.moveTo(-5, 0);
    ctx.lineTo(-10, 3);
    ctx.lineTo(-4, 2);
    ctx.fillStyle = '#be123c';
    ctx.fill();

    ctx.restore();
}

// ── GLOWING BUTTERFLIES ANIMATION ───────────────────────────────
function drawGlowingButterflies(ctx) {
    const isMobile = W < 600;
    const butterflies = [
        { baseX: W * 0.20, baseY: H * 0.68, color: '#f472b6', size: 5, speed: 2.2, phase: 0 },
        { baseX: W * 0.42, baseY: H * 0.70, color: '#c084fc', size: 4.5, speed: 1.8, phase: 2 },
        { baseX: W * 0.62, baseY: H * 0.66, color: '#fde047', size: 5.5, speed: 2.5, phase: 4 },
        { baseX: W * 0.80, baseY: H * 0.72, color: '#38bdf8', size: 4, speed: 2.0, phase: 1 }
    ];

    butterflies.forEach(b => {
        const bx = b.baseX + Math.sin(time * b.speed + b.phase) * 35;
        const by = b.baseY + Math.cos(time * (b.speed * 0.8) + b.phase) * 18;

        ctx.save();
        ctx.translate(bx, by);
        const scale = isMobile ? 0.75 : 1.0;
        ctx.scale(scale, scale);

        const wingFlap = Math.abs(Math.sin(time * 12 + b.phase));

        ctx.shadowColor = b.color;
        ctx.shadowBlur = 10;
        ctx.fillStyle = b.color;

        // Left Wing
        ctx.beginPath();
        ctx.ellipse(-b.size * wingFlap * 0.8, -b.size * 0.5, b.size * wingFlap, b.size * 0.7, -0.4, 0, Math.PI * 2);
        ctx.fill();

        // Right Wing
        ctx.beginPath();
        ctx.ellipse(b.size * wingFlap * 0.8, -b.size * 0.5, b.size * wingFlap, b.size * 0.7, 0.4, 0, Math.PI * 2);
        ctx.fill();

        // Body
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(-0.8, -b.size, 1.6, b.size * 1.5);

        ctx.restore();
    });
}

// ── SWIMMING KOI FISH IN POND ──────────────────────────────────
let fishBubbles = [];

function drawPondFish(ctx, pondX, pondY, pRadX, pRadY) {
    const isMobile = W < 600;
    const radiusX = (pRadX || W * (isMobile ? 0.35 : 0.28)) * 0.70;
    const radiusY = (pRadY || H * (isMobile ? 0.08 : 0.08)) * 0.65;

    // 3 Swimming Koi Fish (Orange/White, Gold, and Sakura Pink)
    const fishList = [
        { color1: '#f97316', color2: '#ffffff', scale: isMobile ? 0.6 : 0.85, speed: 1.2, phase: 0, radOffset: 0.6 },
        { color1: '#fbbf24', color2: '#d97706', scale: isMobile ? 0.5 : 0.72, speed: 0.9, phase: 2.2, radOffset: 0.35 },
        { color1: '#ffffff', color2: '#f43f5e', scale: isMobile ? 0.55 : 0.78, speed: 1.5, phase: 4.5, radOffset: 0.75 }
    ];

    fishList.forEach((f, index) => {
        const angle = time * 0.4 * f.speed + f.phase;
        const fx = pondX + Math.cos(angle) * (radiusX * f.radOffset);
        const fy = pondY + Math.sin(angle * 2) * (radiusY * f.radOffset);

        const nextAngle = (time + 0.05) * 0.4 * f.speed + f.phase;
        const nfx = pondX + Math.cos(nextAngle) * (radiusX * f.radOffset);
        const nfy = pondY + Math.sin(nextAngle * 2) * (radiusY * f.radOffset);
        const heading = Math.atan2(nfy - fy, nfx - fx);

        ctx.save();
        ctx.translate(fx, fy);
        ctx.rotate(heading);
        ctx.scale(f.scale, f.scale);

        const tailWiggle = Math.sin(time * 9 * f.speed + index) * 0.35;

        // Underwater Glow
        ctx.shadowColor = f.color1;
        ctx.shadowBlur = 8;

        // Fish Body
        ctx.beginPath();
        ctx.ellipse(0, 0, 9, 4.5, 0, 0, Math.PI * 2);
        ctx.fillStyle = f.color1;
        ctx.fill();

        // Distinctive Koi Spot Pattern
        ctx.beginPath();
        ctx.ellipse(2, -1, 4, 2.2, 0.2, 0, Math.PI * 2);
        ctx.fillStyle = f.color2;
        ctx.fill();

        // Wiggling Tail Fin
        ctx.save();
        ctx.translate(-8, 0);
        ctx.rotate(tailWiggle);
        ctx.beginPath();
        ctx.moveTo(0, 0);
        ctx.lineTo(-7, -4);
        ctx.quadraticCurveTo(-4, 0, -7, 4);
        ctx.closePath();
        ctx.fillStyle = f.color1;
        ctx.fill();
        ctx.restore();

        // Side Fins
        ctx.beginPath();
        ctx.ellipse(1, 4, 3.5, 1.5, 0.5, 0, Math.PI * 2);
        ctx.fillStyle = f.color1;
        ctx.fill();

        ctx.beginPath();
        ctx.ellipse(1, -4, 3.5, 1.5, -0.5, 0, Math.PI * 2);
        ctx.fillStyle = f.color1;
        ctx.fill();

        // Eye
        ctx.beginPath();
        ctx.arc(6, -1.8, 0.9, 0, Math.PI * 2);
        ctx.fillStyle = '#0f172a';
        ctx.fill();

        ctx.restore();

        // Air Bubbles from fish
        if (Math.random() < 0.015) {
            fishBubbles.push({
                x: fx + (Math.random() * 6 - 3),
                y: fy,
                r: 1.5 + Math.random() * 1.5,
                alpha: 0.7,
                vy: -0.4 - Math.random() * 0.3
            });
        }
    });

    // Rising Air Bubbles
    for (let i = fishBubbles.length - 1; i >= 0; i--) {
        const b = fishBubbles[i];
        b.y += b.vy;
        b.x += Math.sin(time * 4 + b.y) * 0.3;
        b.alpha -= 0.01;

        if (b.alpha <= 0 || b.y < pondY - radiusY) {
            fishBubbles.splice(i, 1);
            continue;
        }

        ctx.save();
        ctx.beginPath();
        ctx.arc(b.x, b.y, b.r, 0, Math.PI * 2);
        ctx.strokeStyle = `rgba(220, 245, 255, ${b.alpha})`;
        ctx.lineWidth = 0.8;
        ctx.stroke();
        ctx.fillStyle = `rgba(255, 255, 255, ${b.alpha * 0.3})`;
        ctx.fill();
        ctx.restore();
    }
}

// ── DISTANT VILLAGE HOUSES & BACKGROUND TREES ─────────────────
let chimneySmoke = [];

function drawDistantVillageAndTrees(ctx) {
    const isMobile = W < 600;
    const horizonY = H * (isMobile ? 0.67 : 0.65);

    ctx.save();

    // ── 1. REALISTIC MULTI-LAYERED MOUNTAIN RANGE ──────────────────
    ctx.save();

    // Far Background Misty Mountain Range
    const farMtGrad = ctx.createLinearGradient(0, horizonY - 120, 0, horizonY);
    farMtGrad.addColorStop(0, currentSkyIndex === 0 ? '#381237' : '#140f2b');
    farMtGrad.addColorStop(1, currentSkyIndex === 0 ? '#1b061c' : '#080414');

    // Far Left Peak
    ctx.beginPath();
    ctx.moveTo(-50, horizonY + 10);
    ctx.quadraticCurveTo(W * 0.12, horizonY - 110, W * 0.28, horizonY + 10);
    ctx.fillStyle = farMtGrad;
    ctx.fill();

    // Far Right Peak
    ctx.beginPath();
    ctx.moveTo(W * 0.45, horizonY + 10);
    ctx.quadraticCurveTo(W * 0.68, horizonY - 120, W * 0.95, horizonY + 10);
    ctx.fillStyle = farMtGrad;
    ctx.fill();

    // Central Majestic Peak (Realistic Alpine Snow Peak)
    const mtx = W * 0.38;
    const mty = horizonY - 155;
    const mtW = isMobile ? W * 0.62 : W * 0.46;

    // Main Mountain Mass
    const mainMtGrad = ctx.createLinearGradient(mtx, mty, mtx, horizonY + 20);
    if (currentSkyIndex === 0) {
        mainMtGrad.addColorStop(0, '#591a52');
        mainMtGrad.addColorStop(0.35, '#3b0e36');
        mainMtGrad.addColorStop(0.7, '#240822');
        mainMtGrad.addColorStop(1, '#140314');
    } else {
        mainMtGrad.addColorStop(0, '#2e1e56');
        mainMtGrad.addColorStop(0.35, '#1b103b');
        mainMtGrad.addColorStop(0.7, '#100826');
        mainMtGrad.addColorStop(1, '#070312');
    }

    // Realistic craggy mountain profile
    ctx.beginPath();
    ctx.moveTo(mtx - mtW * 0.5, horizonY + 15);
    ctx.lineTo(mtx - mtW * 0.35, horizonY - 30);
    ctx.quadraticCurveTo(mtx - mtW * 0.22, mty + 40, mtx - mtW * 0.08, mty + 12);
    ctx.lineTo(mtx, mty); // Summit Peak
    ctx.lineTo(mtx + mtW * 0.07, mty + 14);
    ctx.quadraticCurveTo(mtx + mtW * 0.22, mty + 45, mtx + mtW * 0.36, horizonY - 25);
    ctx.lineTo(mtx + mtW * 0.5, horizonY + 15);
    ctx.closePath();
    ctx.fillStyle = mainMtGrad;
    ctx.fill();

    // Mountain Shadow Side
    ctx.beginPath();
    ctx.moveTo(mtx - mtW * 0.5, horizonY + 15);
    ctx.lineTo(mtx - mtW * 0.35, horizonY - 30);
    ctx.quadraticCurveTo(mtx - mtW * 0.22, mty + 40, mtx - mtW * 0.08, mty + 12);
    ctx.lineTo(mtx, mty);
    ctx.lineTo(mtx, horizonY + 15);
    ctx.closePath();
    ctx.fillStyle = 'rgba(10, 2, 15, 0.32)';
    ctx.fill();

    // Realistic Snow-Cap & Ridge Gullies
    const snowGrad = ctx.createLinearGradient(mtx, mty, mtx, mty + 55);
    snowGrad.addColorStop(0, currentSkyIndex === 0 ? 'rgba(255, 230, 242, 0.92)' : 'rgba(220, 230, 255, 0.92)');
    snowGrad.addColorStop(0.6, currentSkyIndex === 0 ? 'rgba(240, 180, 210, 0.5)' : 'rgba(170, 190, 240, 0.5)');
    snowGrad.addColorStop(1, 'rgba(255, 255, 255, 0)');

    // Realistic Snow Cap Contour with Ravine Finger Insets
    ctx.beginPath();
    ctx.moveTo(mtx - mtW * 0.14, mty + 45);
    ctx.lineTo(mtx - mtW * 0.09, mty + 28);
    ctx.lineTo(mtx - mtW * 0.05, mty + 40);
    ctx.lineTo(mtx - mtW * 0.02, mty + 18);
    ctx.lineTo(mtx, mty);
    ctx.lineTo(mtx + mtW * 0.03, mty + 20);
    ctx.lineTo(mtx + mtW * 0.06, mty + 44);
    ctx.lineTo(mtx + mtW * 0.10, mty + 30);
    ctx.lineTo(mtx + mtW * 0.14, mty + 48);
    ctx.quadraticCurveTo(mtx + mtW * 0.05, mty + 32, mtx, mty + 35);
    ctx.quadraticCurveTo(mtx - mtW * 0.07, mty + 32, mtx - mtW * 0.14, mty + 45);
    ctx.closePath();
    ctx.fillStyle = snowGrad;
    ctx.fill();

    // Mountain Base Twilight Mist
    const mistGrad = ctx.createLinearGradient(0, horizonY - 40, 0, horizonY + 10);
    mistGrad.addColorStop(0, 'rgba(0, 0, 0, 0)');
    mistGrad.addColorStop(1, currentSkyIndex === 0 ? 'rgba(235, 120, 160, 0.22)' : 'rgba(140, 120, 200, 0.22)');
    ctx.fillStyle = mistGrad;
    ctx.fillRect(0, horizonY - 40, W, 50);

    ctx.restore();

    // Front Ridgeline Fill (Slightly raised under village houses)
    const bgHillGrad = ctx.createLinearGradient(0, horizonY - 40, 0, horizonY + 30);
    bgHillGrad.addColorStop(0, currentSkyIndex === 0 ? '#381035' : '#191238');
    bgHillGrad.addColorStop(1, currentSkyIndex === 0 ? '#1f061d' : '#0c061c');

    ctx.beginPath();
    ctx.moveTo(0, H);
    ctx.lineTo(0, horizonY - 20);
    ctx.quadraticCurveTo(W * 0.18, horizonY - 42, W * 0.38, horizonY - 25);
    ctx.lineTo(W * 0.62, horizonY - 25);
    ctx.quadraticCurveTo(W * 0.78, horizonY - 48, W * 0.95, horizonY - 32);
    ctx.lineTo(W, H);
    ctx.fillStyle = bgHillGrad;
    ctx.fill();

    // ── 2. REALISTIC TERRACED RICE FIELDS UNDER THE HOUSES (TANADA) ──
    const drawRiceTerracesUnderHouses = (startX, endX, topY) => {
        const terraces = [
            { offsetY: -4, height: 14, curve: 0.12, inset: 4 },
            { offsetY: 12, height: 16, curve: 0.22, inset: 8 },
            { offsetY: 30, height: 18, curve: 0.32, inset: 12 },
            { offsetY: 50, height: 20, curve: 0.40, inset: 16 }
        ];

        terraces.forEach((ter, idx) => {
            const y1 = topY + ter.offsetY;
            const y2 = y1 + ter.height;
            const leftX = startX + ter.inset;
            const rightX = endX - ter.inset;
            const midX = (leftX + rightX) * 0.5;

            // 1. Terrace Wall Shadow (Drop-shadow under step for 3D depth)
            ctx.fillStyle = 'rgba(15, 4, 18, 0.65)';
            ctx.beginPath();
            ctx.moveTo(leftX, y2);
            ctx.quadraticCurveTo(midX, y2 + 4, rightX, y2);
            ctx.lineTo(rightX, y2 + 3);
            ctx.quadraticCurveTo(midX, y2 + 7, leftX, y2 + 3);
            ctx.closePath();
            ctx.fill();

            // 2. Shimmering Water Basin Plot
            ctx.beginPath();
            ctx.moveTo(leftX, y1);
            ctx.quadraticCurveTo(midX, y1 - 6 * ter.curve, rightX, y1 + 2);
            ctx.lineTo(rightX - 3, y2);
            ctx.quadraticCurveTo(midX, y2 - 4 * ter.curve, leftX + 3, y2);
            ctx.closePath();

            const waterGrad = ctx.createLinearGradient(leftX, y1, rightX, y2);
            if (currentSkyIndex === 0) { // Sunset twilight sky water reflection
                waterGrad.addColorStop(0, 'rgba(244, 114, 182, 0.55)');
                waterGrad.addColorStop(0.4, 'rgba(251, 146, 60, 0.45)');
                waterGrad.addColorStop(0.8, 'rgba(192, 132, 252, 0.5)');
                waterGrad.addColorStop(1, 'rgba(253, 224, 71, 0.4)');
            } else { // Moonlight water reflection
                waterGrad.addColorStop(0, 'rgba(192, 132, 252, 0.45)');
                waterGrad.addColorStop(0.5, 'rgba(129, 140, 248, 0.4)');
                waterGrad.addColorStop(1, 'rgba(96, 165, 250, 0.35)');
            }
            ctx.fillStyle = waterGrad;
            ctx.fill();

            // 3. Earthen Retaining Border (Aze)
            ctx.strokeStyle = '#2d0a2c';
            ctx.lineWidth = 2.0;
            ctx.stroke();

            // Highlight on water edge
            ctx.strokeStyle = currentSkyIndex === 0 ? 'rgba(254, 215, 170, 0.6)' : 'rgba(224, 231, 255, 0.5)';
            ctx.lineWidth = 0.8;
            ctx.stroke();

            // 4. Realistic Rice Plant Shoots in Grid Rows
            const numColumns = Math.floor((rightX - leftX) / 14);
            const stalkColor = currentSkyIndex === 0 ? '#a3e635' : '#84cc16';

            for (let c = 0; c < numColumns; c++) {
                const rx = leftX + 10 + c * 14 + (Math.sin(c * 2) * 2);
                const ry = (y1 + y2) * 0.5 + (Math.cos(c * 1.7) * 2);

                // Multi-blade rice shoot tuft
                ctx.fillStyle = stalkColor;
                ctx.strokeStyle = '#4d7c0f';
                ctx.lineWidth = 0.8;

                // Center shoot
                ctx.beginPath();
                ctx.moveTo(rx, ry);
                ctx.lineTo(rx - 2, ry - 6);
                ctx.lineTo(rx + 2, ry - 6);
                ctx.closePath();
                ctx.fill();

                // Side leaf blades bending outwards
                ctx.beginPath();
                ctx.moveTo(rx, ry);
                ctx.quadraticCurveTo(rx - 4, ry - 3, rx - 6, ry - 5);
                ctx.moveTo(rx, ry);
                ctx.quadraticCurveTo(rx + 4, ry - 3, rx + 6, ry - 5);
                ctx.stroke();
            }
        });
    };

    // Draw Terraced Rice Fields Cascading Below the Village Houses
    drawRiceTerracesUnderHouses(W * 0.05, W * 0.38, horizonY - 10);
    drawRiceTerracesUnderHouses(W * 0.62, W * 0.95, horizonY - 14);

    // 2. Render Distant Background Trees along Hill Crest
    const bgTrees = [
        { x: W * 0.06, y: horizonY - 30, type: 'pine', scale: 0.85 },
        { x: W * 0.10, y: horizonY - 34, type: 'cherry', scale: 0.95 },
        { x: W * 0.16, y: horizonY - 38, type: 'pine', scale: 0.75 },
        { x: W * 0.26, y: horizonY - 30, type: 'cherry', scale: 0.8 },
        { x: W * 0.70, y: horizonY - 44, type: 'pine', scale: 0.9 },
        { x: W * 0.74, y: horizonY - 45, type: 'cherry', scale: 1.0 },
        { x: W * 0.82, y: horizonY - 40, type: 'pine', scale: 0.8 },
        { x: W * 0.92, y: horizonY - 32, type: 'cherry', scale: 0.9 }
    ];

    bgTrees.forEach(t => {
        ctx.save();
        ctx.translate(t.x, t.y);
        const s = (isMobile ? 0.7 : 1.0) * t.scale;
        ctx.scale(s, s);

        if (t.type === 'pine') {
            // Pine Tree Silhouette
            ctx.fillStyle = '#160519';
            ctx.fillRect(-1.5, 0, 3, 14);
            ctx.beginPath();
            ctx.moveTo(0, -18);
            ctx.lineTo(-9, -6);
            ctx.lineTo(9, -6);
            ctx.closePath();
            ctx.fillStyle = '#2c0830';
            ctx.fill();
            ctx.beginPath();
            ctx.moveTo(0, -26);
            ctx.lineTo(-7, -14);
            ctx.lineTo(7, -14);
            ctx.closePath();
            ctx.fillStyle = '#3a0c40';
            ctx.fill();
        } else {
            // Cherry Tree Canopy Silhouette
            ctx.fillStyle = '#160519';
            ctx.fillRect(-1.5, 0, 3, 12);
            ctx.beginPath();
            ctx.arc(0, -12, 10, 0, Math.PI * 2);
            ctx.arc(-6, -10, 7, 0, Math.PI * 2);
            ctx.arc(6, -10, 7, 0, Math.PI * 2);
            ctx.fillStyle = 'rgba(150, 40, 160, 0.7)';
            ctx.fill();
            ctx.beginPath();
            ctx.arc(0, -14, 8, 0, Math.PI * 2);
            ctx.fillStyle = 'rgba(210, 90, 200, 0.5)';
            ctx.fill();
        }
        ctx.restore();
    });

    // 3. Render Village Houses / Cottages Perched Solidly on Ground Hill
    const houses = [
        { x: W * 0.12, y: horizonY - 32, w: 26, h: 18, roofH: 12, chimney: true },
        { x: W * 0.22, y: horizonY - 28, w: 22, h: 16, roofH: 10, chimney: false },
        { x: W * 0.76, y: horizonY - 42, w: 28, h: 20, roofH: 14, chimney: true },
        { x: W * 0.88, y: horizonY - 33, w: 20, h: 15, roofH: 10, chimney: false }
    ];

    houses.forEach(h => {
        ctx.save();
        ctx.translate(h.x, h.y);
        const s = isMobile ? 0.75 : 1.0;
        ctx.scale(s, s);

        // Earthen Ground Foundation Mound under house
        ctx.fillStyle = '#1e081e';
        ctx.beginPath();
        ctx.ellipse(0, h.h, h.w * 0.85, 6, 0, 0, Math.PI * 2);
        ctx.fill();

        // House Body
        ctx.fillStyle = '#220822';
        ctx.fillRect(-h.w / 2, 0, h.w, h.h);
        ctx.strokeStyle = '#421240';
        ctx.lineWidth = 1;
        ctx.strokeRect(-h.w / 2, 0, h.w, h.h);

        // Curved Pagoda Roof
        ctx.beginPath();
        ctx.moveTo(-h.w / 2 - 5, 0);
        ctx.quadraticCurveTo(0, -h.roofH * 0.4, 0, -h.roofH);
        ctx.quadraticCurveTo(0, -h.roofH * 0.4, h.w / 2 + 5, 0);
        ctx.closePath();
        ctx.fillStyle = '#42103e';
        ctx.fill();
        ctx.strokeStyle = '#6e1d66';
        ctx.lineWidth = 1.5;
        ctx.stroke();

        // Chimney & Smoke
        if (h.chimney) {
            const chimX = h.w * 0.25;
            ctx.fillStyle = '#180418';
            ctx.fillRect(chimX - 2, -h.roofH * 0.6, 4, h.roofH * 0.6);

            // Spawn gentle chimney smoke
            if (Math.random() < 0.04) {
                chimneySmoke.push({
                    x: h.x + chimX * s,
                    y: h.y - h.roofH * 0.6 * s,
                    r: 2 + Math.random() * 2,
                    alpha: 0.6,
                    vx: (Math.random() - 0.5) * 0.3,
                    vy: -0.4 - Math.random() * 0.3
                });
            }
        }

        // Cozy Glowing Golden Windows
        ctx.shadowColor = '#fde047';
        ctx.shadowBlur = 10;
        ctx.fillStyle = '#fef08a';
        ctx.fillRect(-h.w * 0.3, h.h * 0.25, 5, 6);
        ctx.fillRect(h.w * 0.1, h.h * 0.25, 5, 6);

        // Cozy Door
        ctx.shadowBlur = 0;
        ctx.fillStyle = '#45123d';
        ctx.fillRect(-2, h.h * 0.4, 4, h.h * 0.6);

        ctx.restore();
    });

    // 4. Render Rising Chimney Smoke Wisps
    for (let i = chimneySmoke.length - 1; i >= 0; i--) {
        const sm = chimneySmoke[i];
        sm.x += sm.vx + Math.sin(time * 2 + sm.y * 0.05) * 0.2;
        sm.y += sm.vy;
        sm.r += 0.06;
        sm.alpha -= 0.006;

        if (sm.alpha <= 0) {
            chimneySmoke.splice(i, 1);
            continue;
        }

        ctx.save();
        ctx.beginPath();
        ctx.arc(sm.x, sm.y, sm.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(235, 210, 245, ${sm.alpha * 0.4})`;
        ctx.fill();
        ctx.restore();
    }

    ctx.restore();
}

// ── KIDS PLAYING WITH KITES ANIMATION ──────────────────────────
function drawKidsPlayingKites(ctx) {
    const isMobile = W < 600;

    // Kid 1 Position (Right Grassy Hill)
    const kid1X = W * (isMobile ? 0.68 : 0.72);
    const kid1Y = H * (isMobile ? 0.72 : 0.70);
    const runCycle1 = Math.sin(time * 5) * 1.5;

    // Kite 1 Position (Dancing in Sky)
    const kite1X = W * (isMobile ? 0.74 : 0.78) + Math.sin(time * 2.2) * 28;
    const kite1Y = H * (isMobile ? 0.35 : 0.30) + Math.cos(time * 1.8) * 15;

    // Kid 2 Position (Further Right)
    const kid2X = W * (isMobile ? 0.82 : 0.85);
    const kid2Y = H * (isMobile ? 0.73 : 0.71);
    const runCycle2 = Math.cos(time * 4.5) * 1.2;

    // Kite 2 Position (High Sky)
    const kite2X = W * (isMobile ? 0.86 : 0.89) + Math.cos(time * 2.5) * 22;
    const kite2Y = H * (isMobile ? 0.28 : 0.24) + Math.sin(time * 2.0) * 18;

    ctx.save();

    // 1. Draw Curved Kite Strings
    ctx.strokeStyle = 'rgba(255, 235, 200, 0.55)';
    ctx.lineWidth = 1.2;

    // String 1
    ctx.beginPath();
    ctx.moveTo(kid1X, kid1Y - 14);
    ctx.quadraticCurveTo((kid1X + kite1X) * 0.5 + 15, (kid1Y + kite1Y) * 0.5 + 20, kite1X, kite1Y);
    ctx.stroke();

    // String 2
    ctx.beginPath();
    ctx.moveTo(kid2X, kid2Y - 12);
    ctx.quadraticCurveTo((kid2X + kite2X) * 0.5 + 20, (kid2Y + kite2Y) * 0.5 + 25, kite2X, kite2Y);
    ctx.stroke();

    // 2. Render Kid 1 (Running Stickman holding string)
    ctx.save();
    ctx.translate(kid1X, kid1Y);
    const scale1 = isMobile ? 0.7 : 0.9;
    ctx.scale(scale1, scale1);

    ctx.strokeStyle = '#ffffff';
    ctx.fillStyle = '#ffffff';
    ctx.lineWidth = 2.2;

    // Head
    ctx.beginPath();
    ctx.arc(0, -18 + runCycle1 * 0.5, 4.5, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();

    // Torso
    ctx.beginPath();
    ctx.moveTo(0, -13.5 + runCycle1 * 0.5);
    ctx.lineTo(0, -2);
    ctx.stroke();

    // Legs (Running stride)
    ctx.beginPath();
    ctx.moveTo(0, -2);
    ctx.lineTo(-4 + runCycle1 * 2, 8);
    ctx.moveTo(0, -2);
    ctx.lineTo(4 - runCycle1 * 2, 8);
    ctx.stroke();

    // Raised Arms holding kite line spool
    ctx.beginPath();
    ctx.moveTo(0, -10 + runCycle1 * 0.5);
    ctx.lineTo(6, -16);
    ctx.stroke();

    ctx.restore();

    // 3. Render Kid 2 (Flying kite)
    ctx.save();
    ctx.translate(kid2X, kid2Y);
    const scale2 = isMobile ? 0.65 : 0.85;
    ctx.scale(scale2, scale2);

    ctx.strokeStyle = '#ffffff';
    ctx.fillStyle = '#ffffff';
    ctx.lineWidth = 2.0;

    // Head
    ctx.beginPath();
    ctx.arc(0, -16 + runCycle2 * 0.5, 4, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();

    // Torso
    ctx.beginPath();
    ctx.moveTo(0, -12 + runCycle2 * 0.5);
    ctx.lineTo(0, -2);
    ctx.stroke();

    // Legs
    ctx.beginPath();
    ctx.moveTo(0, -2);
    ctx.lineTo(-3, 7);
    ctx.moveTo(0, -2);
    ctx.lineTo(3, 7);
    ctx.stroke();

    // Raised Arm pointing up
    ctx.beginPath();
    ctx.moveTo(0, -9 + runCycle2 * 0.5);
    ctx.lineTo(5, -15);
    ctx.stroke();

    ctx.restore();

    // 4. Render Kite 1 (Golden Amber Diamond Kite)
    drawDiamondKite(ctx, kite1X, kite1Y, '#f59e0b', '#ef4444', 0.4 + Math.sin(time * 3) * 0.15);

    // 5. Render Kite 2 (Rose Pink / Cyan Butterfly Kite)
    drawDiamondKite(ctx, kite2X, kite2Y, '#ec4899', '#38bdf8', -0.3 + Math.cos(time * 2.8) * 0.15);

    ctx.restore();
}

function drawDiamondKite(ctx, x, y, c1, c2, angle) {
    ctx.save();
    ctx.translate(x, y);
    ctx.rotate(angle);

    ctx.shadowColor = c1;
    ctx.shadowBlur = 12;

    // Diamond Body
    ctx.beginPath();
    ctx.moveTo(0, -14);
    ctx.lineTo(10, 0);
    ctx.lineTo(0, 16);
    ctx.lineTo(-10, 0);
    ctx.closePath();
    ctx.fillStyle = c1;
    ctx.fill();
    ctx.strokeStyle = c2;
    ctx.lineWidth = 1.5;
    ctx.stroke();

    // Cross Struts
    ctx.beginPath();
    ctx.moveTo(0, -14);
    ctx.lineTo(0, 16);
    ctx.moveTo(-10, 0);
    ctx.lineTo(10, 0);
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.7)';
    ctx.lineWidth = 1.0;
    ctx.stroke();

    // Flowing Ribbon Tail
    ctx.beginPath();
    ctx.moveTo(0, 16);
    const tailWave1 = Math.sin(time * 8) * 10;
    const tailWave2 = Math.cos(time * 7) * 14;
    ctx.bezierCurveTo(tailWave1, 28, tailWave2, 42, tailWave1 * 0.5, 56);
    ctx.strokeStyle = c2;
    ctx.lineWidth = 2.0;
    ctx.stroke();

    ctx.restore();
}

function drawGroundHill(ctx) {
    const isMobile = W < 600;
    const isTablet = W >= 600 && W < 1024;
    const isPortrait = H > W;

    // 1. Responsive Hill & Pond Geometry
    const hillY = H * (isPortrait ? 0.68 : 0.70);
    const pondX = W * 0.5;
    // Dynamic responsive pond Y position (avoids clipping on mobile browser UI)
    const pondY = H * (isPortrait ? 0.86 : 0.88);

    // Responsive Pond Radii across device dimensions
    const pondRadiusX = Math.min(
        W * (isMobile ? (isPortrait ? 0.42 : 0.35) : (isTablet ? 0.32 : 0.27)),
        isMobile ? W * 0.46 : 420
    );
    const pondRadiusY = Math.min(
        H * (isMobile ? (isPortrait ? 0.085 : 0.075) : 0.08),
        isMobile ? H * 0.12 : 90
    );

    // 1. Stepped Purple Hill Base (matching cherry.jpg)
    const hillGrad = ctx.createLinearGradient(0, hillY, 0, H);
    if (currentSkyIndex === 0) {
        hillGrad.addColorStop(0, '#42163b');
        hillGrad.addColorStop(0.4, '#280c26');
        hillGrad.addColorStop(1, '#120414');
    } else {
        hillGrad.addColorStop(0, '#1c163b');
        hillGrad.addColorStop(0.4, '#100c26');
        hillGrad.addColorStop(1, '#050414');
    }

    ctx.save();
    ctx.beginPath();
    ctx.moveTo(0, H);
    ctx.lineTo(0, hillY + 20);
    ctx.quadraticCurveTo(W * 0.35, hillY - 25, W * 0.5, hillY - 10);
    ctx.quadraticCurveTo(W * 0.65, hillY, W, hillY - 20);
    ctx.lineTo(W, H);
    ctx.closePath();
    ctx.fillStyle = hillGrad;
    ctx.fill();

    // 2. Tranquil Blue Pond & Reflection at Base (Fully Responsive)
    const pondGrad = ctx.createRadialGradient(pondX, pondY, 5, pondX, pondY, pondRadiusX);
    pondGrad.addColorStop(0, '#3b82f6');
    pondGrad.addColorStop(0.5, '#1d4ed8');
    pondGrad.addColorStop(0.85, '#1e1b4b');
    pondGrad.addColorStop(1, 'rgba(15, 8, 30, 0)');

    ctx.beginPath();
    ctx.ellipse(pondX, pondY, pondRadiusX, pondRadiusY, 0, 0, Math.PI * 2);
    ctx.fillStyle = pondGrad;
    ctx.fill();

    // Sunset Glow Reflection on Water
    ctx.beginPath();
    ctx.ellipse(pondX + pondRadiusX * 0.15, pondY - pondRadiusY * 0.15, pondRadiusX * 0.45, pondRadiusY * 0.35, 0, 0, Math.PI * 2);
    ctx.fillStyle = currentSkyIndex === 0 ? 'rgba(255, 170, 100, 0.35)' : 'rgba(186, 230, 253, 0.30)';
    ctx.fill();

    // Floating Water Lilies & Blooming Lotus Flowers
    drawWaterLilies(ctx, pondX, pondY, pondRadiusX, pondRadiusY);

    // Swimming Koi Fish in Pond
    drawPondFish(ctx, pondX, pondY, pondRadiusX, pondRadiusY);

    // Swimming Elegant Swans Family on Pond Water
    drawSwimmingSwans(ctx, pondX, pondY, pondRadiusX, pondRadiusY);

    // Flying & Water-Landing Mallard Duck (Flying in from left sky & swimming in pond)
    drawFlyingLandingDuck(ctx, pondX, pondY, pondRadiusX, pondRadiusY);

    // Flying & Water-Drinking Bird at Pond Edge
    drawDrinkingBirds(ctx, pondX, pondY, pondRadiusX, pondRadiusY);

    // More Animals Drinking Water at Pond Edge (White Heron & Forest Deer)
    drawPondDrinkingAnimals(ctx, pondX, pondY, pondRadiusX, pondRadiusY);

    // Falcon Hunting Sequence (Swooping down & snatching fish prey out of pond)
    drawFalconHuntingFish(ctx, pondX, pondY, pondRadiusX, pondRadiusY);

    // Birds Foraging & Fishing in the Pond (Sapphire Kingfisher, Mandarin Ducks, Cormorant)
    drawPondForagingBirds(ctx, pondX, pondY, pondRadiusX, pondRadiusY);

    // Lush Swaying Grass Tufts & Pond Shoreline Reeds
    drawLushSwayingGrass(ctx, pondX, pondY, pondRadiusX, pondRadiusY);

    ctx.restore();
}

// ── POND FORAGING & FISHING BIRDS ENGINE ───────────────────────
let kfDiveTimer = 0;

function drawPondForagingBirds(ctx, pondX, pondY) {
    const isMobile = W < 600;
    const scale = isMobile ? 0.72 : 0.95;

    // 1. SAPPHIRE KINGFISHER (Fishing Dive & Perch)
    kfDiveTimer += 0.016;
    const kfCycle = (kfDiveTimer * 1.2) % 10;
    const perchX = pondX - W * (isMobile ? 0.15 : 0.18);
    const perchY = pondY - H * 0.025;

    let kfX = perchX, kfY = perchY, isDiving = false;

    if (kfCycle > 6.0 && kfCycle < 8.0) {
        const divProgress = Math.sin((kfCycle - 6.0) / 2.0 * Math.PI);
        kfX = perchX + divProgress * 25;
        kfY = perchY + divProgress * 20;
        isDiving = true;
    }

    ctx.save();
    ctx.translate(kfX, kfY);
    ctx.scale(scale * 0.9, scale * 0.9);

    if (!isDiving) {
        ctx.strokeStyle = '#451a03';
        ctx.lineWidth = 2.5;
        ctx.beginPath();
        ctx.moveTo(-12, 10);
        ctx.quadraticCurveTo(0, 5, 14, 8);
        ctx.stroke();
    } else {
        ctx.beginPath();
        ctx.ellipse(0, 5, 12, 4, 0, 0, Math.PI * 2);
        ctx.strokeStyle = 'rgba(186, 230, 253, 0.85)';
        ctx.lineWidth = 1.4;
        ctx.stroke();
    }

    // Kingfisher Body (Metallic Sapphire Blue & Vivid Orange)
    ctx.beginPath();
    ctx.ellipse(0, -3, 8, 5, isDiving ? 0.6 : -0.2, 0, Math.PI * 2);
    ctx.fillStyle = '#0284c7';
    ctx.fill();

    ctx.beginPath();
    ctx.ellipse(2, -1, 5, 3.5, 0.2, 0, Math.PI * 2);
    ctx.fillStyle = '#ea580c';
    ctx.fill();

    ctx.beginPath();
    ctx.arc(6, -6, 4, 0, Math.PI * 2);
    ctx.fillStyle = '#0369a1';
    ctx.fill();

    ctx.beginPath();
    ctx.arc(4, -4, 1.8, 0, Math.PI * 2);
    ctx.fillStyle = '#ffffff';
    ctx.fill();

    ctx.beginPath();
    ctx.moveTo(9, -6);
    ctx.lineTo(17, -4);
    ctx.lineTo(9, -3);
    ctx.fillStyle = '#0f172a';
    ctx.fill();

    ctx.beginPath();
    ctx.arc(7.5, -7, 0.8, 0, Math.PI * 2);
    ctx.fillStyle = '#ffffff';
    ctx.fill();

    ctx.restore();


    // 2. ORNATE MANDARIN DUCK PAIR (Foraging Pond Weeds & Tiny Creatures)
    const mandarinX = pondX + W * (isMobile ? 0.18 : 0.22);
    const mandarinY = pondY + H * 0.015;
    const forageDip = Math.sin(time * 3) > 0.3 ? Math.sin(time * 3) * 4 : 0;

    ctx.save();
    ctx.translate(mandarinX, mandarinY);
    ctx.scale(scale * 0.85, scale * 0.85);

    ctx.beginPath();
    ctx.ellipse(0, 3, 10, 3.5, 0, 0, Math.PI * 2);
    ctx.strokeStyle = 'rgba(210, 240, 255, 0.4)';
    ctx.lineWidth = 1.0;
    ctx.stroke();

    ctx.beginPath();
    ctx.ellipse(0, -2, 11, 7, 0, 0, Math.PI * 2);
    ctx.fillStyle = '#d97706';
    ctx.fill();

    ctx.beginPath();
    ctx.moveTo(-4, -6);
    ctx.lineTo(-8, -14);
    ctx.lineTo(-2, -8);
    ctx.fillStyle = '#ea580c';
    ctx.fill();

    ctx.beginPath();
    ctx.arc(7, -7 + forageDip, 5, 0, Math.PI * 2);
    ctx.fillStyle = '#0d9488';
    ctx.fill();

    ctx.beginPath();
    ctx.moveTo(11, -7 + forageDip);
    ctx.lineTo(16, -5 + forageDip);
    ctx.lineTo(11, -3 + forageDip);
    ctx.fillStyle = '#ef4444';
    ctx.fill();

    ctx.restore();


    // 3. CORMORANT WATER BIRD (Perched on Rock Drying Wings after Fishing)
    const cormorantX = pondX + W * (isMobile ? 0.22 : 0.26);
    const cormorantY = pondY - H * 0.015;
    const wingSpread = Math.sin(time * 1.8) * 8;

    ctx.save();
    ctx.translate(cormorantX, cormorantY);
    ctx.scale(scale * 0.88, scale * 0.88);

    ctx.beginPath();
    ctx.ellipse(0, 8, 14, 6, 0, 0, Math.PI * 2);
    ctx.fillStyle = '#334155';
    ctx.fill();

    ctx.fillStyle = '#1e293b';
    ctx.beginPath();
    ctx.moveTo(0, -8);
    ctx.quadraticCurveTo(-14 - wingSpread, -18, -20 - wingSpread, -8);
    ctx.lineTo(0, -2);
    ctx.fill();

    ctx.beginPath();
    ctx.moveTo(0, -8);
    ctx.quadraticCurveTo(14 + wingSpread, -18, 20 + wingSpread, -8);
    ctx.lineTo(0, -2);
    ctx.fill();

    ctx.beginPath();
    ctx.ellipse(0, -6, 7, 10, 0, 0, Math.PI * 2);
    ctx.fillStyle = '#0f172a';
    ctx.fill();

    ctx.beginPath();
    ctx.arc(2, -18, 3.5, 0, Math.PI * 2);
    ctx.fillStyle = '#0f172a';
    ctx.fill();

    ctx.beginPath();
    ctx.moveTo(4, -18);
    ctx.lineTo(11, -17);
    ctx.lineTo(10, -14);
    ctx.fillStyle = '#eab308';
    ctx.restore();

    // 4. FALCON HUNTING FISH AT POND & SOARING UP BEHIND CHERRY TREE
    drawFalconHuntingFish(ctx, pondX, pondY);
}



// ── MORE ANIMALS DRINKING WATER AT POND EDGE (RUSH ONCE & PERMANENT POND STAY) ──
let animalRushTimer = 0;
let animalsArrivedAtPond = false;

function drawPondDrinkingAnimals(ctx, pondX, pondY) {
    const isMobile = W < 600;
    const scale = isMobile ? 0.72 : 0.95;

    if (!animalsArrivedAtPond) {
        animalRushTimer += 0.016;
        if (animalRushTimer >= 5.5) {
            animalsArrivedAtPond = true;
        }
    }

    // 1. LEFT FOREST DEER (Rushing from completely outside left canvas boundary to left pond bank)
    const startX_left = -W * (isMobile ? 0.12 : 0.18);
    const startY_left = pondY - H * 0.10;
    const targetX_left = pondX - W * (isMobile ? 0.11 : 0.13);
    const targetY_left = pondY + H * 0.005;

    let currentLeftX = targetX_left;
    let currentLeftY = targetY_left;
    let isLeftTrotting = false;
    let leftLegGait = 0;

    if (animalRushTimer < 5.0) {
        const p = animalRushTimer / 5.0;
        const easeP = 1 - Math.pow(1 - p, 2);
        currentLeftX = startX_left + (targetX_left - startX_left) * easeP;
        currentLeftY = startY_left + (targetY_left - startY_left) * easeP;
        isLeftTrotting = true;
        leftLegGait = Math.sin(animalRushTimer * 14) * 8;
    }

    const leftDip = (!isLeftTrotting && Math.sin(time * 2.0) > 0.1) ? Math.sin(time * 2.0) * 8 : 0;
    drawSingleDeer(ctx, currentLeftX, currentLeftY, scale * (isMobile ? 1.0 : 1.30), 1, isLeftTrotting, leftLegGait, leftDip, '#ea580c', '#ffffff', true);

    // 2. OPPOSITE RIGHT FOREST DEER / STAG (Rushing from completely outside right canvas boundary)
    const startX_right = W * (isMobile ? 1.12 : 1.18);
    const startY_right = pondY - H * 0.09;
    const targetX_right = pondX + W * (isMobile ? 0.12 : 0.14);
    const targetY_right = pondY + H * 0.008;

    let currentRightX = targetX_right;
    let currentRightY = targetY_right;
    let isRightTrotting = false;
    let rightLegGait = 0;

    if (animalRushTimer < 5.2) {
        const p = Math.min(1.0, animalRushTimer / 5.2);
        const easeP = 1 - Math.pow(1 - p, 2);
        currentRightX = startX_right + (targetX_right - startX_right) * easeP;
        currentRightY = startY_right + (targetY_right - startY_right) * easeP;
        isRightTrotting = true;
        rightLegGait = Math.cos(animalRushTimer * 14) * 8;
    }

    const rightDip = (!isRightTrotting && Math.sin(time * 2.3) > 0.1) ? Math.sin(time * 2.3) * 8 : 0;
    // Facing left towards the pond water (dir = -1)
    drawSingleDeer(ctx, currentRightX, currentRightY, scale * (isMobile ? 0.95 : 1.25), -1, isRightTrotting, rightLegGait, rightDip, '#c2410c', '#ffedd5', true);

    // 3. ELEGANT WHITE HERON / EGRET (Gliding in from outside left sky to Left Pond Shore)
    const startX_egret = -W * (isMobile ? 0.15 : 0.22);
    const startY_egret = pondY - H * 0.14;
    const targetX_egret = pondX - W * (isMobile ? 0.18 : 0.20);
    const targetY_egret = pondY + H * 0.01;

    let currentEgretX = targetX_egret;
    let currentEgretY = targetY_egret;
    let isEgretFlying = false;

    if (animalRushTimer < 4.5) {
        const p = animalRushTimer / 4.5;
        const easeP = 1 - Math.pow(1 - p, 2);
        currentEgretX = startX_egret + (targetX_egret - startX_egret) * easeP;
        currentEgretY = startY_egret + (targetY_egret - startY_egret) * easeP;
        isEgretFlying = true;
    }

    const egretDip = (!isEgretFlying && Math.sin(time * 2.5) > 0.2) ? Math.sin(time * 2.5) * 8 : 0;

    ctx.save();
    ctx.translate(currentEgretX, currentEgretY);
    ctx.scale(scale, scale);

    if (isEgretFlying) {
        const wingFlap = Math.sin(animalRushTimer * 16) * 12;
        ctx.fillStyle = '#ffffff';
        ctx.beginPath();
        ctx.moveTo(0, -10);
        ctx.quadraticCurveTo(-10, -22 + wingFlap, -22, -10 + wingFlap);
        ctx.lineTo(0, -5);
        ctx.fill();
    }

    ctx.strokeStyle = '#1e293b';
    ctx.lineWidth = 1.6;
    ctx.beginPath();
    ctx.moveTo(-2, 10); ctx.lineTo(-2, -4);
    ctx.moveTo(3, 10); ctx.lineTo(3, -4);
    ctx.stroke();

    ctx.beginPath();
    ctx.ellipse(0, -10, 9, 6, -0.3, 0, Math.PI * 2);
    ctx.fillStyle = '#ffffff';
    ctx.fill();

    ctx.beginPath();
    ctx.moveTo(-8, -10);
    ctx.lineTo(-15, -6);
    ctx.lineTo(-8, -4);
    ctx.fillStyle = '#e2e8f0';
    ctx.fill();

    ctx.beginPath();
    ctx.moveTo(5, -12);
    ctx.quadraticCurveTo(12, -22 + egretDip * 0.5, 14, -14 + egretDip);
    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 3.5;
    ctx.stroke();

    ctx.beginPath();
    ctx.arc(14, -14 + egretDip, 3.5, 0, Math.PI * 2);
    ctx.fillStyle = '#ffffff';
    ctx.fill();

    ctx.beginPath();
    ctx.moveTo(16, -14 + egretDip);
    ctx.lineTo(24, -10 + egretDip * 1.2);
    ctx.lineTo(16, -12 + egretDip);
    ctx.fillStyle = '#f59e0b';
    ctx.fill();

    if (!isEgretFlying && egretDip > 4) {
        ctx.beginPath();
        ctx.ellipse(22, 0, 8, 3, 0, 0, Math.PI * 2);
        ctx.strokeStyle = 'rgba(210, 240, 255, 0.7)';
        ctx.lineWidth = 1.2;
        ctx.stroke();
    }

    ctx.restore();
}

// ── REUSABLE HIGH-REALISM DEER GAIT & ANIMATION ENGINE ────────
function drawSingleDeer(ctx, x, y, scale, dir, isTrotting, legGait, dipAngle, bodyColor, spotColor, hasAntlers) {
    ctx.save();

    // 1. Dynamic Body Bounce & Trotting Kinematics
    const stridePhase = time * 14;
    const bodyBob = isTrotting ? Math.abs(Math.sin(stridePhase)) * 3.8 : 0;
    const bodyTilt = isTrotting ? Math.sin(stridePhase) * 0.08 : 0;

    ctx.translate(x, y - bodyBob);
    ctx.scale(dir * scale, scale);

    // Dust Cloud particles behind hooves when trotting
    if (isTrotting) {
        ctx.fillStyle = 'rgba(235, 180, 240, 0.4)';
        for (let i = 0; i < 3; i++) {
            ctx.beginPath();
            ctx.arc(-14 - i * 6, 10 + Math.sin(time * 10 + i) * 3, 2.5 + i, 0, Math.PI * 2);
            ctx.fill();
        }
    }

    // 2. Articulated 2-Segment Legs (Thigh -> Knee -> Hoof) with Diagonal Trot Gait
    const frontLeftSwing = isTrotting ? Math.sin(stridePhase) * 10 : 0;
    const frontRightSwing = isTrotting ? -Math.sin(stridePhase) * 10 : 0;
    const backLeftSwing = isTrotting ? -Math.sin(stridePhase) * 10 : 0;
    const backRightSwing = isTrotting ? Math.sin(stridePhase) * 10 : 0;

    // Knee High-Lift for realistic trot
    const kneeLiftFL = isTrotting ? Math.max(0, Math.sin(stridePhase)) * 5 : 0;
    const kneeLiftFR = isTrotting ? Math.max(0, -Math.sin(stridePhase)) * 5 : 0;

    ctx.strokeStyle = '#581c87';
    ctx.lineWidth = 2.2;
    ctx.lineCap = 'round';

    // Hind Leg Left (Back thigh -> knee -> hoof)
    ctx.beginPath();
    ctx.moveTo(-8, -2);
    ctx.lineTo(-10 + backLeftSwing * 0.5, 6);
    ctx.lineTo(-8 + backLeftSwing, 14);
    ctx.stroke();

    // Hind Leg Right
    ctx.beginPath();
    ctx.moveTo(-3, -2);
    ctx.lineTo(-5 + backRightSwing * 0.5, 6);
    ctx.lineTo(-3 + backRightSwing, 14);
    ctx.stroke();

    // Front Leg Left (Shoulder -> knee lift -> hoof)
    ctx.beginPath();
    ctx.moveTo(7, -2);
    ctx.lineTo(8 + frontLeftSwing * 0.5, 6 - kneeLiftFL);
    ctx.lineTo(7 + frontLeftSwing, 14);
    ctx.stroke();

    // Front Leg Right
    ctx.beginPath();
    ctx.moveTo(12, -2);
    ctx.lineTo(13 + frontRightSwing * 0.5, 6 - kneeLiftFR);
    ctx.lineTo(12 + frontRightSwing, 14);
    ctx.stroke();

    // 3. Vibrant Golden Fawn / Deer Body with Spine Tilt
    ctx.save();
    ctx.rotate(bodyTilt);

    ctx.beginPath();
    ctx.ellipse(2, -8, 15, 10, isTrotting ? -0.15 : 0, 0, Math.PI * 2);
    ctx.fillStyle = bodyColor;
    ctx.fill();
    ctx.strokeStyle = '#9a3412';
    ctx.lineWidth = 1.5;
    ctx.stroke();

    // Soft Cream Chest / Belly
    ctx.beginPath();
    ctx.ellipse(8, -6, 7, 5, 0.4, 0, Math.PI * 2);
    ctx.fillStyle = '#ffedd5';
    ctx.fill();

    // Spots on Back
    ctx.fillStyle = spotColor;
    ctx.beginPath(); ctx.arc(-3, -11, 1.8, 0, Math.PI * 2); ctx.fill();
    ctx.beginPath(); ctx.arc(3, -12, 1.8, 0, Math.PI * 2); ctx.fill();
    ctx.beginPath(); ctx.arc(9, -10, 1.8, 0, Math.PI * 2); ctx.fill();

    // Fluffy Tail Bouncing
    const tailWag = isTrotting ? Math.sin(stridePhase) * 5 : 0;
    ctx.beginPath();
    ctx.arc(-12, -10 + tailWag, 4, 0, Math.PI * 2);
    ctx.fillStyle = '#ffffff';
    ctx.fill();

    // Neck & Head with Natural Trot Rhythm
    const neckBob = isTrotting ? Math.cos(stridePhase) * 2.0 : 0;
    const neckAngle = isTrotting ? (-5 + neckBob) : (-2 + dipAngle);
    ctx.beginPath();
    ctx.moveTo(12, -12);
    ctx.lineTo(22, neckAngle);
    ctx.strokeStyle = bodyColor;
    ctx.lineWidth = 6.5;
    ctx.stroke();

    // Antlers
    if (hasAntlers) {
        ctx.strokeStyle = '#fde047';
        ctx.lineWidth = 1.6;
        ctx.beginPath();
        ctx.moveTo(20, -7 + neckAngle); ctx.lineTo(18, -15 + neckAngle); ctx.lineTo(15, -18 + neckAngle);
        ctx.moveTo(18, -15 + neckAngle); ctx.lineTo(21, -19 + neckAngle);
        ctx.stroke();
    }

    // Head
    ctx.beginPath();
    ctx.arc(23, neckAngle, 5.8, 0, Math.PI * 2);
    ctx.fillStyle = bodyColor;
    ctx.fill();

    // Twitching Ears
    const earTwitch = Math.sin(time * 4.5) * 0.18;
    ctx.save();
    ctx.translate(20, -5 + neckAngle);
    ctx.rotate(-0.35 + earTwitch);
    ctx.beginPath(); ctx.ellipse(0, -5, 2.2, 5.5, 0, 0, Math.PI * 2); ctx.fillStyle = '#c2410c'; ctx.fill();
    ctx.beginPath(); ctx.ellipse(0, -5, 1.2, 4, 0, 0, Math.PI * 2); ctx.fillStyle = '#ffedd5'; ctx.fill();
    ctx.restore();

    // Eye
    ctx.beginPath();
    ctx.arc(22, -2 + neckAngle, 1.2, 0, Math.PI * 2);
    ctx.fillStyle = '#0f172a';
    ctx.fill();

    // Black Muzzle Nose
    ctx.beginPath();
    ctx.arc(28, 1 + neckAngle, 1.5, 0, Math.PI * 2);
    ctx.fillStyle = '#1e293b';
    ctx.fill();

    ctx.restore(); // Restore spine rotate

    // Glowing Water Ripple Circle when drinking at pond edge
    if (!isTrotting && dipAngle > 4) {
        ctx.beginPath();
        ctx.ellipse(28, 4, 10, 3.5, 0, 0, Math.PI * 2);
        ctx.strokeStyle = 'rgba(254, 215, 170, 0.75)';
        ctx.lineWidth = 1.4;
        ctx.stroke();
    }

    ctx.restore();
}

// ── FALCON HUNTING & FISH PREY ANIMATION ───────────────────────
let falconTimer = 0;

function drawFalconHuntingFish(ctx, pondX, pondY) {
    const isMobile = W < 600;
    const cycleTime = 22.0; // 22 seconds per hunting cycle
    falconTimer = (falconTimer + 0.016) % cycleTime;

    if (falconTimer > 16.0) return; // Hidden during reset phase

    let fx = 0, fy = 0, fAngle = 0, isGrabbing = false, hasFish = false;

    if (falconTimer < 6.0) {
        // Stage 1: Flying in from high right sky towards pond water to hunt (NO FISH YET)
        const progress = falconTimer / 6.0;
        const startX = W * 1.15;
        const startY = H * 0.10;
        const targetX = pondX + W * 0.05;
        const targetY = pondY - 5;

        fx = startX + (targetX - startX) * progress;
        fy = startY + (targetY - startY) * progress + Math.sin(progress * Math.PI) * 25;

        // Tangent flight angle
        const pNext = Math.min(1.0, progress + 0.01);
        const fxNext = startX + (targetX - startX) * pNext;
        const fyNext = startY + (targetY - startY) * pNext + Math.sin(pNext * Math.PI) * 25;
        fAngle = Math.atan2(fyNext - fy, fxNext - fx);
        hasFish = false;

    } else if (falconTimer >= 6.0 && falconTimer < 7.5) {
        // Stage 2: Water Snatch & Splash at pond surface
        const progress = (falconTimer - 6.0) / 1.5;
        fx = pondX + W * 0.05 + progress * 40;
        fy = pondY - 5 + Math.sin(progress * Math.PI) * 4;
        fAngle = -0.1;
        isGrabbing = true;
        hasFish = true;

    } else if (falconTimer >= 7.5 && falconTimer <= 16.0) {
        // Stage 3: Soaring HIGH UP into open upper sky ABOVE CHERRY TREE with fish prey!
        const progress = (falconTimer - 7.5) / 8.5;
        const startX = pondX + W * 0.05 + 40;
        const startY = pondY - 5;
        const endX = -W * 0.35;
        const endY = -H * 0.55; // Soaring high up into top sky well above cherry tree canopy

        fx = startX + (endX - startX) * progress;
        fy = startY + (endY - startY) * progress - Math.sin(progress * Math.PI * 0.85) * H * 0.45;

        const pNext = Math.min(1.0, progress + 0.01);
        const fxNext = startX + (endX - startX) * pNext;
        const fyNext = startY + (endY - startY) * pNext - Math.sin(pNext * Math.PI * 0.85) * H * 0.45;
        fAngle = Math.atan2(fyNext - fy, fxNext - fx);
        hasFish = true;
    }

    ctx.save();
    ctx.translate(fx, fy);
    const fScale = isMobile ? 0.70 : 0.95;

    // Dynamic Water Splash Wave when snatching fish at pond
    if (isGrabbing) {
        ctx.save();
        const splashWave = (falconTimer - 6.0) * 20;
        ctx.beginPath();
        ctx.ellipse(0, 10, 15 + splashWave * 2, 5 + splashWave * 0.8, 0, 0, Math.PI * 2);
        ctx.strokeStyle = 'rgba(224, 242, 254, 0.85)';
        ctx.lineWidth = 2.0;
        ctx.stroke();

        // Water droplets spray
        ctx.fillStyle = '#bae6fd';
        for (let i = 0; i < 5; i++) {
            ctx.beginPath();
            ctx.arc((i - 2) * 8, -5 - Math.sin(i * 1.5) * 12, 2, 0, Math.PI * 2);
            ctx.fill();
        }
        ctx.restore();
    }

    // Render Falcon Body & Wings (ALWAYS RIGHT-SIDE UP & FACING FORWARD ALONG FLIGHT PATH)
    const dx = Math.cos(fAngle);
    const dy = Math.sin(fAngle);

    if (dx < 0) {
        // Flying leftward towards pond or sky
        const pitch = Math.atan2(dy, -dx);
        ctx.scale(-fScale, fScale);
        ctx.rotate(-pitch);
    } else {
        // Flying rightward
        const pitch = Math.atan2(dy, dx);
        ctx.scale(fScale, fScale);
        ctx.rotate(pitch);
    }

    const wingFlap = Math.sin(time * 18) * 0.5;

    // Falcon Wings
    ctx.fillStyle = '#451a03';
    ctx.strokeStyle = '#78350f';
    ctx.lineWidth = 1.5;

    // Wing Left (sky side = -Y)
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.quadraticCurveTo(-12, -22 + wingFlap * 15, -28, -12 + wingFlap * 12);
    ctx.quadraticCurveTo(-14, -2, 0, 2);
    ctx.fill(); ctx.stroke();

    // Wing Right (earth side = +Y)
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.quadraticCurveTo(-12, 22 - wingFlap * 15, -28, 12 - wingFlap * 12);
    ctx.quadraticCurveTo(-14, 2, 0, -2);
    ctx.fill(); ctx.stroke();

    // Falcon Feathered Body
    ctx.beginPath();
    ctx.ellipse(0, 0, 14, 7, 0, 0, Math.PI * 2);
    ctx.fillStyle = '#78350f';
    ctx.fill();

    // Cream Underside (+Y = always ground-facing)
    ctx.beginPath();
    ctx.ellipse(2, 2.5, 7, 3.5, 0, 0, Math.PI * 2);
    ctx.fillStyle = '#fef3c7';
    ctx.fill();

    // Tail Feathers (-X = trailing behind)
    ctx.beginPath();
    ctx.moveTo(-12, -3);
    ctx.lineTo(-24, -6);
    ctx.lineTo(-24, 6);
    ctx.lineTo(-12, 3);
    ctx.fillStyle = '#291002';
    ctx.fill();

    // Predatory Head & Curved Hook Beak (+X = forward)
    ctx.beginPath();
    ctx.arc(10, -1, 5.5, 0, Math.PI * 2);
    ctx.fillStyle = '#9a3412';
    ctx.fill();

    // Golden Sharp Eyes (-Y side = sky-facing)
    ctx.beginPath();
    ctx.arc(12, -2, 1.2, 0, Math.PI * 2);
    ctx.fillStyle = '#f59e0b';
    ctx.fill();

    // Hooked Beak
    ctx.beginPath();
    ctx.moveTo(14, -2);
    ctx.quadraticCurveTo(20, 0, 17, 4);
    ctx.lineTo(14, 1);
    ctx.fillStyle = '#f59e0b';
    ctx.fill();

    // Sharp Golden Talons clutching the prey fish (+Y = always below = ground side)
    ctx.strokeStyle = '#eab308';
    ctx.lineWidth = 2.0;
    ctx.beginPath();
    ctx.moveTo(2, 5); ctx.lineTo(4, 11);
    ctx.moveTo(6, 5); ctx.lineTo(8, 11);
    ctx.stroke();

    // ── SNATCHED PREY KOI FISH HANGING IN TALONS ───────────────────
    if (hasFish) {
        ctx.save();
        ctx.translate(5, 14);
        const fishWriggle = Math.sin(time * 24) * 0.35;
        ctx.rotate(0.5 + fishWriggle);

        // Bright Orange Koi Body
        ctx.beginPath();
        ctx.ellipse(0, 0, 11, 4.5, 0, 0, Math.PI * 2);
        ctx.fillStyle = '#f97316';
        ctx.fill();

        // White & Golden Koi Patches
        ctx.beginPath();
        ctx.ellipse(-3, 0, 4, 3, 0, 0, Math.PI * 2);
        ctx.fillStyle = '#ffffff';
        ctx.fill();

        // Flapping Koi Tail
        ctx.beginPath();
        ctx.moveTo(-10, 0);
        ctx.lineTo(-17, -4 + fishWriggle * 5);
        ctx.lineTo(-17, 4 - fishWriggle * 5);
        ctx.closePath();
        ctx.fillStyle = '#ef4444';
        ctx.fill();

        // Water droplets dripping off captured fish
        ctx.fillStyle = '#bae6fd';
        ctx.beginPath();
        ctx.arc(0, 6, 1.5, 0, Math.PI * 2);
        ctx.fill();

        ctx.restore();
    }

    ctx.restore();
}

// ── FLOATING WATER LILIES & LOTUS FLOWERS IN POND ──────────────
function drawWaterLilies(ctx, pondX, pondY, pRadX, pRadY) {
    const isMobile = W < 600;
    const padScale = isMobile ? 0.65 : 0.90;
    const prX = pRadX || (W * (isMobile ? 0.35 : 0.28));
    const prY = pRadY || (H * (isMobile ? 0.08 : 0.08));

    const lilies = [
        { relX: -0.55, relY: -0.15, size: isMobile ? 10 : 13, hasFlower: true, color: '#f472b6', phase: 0 },
        { relX: -0.20, relY: 0.25, size: isMobile ? 12 : 16, hasFlower: true, color: '#ffffff', phase: 1.5 },
        { relX: 0.28, relY: -0.30, size: isMobile ? 11 : 14, hasFlower: false, color: '', phase: 3.0 },
        { relX: 0.58, relY: 0.15, size: isMobile ? 13 : 17, hasFlower: true, color: '#f472b6', phase: 4.2 },
        { relX: -0.05, relY: 0.40, size: isMobile ? 9 : 11, hasFlower: true, color: '#fbcfe8', phase: 2.1 }
    ];

    lilies.forEach(l => {
        const floatX = pondX + prX * l.relX + Math.sin(time * 1.5 + l.phase) * 2;
        const floatY = pondY + prY * l.relY + Math.cos(time * 1.8 + l.phase) * 1.2;

        ctx.save();
        ctx.translate(floatX, floatY);
        ctx.scale(padScale, padScale * 0.45);

        // Water Ripple Glow under Pad
        ctx.beginPath();
        ctx.ellipse(0, 2, l.size + 4, (l.size + 4) * 0.8, 0, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(186, 230, 253, 0.25)';
        ctx.fill();

        // 1. Lily Pad Disc with V-Notch Cut
        ctx.beginPath();
        const notchAngle = 0.35 + l.phase * 0.5;
        ctx.arc(0, 0, l.size, notchAngle, notchAngle + Math.PI * 1.82);
        ctx.lineTo(0, 0);
        ctx.closePath();

        const padGrad = ctx.createRadialGradient(-3, -3, 0, 0, 0, l.size);
        padGrad.addColorStop(0, '#4ade80');
        padGrad.addColorStop(0.6, '#16a34a');
        padGrad.addColorStop(1, '#14532d');
        ctx.fillStyle = padGrad;
        ctx.fill();

        ctx.strokeStyle = '#166534';
        ctx.lineWidth = 1.2;
        ctx.stroke();

        // Vein Lines
        ctx.strokeStyle = 'rgba(187, 247, 208, 0.4)';
        ctx.lineWidth = 0.8;
        for (let a = 0; a < 4; a++) {
            const vAngle = notchAngle + 0.4 + a * 1.1;
            ctx.beginPath();
            ctx.moveTo(0, 0);
            ctx.lineTo(Math.cos(vAngle) * l.size * 0.85, Math.sin(vAngle) * l.size * 0.85);
            ctx.stroke();
        }

        // 2. Blooming Water Lily / Lotus Flower
        if (l.hasFlower) {
            ctx.save();
            ctx.scale(1, 2.2);
            ctx.translate(0, -l.size * 0.2);

            ctx.shadowColor = l.color;
            ctx.shadowBlur = 8;

            const numPetals = 8;
            const petalLen = l.size * 0.65;

            // Outer Petals Layer
            ctx.fillStyle = l.color;
            for (let p = 0; p < numPetals; p++) {
                const angle = (p / numPetals) * Math.PI * 2;
                ctx.beginPath();
                ctx.moveTo(0, 0);
                ctx.quadraticCurveTo(Math.cos(angle - 0.3) * petalLen, Math.sin(angle - 0.3) * petalLen, Math.cos(angle) * petalLen * 1.2, Math.sin(angle) * petalLen * 1.2);
                ctx.quadraticCurveTo(Math.cos(angle + 0.3) * petalLen, Math.sin(angle + 0.3) * petalLen, 0, 0);
                ctx.fill();
            }

            // Inner Petals Layer
            ctx.fillStyle = '#ffffff';
            for (let p = 0; p < numPetals; p++) {
                const angle = (p / numPetals) * Math.PI * 2 + 0.4;
                ctx.beginPath();
                ctx.moveTo(0, 0);
                ctx.quadraticCurveTo(Math.cos(angle - 0.2) * (petalLen * 0.7), Math.sin(angle - 0.2) * (petalLen * 0.7), Math.cos(angle) * (petalLen * 0.85), Math.sin(angle) * (petalLen * 0.85));
                ctx.quadraticCurveTo(Math.cos(angle + 0.2) * (petalLen * 0.7), Math.sin(angle + 0.2) * (petalLen * 0.7), 0, 0);
                ctx.fill();
            }

            // Golden Stamen Center
            ctx.beginPath();
            ctx.arc(0, 0, l.size * 0.22, 0, Math.PI * 2);
            ctx.fillStyle = '#fbbf24';
            ctx.fill();

            ctx.restore();
        }

        ctx.restore();
    });
}

// ── LUSH SWAYING GRASS TUFTS & POND WATER REEDS ────────────────
function drawLushSwayingGrass(ctx, pX, pY, pRadX, pRadY) {
    const isMobile = W < 600;
    const pondX = pX || W * 0.5;
    const pondY = pY || H * 0.88;
    const pondRadiusX = pRadX || W * (isMobile ? 0.35 : 0.28);

    ctx.save();

    // 1. Water Reeds & Shoreline Grass along Pond Edge (Left & Right Banks)
    const pondReeds = [
        { x: pondX - pondRadiusX * 0.95, y: pondY - 10, count: 7, height: isMobile ? 20 : 26, swayPhase: 0 },
        { x: pondX - pondRadiusX * 0.85, y: pondY + 5, count: 6, height: isMobile ? 18 : 22, swayPhase: 1.2 },
        { x: pondX - pondRadiusX * 0.70, y: pondY + 15, count: 5, height: isMobile ? 14 : 18, swayPhase: 2.4 },
        { x: pondX + pondRadiusX * 0.70, y: pondY + 14, count: 6, height: isMobile ? 16 : 20, swayPhase: 3.5 },
        { x: pondX + pondRadiusX * 0.88, y: pondY + 4, count: 8, height: isMobile ? 22 : 28, swayPhase: 4.8 },
        { x: pondX + pondRadiusX * 0.96, y: pondY - 8, count: 7, height: isMobile ? 18 : 24, swayPhase: 1.0 }
    ];

    const reedColor = currentSkyIndex === 0 ? '#a3e635' : '#84cc16';
    ctx.strokeStyle = reedColor;

    pondReeds.forEach(rg => {
        for (let i = 0; i < rg.count; i++) {
            const bx = rg.x + (i - rg.count * 0.5) * 4;
            const h = rg.height + Math.sin(i * 1.7) * 6;
            const sway = Math.sin(time * 2.2 + rg.swayPhase + i * 0.3) * (6 + i * 0.8);

            ctx.lineWidth = 1.6 - (i % 2) * 0.4;
            ctx.beginPath();
            ctx.moveTo(bx, rg.y);
            ctx.quadraticCurveTo(bx + sway * 0.5, rg.y - h * 0.6, bx + sway, rg.y - h);
            ctx.stroke();

            if (i % 2 === 0) {
                ctx.fillStyle = currentSkyIndex === 0 ? '#fbcfe8' : '#e0e7ff';
                ctx.beginPath();
                ctx.arc(bx + sway, rg.y - h, 2.0, 0, Math.PI * 2);
                ctx.fill();
            }
        }
    });

    ctx.restore();
}


// ── PARK BENCH & STICKMEN REUNION SCENE ────────────────────────
let walkerX = -50;
let sitTimer = 0;
let musicNotes = [];

function drawParkBenchAndStickmen(ctx) {
    const isMobile = W < 600;
    const isPortrait = H > W;

    // Responsive Hill & Bench Positioning (Anchored dynamically to grassy hill)
    const hillY = H * (isPortrait ? 0.68 : 0.70);
    const benchX = W * (isMobile ? (isPortrait ? 0.22 : 0.28) : 0.35);
    const benchY = hillY + (isMobile ? (isPortrait ? 18 : 22) : 26);
    const benchW = isMobile ? (isPortrait ? 52 : 58) : 68;
    const benchH = isMobile ? 22 : 26;

    ctx.save();

    // 0. Cute Perched Pink Songbird on Bench Left Armrest
    const birdX = benchX - 2;
    const birdY = benchY - 14;
    ctx.save();
    ctx.beginPath();
    ctx.ellipse(birdX, birdY, 4, 3, -0.2, 0, Math.PI * 2);
    ctx.fillStyle = '#ec4899';
    ctx.fill();
    // Head & Beak
    ctx.beginPath();
    ctx.arc(birdX + 3, birdY - 2, 2.5, 0, Math.PI * 2);
    ctx.fillStyle = '#f472b6';
    ctx.fill();
    ctx.beginPath();
    ctx.moveTo(birdX + 5, birdY - 2);
    ctx.lineTo(birdX + 7, birdY - 1);
    ctx.lineTo(birdX + 5, birdY);
    ctx.fillStyle = '#f59e0b';
    ctx.fill();
    ctx.restore();

    // 1. Draw Wooden Garden Bench with Cast Iron Legs
    ctx.strokeStyle = '#1b120c';
    ctx.lineWidth = 3.5;
    ctx.beginPath();
    ctx.moveTo(benchX + 6, benchY + 12);
    ctx.lineTo(benchX + 4, benchY + benchH + 8);
    ctx.moveTo(benchX + benchW - 6, benchY + 12);
    ctx.lineTo(benchX + benchW - 4, benchY + benchH + 8);
    ctx.stroke();

    // Bench Backrest Slats
    ctx.fillStyle = '#8b4513';
    ctx.fillRect(benchX, benchY - 14, benchW, 5);
    ctx.fillStyle = '#a0522d';
    ctx.fillRect(benchX, benchY - 7, benchW, 5);

    // Bench Seat Plank
    ctx.fillStyle = '#cd853f';
    ctx.fillRect(benchX - 2, benchY, benchW + 4, 6);
    ctx.fillStyle = '#8b4513';
    ctx.fillRect(benchX - 2, benchY + 6, benchW + 4, 3);

    // 2. Sitting Partner (Waiting on Left Seat)
    const waitSeatX = benchX + 18;
    const seatY = benchY - 2;

    ctx.strokeStyle = '#ffffff';
    ctx.fillStyle = '#ffffff';
    ctx.lineWidth = 2.5;

    // Head (Waiting partner with flower ribbon)
    ctx.beginPath();
    ctx.arc(waitSeatX, seatY - 24, 6, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();

    // Small Pink Flower Ribbon on Head
    ctx.fillStyle = '#ff80bf';
    ctx.beginPath();
    ctx.arc(waitSeatX + 4, seatY - 28, 3, 0, Math.PI * 2);
    ctx.fill();

    // Torso (Upright on bench)
    ctx.strokeStyle = '#ffffff';
    ctx.beginPath();
    ctx.moveTo(waitSeatX, seatY - 18);
    ctx.lineTo(waitSeatX, seatY - 2);
    ctx.stroke();

    // Seated Legs (Facing forward over front edge of bench)
    // Left Leg
    ctx.beginPath();
    ctx.moveTo(waitSeatX - 2, seatY - 2);
    ctx.lineTo(waitSeatX - 2, seatY + 5);
    ctx.lineTo(waitSeatX - 2, seatY + 16);
    ctx.lineTo(waitSeatX + 2, seatY + 16);
    ctx.stroke();

    // Right Leg
    ctx.beginPath();
    ctx.moveTo(waitSeatX + 2, seatY - 2);
    ctx.lineTo(waitSeatX + 2, seatY + 5);
    ctx.lineTo(waitSeatX + 2, seatY + 16);
    ctx.lineTo(waitSeatX + 6, seatY + 16);
    ctx.stroke();

    // Arms (Rested in lap)
    ctx.beginPath();
    ctx.moveTo(waitSeatX, seatY - 14);
    ctx.lineTo(waitSeatX + 6, seatY - 5);
    ctx.stroke();

    // 3. Walking Partner Logic & Animation
    const startX = -40;
    const targetSeatX = benchX + benchW - 18;

    if (walkerX < startX) walkerX = startX;

    const isArrived = walkerX >= targetSeatX;

    if (!isArrived) {
        // Gentle relaxed walking towards the bench
        walkerX += 0.85;
        const walkCycle = time * 6.5;
        const headBob = Math.sin(walkCycle * 2) * 1.2;

        // Head (Facing right towards the bench)
        const headX = walkerX + 2;
        const headY = seatY - 26 + headBob;

        ctx.strokeStyle = '#ffffff';
        ctx.fillStyle = '#ffffff';
        ctx.lineWidth = 2.5;

        ctx.beginPath();
        ctx.arc(headX, headY, 6.5, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();

        // Torso (Slight natural forward lean)
        const shoulderX = headX - 1;
        const shoulderY = headY + 7;
        const hipX = walkerX;
        const hipY = headY + 22;

        ctx.beginPath();
        ctx.moveTo(shoulderX, shoulderY);
        ctx.lineTo(hipX, hipY);
        ctx.stroke();

        // Leg Kinematics (Shortened gentle step stride)
        const leg1Phase = Math.sin(walkCycle);
        const leg2Phase = Math.sin(walkCycle + Math.PI);

        // Back Leg (Draw first for depth)
        const knee2X = hipX + leg2Phase * 4.5;
        const knee2Y = hipY + 11 + (leg2Phase > 0 ? -leg2Phase * 2 : 0);
        const foot2X = knee2X + leg2Phase * 3.5;
        const foot2Y = seatY + 16;

        ctx.strokeStyle = 'rgba(230, 230, 245, 0.75)';
        ctx.beginPath();
        ctx.moveTo(hipX, hipY);
        ctx.lineTo(knee2X, knee2Y);
        ctx.lineTo(foot2X, foot2Y);
        ctx.lineTo(foot2X + 3, foot2Y);
        ctx.stroke();

        // Front Leg (Crisp bright white)
        const knee1X = hipX + leg1Phase * 4.5;
        const knee1Y = hipY + 11 + (leg1Phase > 0 ? -leg1Phase * 2 : 0);
        const foot1X = knee1X + leg1Phase * 3.5;
        const foot1Y = seatY + 16;

        ctx.strokeStyle = '#ffffff';
        ctx.beginPath();
        ctx.moveTo(hipX, hipY);
        ctx.lineTo(knee1X, knee1Y);
        ctx.lineTo(foot1X, foot1Y);
        ctx.lineTo(foot1X + 3, foot1Y);
        ctx.stroke();

        // Arm Swing & Guitar Strap Carriage
        const arm1Angle = -leg1Phase * 0.25;
        const arm2Angle = leg1Phase * 0.18;

        // Back Arm
        ctx.beginPath();
        ctx.moveTo(shoulderX, shoulderY);
        ctx.lineTo(shoulderX + Math.sin(arm2Angle) * 11, shoulderY + Math.cos(arm2Angle) * 11);
        ctx.stroke();

        // Front Arm swinging gently
        ctx.beginPath();
        ctx.moveTo(shoulderX, shoulderY);
        ctx.lineTo(shoulderX + Math.sin(arm1Angle) * 11, shoulderY + Math.cos(arm1Angle) * 11);
        ctx.stroke();

        // Render Acoustic Guitar slung over his back while walking
        drawAcousticGuitar(ctx, shoulderX - 5, shoulderY + 4, 0.45, false);

    }

    else {
        // Partner has arrived and sits down on the right side of the bench!
        const walkSeatX = targetSeatX;

        // Head
        ctx.fillStyle = '#ffffff';
        ctx.beginPath();
        ctx.arc(walkSeatX, seatY - 24, 6.5, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();

        // Torso
        ctx.beginPath();
        ctx.moveTo(walkSeatX, seatY - 18);
        ctx.lineTo(walkSeatX, seatY - 2);
        ctx.stroke();

        // Seated Legs (Facing forward over front edge of bench)
        // Left Leg
        ctx.beginPath();
        ctx.moveTo(walkSeatX - 2, seatY - 2);
        ctx.lineTo(walkSeatX - 2, seatY + 5);
        ctx.lineTo(walkSeatX - 2, seatY + 16);
        ctx.lineTo(walkSeatX + 2, seatY + 16);
        ctx.stroke();

        // Right Leg
        ctx.beginPath();
        ctx.moveTo(walkSeatX + 2, seatY - 2);
        ctx.lineTo(walkSeatX + 2, seatY + 5);
        ctx.lineTo(walkSeatX + 2, seatY + 16);
        ctx.lineTo(walkSeatX + 6, seatY + 16);
        ctx.stroke();

        // Arm holding/strumming guitar on lap
        const strumHandX = Math.sin(time * 8.5) * 3;
        ctx.beginPath();
        ctx.moveTo(walkSeatX, seatY - 14);
        ctx.lineTo(walkSeatX - 4 + strumHandX, seatY - 4);
        ctx.stroke();

        // Render Acoustic Guitar on his lap while sitting & strumming
        drawAcousticGuitar(ctx, walkSeatX - 5, seatY - 2, 0.25, true);

        // 4. Romantic Floating Pulsating Heart above the couple (💖)
        sitTimer += 0.016;
        const heartY = seatY - 44 + Math.sin(time * 3) * 4;
        const heartX = (waitSeatX + walkSeatX) * 0.5;
        const heartScale = 1.0 + Math.sin(time * 4) * 0.15;

        ctx.save();
        ctx.translate(heartX, heartY);
        ctx.scale(heartScale, heartScale);
        ctx.font = '16px sans-serif';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.shadowColor = 'rgba(255, 100, 200, 0.8)';
        ctx.shadowBlur = 12;
        ctx.fillText('💖', 0, 0);
        ctx.restore();

        // 5. Floating Music Notes rising gently from Guitar
        if (musicStarted && Math.random() < 0.04) {
            musicNotes.push({
                x: walkSeatX - 5 + (Math.random() * 10 - 5),
                y: seatY - 10,
                vx: (Math.random() - 0.5) * 0.4,
                vy: -0.5 - Math.random() * 0.4,
                alpha: 1.0,
                symbol: Math.random() > 0.5 ? '🎵' : '🎶',
                size: 11 + Math.random() * 5
            });
        }

        for (let i = musicNotes.length - 1; i >= 0; i--) {
            const n = musicNotes[i];
            n.x += n.vx + Math.sin(time * 3 + n.y * 0.05) * 0.3;
            n.y += n.vy;
            n.alpha -= 0.008;

            if (n.alpha <= 0) {
                musicNotes.splice(i, 1);
                continue;
            }

            ctx.save();
            ctx.globalAlpha = n.alpha;
            ctx.font = `${n.size}px sans-serif`;
            ctx.fillStyle = '#f5d0fe';
            ctx.shadowColor = 'rgba(232, 109, 181, 0.8)';
            ctx.shadowBlur = 8;
            ctx.fillText(n.symbol, n.x, n.y);
            ctx.restore();
        }

        // Trigger Dialogue & Lyrics Engine
        updateDialogueAndLyrics(true);
    }

    ctx.restore();
}

// ── ACOUSTIC GUITAR RENDERER ───────────────────────────────────
function drawAcousticGuitar(ctx, x, y, angle, isStrumming) {
    ctx.save();
    ctx.translate(x, y);
    ctx.rotate(angle);

    // Guitar Body (Warm Amber Wood)
    ctx.beginPath();
    ctx.ellipse(-2, 0, 7, 10, 0, 0, Math.PI * 2);
    ctx.fillStyle = '#d97706';
    ctx.fill();
    ctx.strokeStyle = '#78350f';
    ctx.lineWidth = 1.2;
    ctx.stroke();

    // Soundhole
    ctx.beginPath();
    ctx.arc(-2, 0, 2.5, 0, Math.PI * 2);
    ctx.fillStyle = '#1c0a02';
    ctx.fill();

    // Guitar Neck & Headstock
    ctx.fillStyle = '#451a03';
    ctx.fillRect(-3, -18, 2.5, 12);

    // Headstock
    ctx.fillRect(-4, -22, 4.5, 4);

    // Strumming Sparkle Glow Effect
    if (isStrumming) {
        const glow = Math.sin(time * 10) * 0.4 + 0.6;
        ctx.beginPath();
        ctx.arc(-2, 0, 4, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255, 220, 150, ${glow * 0.4})`;
        ctx.fill();
    }

    ctx.restore();
}

// ── DIALOGUE & SYNCHRONIZED LYRICS ENGINE ──────────────────────
const dialogueBox = document.getElementById('dialogue-box');
const dialogueSpeaker = document.getElementById('dialogue-speaker');
const dialogueText = document.getElementById('dialogue-text');

const lyricsBox = document.getElementById('lyrics-box');
const lyricsSub = document.getElementById('lyrics-sub');
const lyricsLine = document.getElementById('lyrics-line');

const bgMusic = document.getElementById('bg-music');
if (bgMusic) {
    bgMusic.loop = true;
    bgMusic.muted = false;
    bgMusic.volume = 1.0;
}

const btnMusicUpload = document.getElementById('btn-music-upload');
const musicInput = document.getElementById('music-input');
const musicLabel = document.getElementById('music-label');

const CONVERSATION = [
    { speaker: '', text: 'Hi, Claue. 🌸' },
    { speaker: '', text: "Long day at school, huh? You probably gave it your all today." },
    { speaker: '', text: "Don't think about assignments or deadlines for a while. Just rest... I brought my guitar to play something for you." },
    { speaker: '', text: "Keep this song in your head and try to get some sleep." },
];

const SONG_LYRICS = [
    { time: 0, text: '🎵 (Soft acoustic guitar melody playing...)' },
    { time: 4, text: '✨ "The day\'s finally over, let the quiet evening welcome you home..."' },
    { time: 10, text: '🌸 "Every lesson, every challenge—you made it through another day..."' },
    { time: 17, text: '🍃 "Leave the stress behind for tonight, tomorrow can wait until morning..."' },
    { time: 24, text: '🌙 "Rest well, Claue... Sleep peacefully and sweet dreams. 💖"' }
];

let dialogueIndex = -1;
let dialogueTimer = 0;
let conversationFinished = false;
let customMusicLoaded = false;
let isArrived = false;
let lyricsCompleted = false;

// Handle Music File Upload
if (btnMusicUpload && musicInput) {
    btnMusicUpload.addEventListener('click', () => musicInput.click());
    musicInput.addEventListener('change', (e) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            const url = URL.createObjectURL(file);
            bgMusic.src = url;
            bgMusic.loop = true;
            customMusicLoaded = true;
            musicLabel.textContent = file.name.substring(0, 10) + '...';
            if (conversationFinished) startMusicAndLyrics();
        }
    });
}

let musicStarted = false;
let conversationDelayTimer = 0;
let musicDelayTimer = 0;

// ── DIALOGUE TIMING & DELAY CONFIGURATION ──────────────────────
const CONVERSATION_START_DELAY = 2.2; // Pause (seconds) after arrival before 1st dialogue appears
const DIALOGUE_INTERVAL = 3.5;        // Duration (seconds) each dialogue speech bubble stays on screen
const MUSIC_START_DELAY = 1.0;        // Pause (seconds) after dialogue ends before music starts

function updateDialogueAndLyrics(arrived) {
    isArrived = arrived;
    if (!sceneActive) return;

    // Dynamically lock dialogue box position right above couple's heads across all device viewports
    if (dialogueBox) {
        const isMobile = W < 600;
        const isPortrait = H > W;

        const hillY = H * (isPortrait ? 0.68 : 0.70);
        const benchX = W * (isMobile ? (isPortrait ? 0.22 : 0.28) : 0.35);
        const benchY = hillY + (isMobile ? (isPortrait ? 18 : 22) : 26);
        const benchW = isMobile ? (isPortrait ? 52 : 58) : 68;

        const coupleHeadX = benchX + benchW * 0.5;
        const coupleHeadY = benchY - (isMobile ? 24 : 28);

        // Dynamically lock dialogue box position right above couple's heads without edge clipping
        const boxWidth = dialogueBox.offsetWidth || 280;
        const halfW = boxWidth / 2;

        // Ensure boxLeft >= 16px and boxRight <= W - 16px
        let targetX = coupleHeadX;
        if (targetX - halfW < 16) {
            targetX = 16 + halfW;
        } else if (targetX + halfW > W - 16) {
            targetX = W - 16 - halfW;
        }

        dialogueBox.style.left = `${targetX}px`;
        dialogueBox.style.top = `${coupleHeadY - 14}px`;

        // Position the speech bubble arrow tail precisely over couple's heads
        const arrowOffset = coupleHeadX - (targetX - halfW);
        const arrowPercent = Math.max(15, Math.min(85, (arrowOffset / boxWidth) * 100));
        dialogueBox.style.setProperty('--arrow-left', `${arrowPercent}%`);
    }

    // 1. Dialogue Phase (Starts after gentle pause when he sits down)
    if (isArrived && !conversationFinished) {
        conversationDelayTimer += 0.016;

        if (conversationDelayTimer >= CONVERSATION_START_DELAY) {
            dialogueTimer += 0.016;
            if (dialogueIndex === -1 || dialogueTimer > DIALOGUE_INTERVAL) {
                dialogueIndex++;
                dialogueTimer = 0;

                if (dialogueIndex < CONVERSATION.length) {
                    const item = CONVERSATION[dialogueIndex];
                    dialogueSpeaker.textContent = item.speaker;
                    dialogueText.textContent = item.text;
                    dialogueBox.classList.remove('hidden');
                } else {
                    // Conversation finished -> Dialogue box disappears!
                    conversationFinished = true;
                    dialogueBox.classList.add('hidden');
                }
            }
        }
    }

    // 2. Audio & Lyrics Delayed Phase (Starts 2s after dialogue disappears)
    if (conversationFinished) {
        musicDelayTimer += 0.016;

        if (musicDelayTimer >= MUSIC_START_DELAY) {
            if (!musicStarted) {
                musicStarted = true;
                if (!bgMusic.src || bgMusic.src === '') {
                    bgMusic.src = 'music.mp3';
                }
                bgMusic.loop = true;
                bgMusic.muted = false;
                bgMusic.volume = 1.0;
                bgMusic.play().catch(e => {
                    console.log("Audio play deferred for user interaction", e);
                });
                if (lyricsSub) lyricsSub.textContent = customMusicLoaded ? '🎶 Playing Your Uploaded Song' : '🌸 Relax & Enjoy the Melody';
                if (lyricsBox && !lyricsCompleted) lyricsBox.classList.remove('hidden');
            }

            const curTime = bgMusic.currentTime || (time % 35);

            // Display messages sequentially
            if (!lyricsCompleted) {
                let activeIdx = -1;
                for (let i = SONG_LYRICS.length - 1; i >= 0; i--) {
                    if (curTime >= SONG_LYRICS[i].time) {
                        activeIdx = i;
                        break;
                    }
                }

                if (activeIdx >= 0) {
                    if (lyricsLine) lyricsLine.textContent = SONG_LYRICS[activeIdx].text;

                    // Automatically hide message box 6 seconds after the final message is shown
                    const lastMsg = SONG_LYRICS[SONG_LYRICS.length - 1];
                    if (activeIdx === SONG_LYRICS.length - 1 && curTime >= lastMsg.time + 6.0) {
                        lyricsCompleted = true;
                        if (lyricsBox) lyricsBox.classList.add('hidden');
                    }
                }
            }
        }
    }
}

function startMusicAndLyrics() {
    if (lyricsSub) lyricsSub.textContent = customMusicLoaded ? '🎶 Playing Your Uploaded Song' : '🌸 Relax & Enjoy the Melody';
    if (lyricsBox && !lyricsCompleted) lyricsBox.classList.remove('hidden');

    if (bgMusic) {
        bgMusic.loop = true;
        if (bgMusic.src) {
            bgMusic.play().catch(() => { });
        } else {
            playGentleChime();
        }
    }
}



// ── MAIN 3D RENDER ENGINE (60-144 FPS) ─────────────────────────
function animate() {
    if (!sceneActive) return;

    time += 0.016;

    rotY += (targetRotY - rotY) * 0.08;
    rotX += (targetRotX - rotX) * 0.08;


    // 1. Draw Background Village, Ground Hill, Animals & Flying Kites
    tCtx.clearRect(0, 0, W, H);
    drawDistantVillageAndTrees(tCtx);
    drawGroundHill(tCtx);
    drawKidsPlayingKites(tCtx);
    drawSkyFlock(tCtx);
    drawBunnies(tCtx);
    drawGlowingButterflies(tCtx);
    drawParkBenchAndStickmen(tCtx);

    // 2. Build 3D Render Queue with Z-Depth Sorting
    const renderQueue = [];

    const windSwayX = Math.sin(time * 1.6) * currentWind * 35;
    const windSwayZ = Math.cos(time * 1.3) * currentWind * 25;

    // Project all 3D Branches
    for (let branch of all3DBranches) {
        const swayFactor = Math.pow(branch.depth / branch.maxDepth, 1.5);
        const startP = project3D(
            branch.startX + windSwayX * (swayFactor - 0.2),
            branch.startY,
            branch.startZ + windSwayZ * (swayFactor - 0.2),
            rotX, rotY
        );
        const midP = project3D(
            branch.midX + windSwayX * (swayFactor - 0.1),
            branch.midY,
            branch.midZ + windSwayZ * (swayFactor - 0.1),
            rotX, rotY
        );
        const endP = project3D(
            branch.endX + windSwayX * swayFactor,
            branch.endY,
            branch.endZ + windSwayZ * swayFactor,
            rotX, rotY
        );

        renderQueue.push({
            type: 'branch',
            depth: (startP.z + endP.z) * 0.5,
            start: startP,
            mid: midP,
            end: endP,
            thickness: branch.thickness * ((startP.scale + endP.scale) * 0.5),
            bDepth: branch.depth
        });
    }

    // Project all 3D Weeping Drapes (cherry.jpg signature Feature)
    for (let drape of all3DDrapes) {
        const swayX = Math.sin(time * 1.8 + drape.x) * currentWind * 20;
        const p = project3D(drape.x + swayX, drape.y, drape.z, rotX, rotY);
        renderQueue.push({
            type: 'drape',
            depth: p.z,
            proj: p,
            sprite: drape.sprite
        });
    }

    // Project all 3D Ripe Cherries (🍒)
    for (let cherry of all3DCherries) {
        const swayX = Math.sin(time * 1.8 + cherry.x) * currentWind * 20;
        const p = project3D(cherry.x + swayX, cherry.y, cherry.z, rotX, rotY);
        renderQueue.push({
            type: 'cherry',
            depth: p.z,
            proj: p,
            sprite: cherry.sprite
        });
    }

    // Project all 3D Blossom Clusters
    for (let c of all3DClusters) {
        const swayX = Math.sin(time * 2 + c.phase) * currentWind * 30;
        const p = project3D(c.x + swayX, c.y, c.z, rotX, rotY);
        renderQueue.push({
            type: 'cluster',
            depth: p.z,
            proj: p,
            sprite: c.sprite
        });
    }

    // Project all 3D Falling Petals
    pCtx.clearRect(0, 0, W, H);

    // Release 2 to 3 leaves every 10 seconds (600 frames at 60fps)
    leafReleaseTimer += 0.016;
    if (leafReleaseTimer >= 10.0) {
        leafReleaseTimer = 0;
        triggerLeafFallBatch();
    }

    for (let pet of particles3D) {
        if (!pet.active) continue;
        pet.update(currentWind);
        const p = project3D(pet.x, pet.y, pet.z, rotX, rotY);

        if (p.z > -700 && pet.opacity > 0 && pet.delay <= 0) {
            renderQueue.push({
                type: 'petal',
                depth: p.z,
                proj: p,
                sprite: pet.sprite,
                rotZ: pet.rotZ,
                opacity: pet.opacity
            });
        }
    }

    // 3. SORT BACK-TO-FRONT BY Z-DEPTH
    renderQueue.sort((a, b) => b.depth - a.depth);

    // 4. RENDER SORTED 3D PRIMITIVES
    for (let item of renderQueue) {
        if (item.type === 'branch') {
            const t = Math.max(1.8, item.thickness);
            const d = item.bDepth;
            tCtx.save();
            tCtx.lineCap = 'round';
            tCtx.lineJoin = 'round';

            // 1. Deep Underside Ambient Shadow
            tCtx.beginPath();
            tCtx.moveTo(item.start.x, item.start.y + t * 0.18);
            tCtx.quadraticCurveTo(item.mid.x, item.mid.y + t * 0.18, item.end.x, item.end.y + t * 0.18);
            tCtx.strokeStyle = '#12030f';
            tCtx.lineWidth = t * 1.15;
            tCtx.stroke();

            // 2. Rich Mahogany / Bark Core Layer
            tCtx.beginPath();
            tCtx.moveTo(item.start.x, item.start.y);
            tCtx.quadraticCurveTo(item.mid.x, item.mid.y, item.end.x, item.end.y);
            tCtx.strokeStyle = d === 1 ? WOOD_COLORS.dark : (d <= 3 ? WOOD_COLORS.mid : WOOD_COLORS.light);
            tCtx.lineWidth = t;
            tCtx.stroke();

            // 3. Upper Lit Edge Bark Highlight (3D Cylindrical lighting)
            tCtx.beginPath();
            tCtx.moveTo(item.start.x, item.start.y - t * 0.18);
            tCtx.quadraticCurveTo(item.mid.x, item.mid.y - t * 0.18, item.end.x, item.end.y - t * 0.18);
            tCtx.strokeStyle = 'rgba(210, 80, 150, 0.42)';
            tCtx.lineWidth = Math.max(1, t * 0.32);
            tCtx.stroke();

            // 4. Branch Fork Joint Cap
            if (t > 4) {
                tCtx.beginPath();
                tCtx.arc(item.start.x, item.start.y, t * 0.5, 0, Math.PI * 2);
                tCtx.fillStyle = '#3c0d29';
                tCtx.fill();
            }

            tCtx.restore();


        } else if (item.type === 'drape') {
            const p = item.proj;
            const w = item.sprite.width * p.scale;
            const h = item.sprite.height * p.scale;
            tCtx.save();
            tCtx.globalAlpha = Math.min(1.0, Math.max(0.4, (1100 - item.depth) / 1100));
            tCtx.drawImage(item.sprite, p.x - w / 2, p.y, w, h);
            tCtx.restore();

        } else if (item.type === 'cluster') {
            const p = item.proj;
            const w = item.sprite.width * p.scale;
            const h = item.sprite.height * p.scale;
            tCtx.save();
            tCtx.globalAlpha = Math.min(1.0, Math.max(0.45, (1100 - item.depth) / 1100));
            tCtx.drawImage(item.sprite, p.x - w / 2, p.y - h / 2, w, h);
            tCtx.restore();

        } else if (item.type === 'cherry') {
            const p = item.proj;
            const w = item.sprite.width * p.scale * 0.9;
            const h = item.sprite.height * p.scale * 0.9;
            tCtx.save();
            tCtx.globalAlpha = Math.min(1.0, Math.max(0.5, (1100 - item.depth) / 1100));
            tCtx.drawImage(item.sprite, p.x - w / 2, p.y, w, h);
            tCtx.restore();

        } else if (item.type === 'petal') {
            const p = item.proj;
            const isMobile = W < 600;
            // Dainty smaller petal scale on Android & mobile screens
            const petalScale = isMobile ? Math.min(0.60, Math.max(0.40, p.scale * 0.65)) : p.scale;
            const w = item.sprite.width * petalScale;
            const h = item.sprite.height * petalScale;
            pCtx.save();
            pCtx.translate(p.x, p.y);
            pCtx.rotate(item.rotZ);
            pCtx.globalAlpha = item.opacity * Math.min(1.0, Math.max(0.4, (1100 - item.depth) / 1100));
            pCtx.drawImage(item.sprite, -w / 2, -h / 2, w, h);
            pCtx.restore();
        }


    }

    requestAnimationFrame(animate);
}

// ── AUDIO CHIMES ───────────────────────────────────────────────
function playGentleChime() {
    if (!audioEnabled) return;
    try {
        if (!audioCtx) {
            audioCtx = new (window.AudioContext || window.webkitAudioContext)();
        }
        if (audioCtx.state === 'suspended') audioCtx.resume();

        const notes = [523.25, 659.25, 783.99, 880.00, 1046.50];
        const note = notes[Math.floor(Math.random() * notes.length)];

        const osc = audioCtx.createOscillator();
        const gain = audioCtx.createGain();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(note, audioCtx.currentTime);

        gain.gain.setValueAtTime(0, audioCtx.currentTime);
        gain.gain.linearRampToValueAtTime(0.06, audioCtx.currentTime + 0.04);
        gain.gain.exponentialRampToValueAtTime(0.0001, audioCtx.currentTime + 2.0);

        osc.connect(gain);
        gain.connect(audioCtx.destination);

        osc.start();
        osc.stop(audioCtx.currentTime + 2.1);
    } catch (e) { }
}

// ── INTERACTIVE 3D ORBIT DRAG LISTENERS ───────────────────────
tCanvas.addEventListener('mousedown', (e) => {
    isDragging = true;
    lastMouseX = e.clientX;
    lastMouseY = e.clientY;
});

window.addEventListener('mousemove', (e) => {
    if (!isDragging) return;
    const dx = e.clientX - lastMouseX;
    const dy = e.clientY - lastMouseY;

    targetRotY += dx * 0.006;
    targetRotX = Math.max(-0.25, Math.min(0.4, targetRotX + dy * 0.004));

    lastMouseX = e.clientX;
    lastMouseY = e.clientY;
});

window.addEventListener('mouseup', () => {
    isDragging = false;
});

// Touch controls for mobile 3D orbiting (Android & iOS)
tCanvas.addEventListener('touchstart', (e) => {
    if (e.touches.length === 1) {
        isDragging = true;
        lastMouseX = e.touches[0].clientX;
        lastMouseY = e.touches[0].clientY;
    }
}, { passive: true });

window.addEventListener('touchmove', (e) => {
    if (!isDragging || e.touches.length !== 1) return;
    const dx = e.touches[0].clientX - lastMouseX;
    const dy = e.touches[0].clientY - lastMouseY;

    targetRotY += dx * 0.007;
    targetRotX = Math.max(-0.25, Math.min(0.4, targetRotX + dy * 0.005));

    lastMouseX = e.touches[0].clientX;
    lastMouseY = e.touches[0].clientY;
}, { passive: true });

window.addEventListener('touchend', () => {
    isDragging = false;
});


// Controls Bar Sky Dropdown Initialization & Event Listener
if (skySelect) {
    skySelect.innerHTML = '';
    SKY_THEMES.forEach((theme, index) => {
        const opt = document.createElement('option');
        opt.value = index;
        opt.textContent = `${theme.icon} ${theme.name}`;
        skySelect.appendChild(opt);
    });

    skySelect.addEventListener('change', (e) => {
        currentSkyIndex = parseInt(e.target.value, 10);
        if (selectIcon) selectIcon.textContent = SKY_THEMES[currentSkyIndex].icon;
        preRenderSprites(); // Dynamic Cherry Tree & Petal Season Theme transformation!
        drawSky();
    });
}

if (btnSound) {
    btnSound.addEventListener('click', () => {
        audioEnabled = true;
        if (soundLabel) soundLabel.textContent = 'Audio On';
        if (bgMusic) {
            bgMusic.muted = false;
            bgMusic.volume = 1.0;
            if (bgMusic.paused && bgMusic.src) {
                bgMusic.play().catch(() => {});
            }
        }
        playGentleChime();
    });
}

function enterGarden(e) {
    if (sceneActive) return;
    sceneActive = true;

    if (bgMusic) {
        bgMusic.muted = false;
        bgMusic.volume = 1.0;
    }

    if (e && e.cancelable && (e.type === 'touchstart' || e.type === 'click')) {
        e.preventDefault();
    }

    // Immediately reveal and render the 3D garden behind the overlay
    if (scene) scene.classList.remove('hidden');
    if (overlay) overlay.classList.add('fade-out');

    resize();
    preRenderSprites();
    build3DTree();
    init3DParticles();
    drawSky();

    animate();
    playGentleChime();

    setTimeout(() => {
        if (overlay) overlay.style.display = 'none';
    }, 1000);
}

if (enterBtn) {
    enterBtn.addEventListener('click', enterGarden);
    enterBtn.addEventListener('touchstart', enterGarden);
}

if (overlay) {
    overlay.addEventListener('click', (e) => {
        enterGarden(e);
    });
}

window.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' || e.key === ' ' || e.code === 'Space') {
        enterGarden(e);
    }
});

// Perform initial window dimension calculation on load
resize();
