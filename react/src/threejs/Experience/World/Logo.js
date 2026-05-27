import * as THREE from 'three';
import Experience from '../Experience.js';
import Raycaster from '../Utils/Raycaster.js';

export default class Logo {
    constructor() {
        this.experience = new Experience();
        this.scene = this.experience.scene;
        this.resources = this.experience.resources;
        this.scroll = this.experience.scroll;

        this.raycaster = new Raycaster();

        this.texture = this.resources.items.logoPng;

        this.mousePoint = new THREE.Vector3(999, 999, 999);

        this.startTime = performance.now() * 0.001;
        this.introSpeed = 0.8;

        this.scale = 0.008;
        this.systemScale = 8;

        this.chaosStrength = 40;

        // velocity system
        this.velocities = [];

        // IMPORTANT FIX (REST SPACE)
        this.restPositions = [];

        // 🔥 SCROLL CHAOS STATE (ADDED)
        this.scrollChaos = 0;

        this.setParticles();
        this.initMouse();
    }

    initMouse() {

        this.raycaster.on('mouseMove', (p) => {
            this.mousePoint.copy(p);
        });

        this.raycaster.on('mouseOut', () => {
            this.mousePoint.set(999, 999, 999);
        });
    }

    setParticles() {

        const image = this.texture.image;

        const canvas = document.createElement('canvas');
        const context = canvas.getContext('2d');

        canvas.width = image.width;
        canvas.height = image.height;

        context.drawImage(image, 0, 0);

        const pixels = context.getImageData(
            0,
            0,
            canvas.width,
            canvas.height
        ).data;

        const positions = [];

        const gap = 2;

        for (let y = 0; y < canvas.height; y += gap) {
            for (let x = 0; x < canvas.width; x += gap) {

                const index = (y * canvas.width + x) * 4;
                const alpha = pixels[index + 3];

                if (alpha > 10) {

                    const px =
                        (x - canvas.width * 0.5) *
                        this.scale *
                        this.systemScale;

                    const py =
                        -(y - canvas.height * 0.5) *
                        this.scale *
                        this.systemScale;

                    const pz = 0;

                    positions.push(px, py, pz);

                    // REST POSITION
                    this.restPositions.push(px, py, pz);

                    // velocity init
                    this.velocities.push(0, 0, 0);
                }
            }
        }

        this.geometry = new THREE.BoxGeometry(0.05, 0.05, 0.05);

        this.material = new THREE.MeshBasicMaterial({
            color: new THREE.Color('#0148B2'),
            wireframe: true
        });

        this.count = positions.length / 3;

        this.mesh = new THREE.InstancedMesh(
            this.geometry,
            this.material,
            this.count
        );

        this.dummy = new THREE.Object3D();

        this.startPositions = [];
        this.targetPositions = [];

        for (let i = 0; i < positions.length; i += 3) {

            const x = positions[i];
            const y = positions[i + 1];
            const z = positions[i + 2];

            this.targetPositions.push(x, y, z);

            this.startPositions.push(
                (Math.random() - 0.5) * this.chaosStrength,
                (Math.random() - 0.5) * this.chaosStrength,
                (Math.random() - 0.5) * this.chaosStrength
            );

            this.dummy.position.set(x, y, z);

            const s = 0.3 + Math.random() * 0.5;
            this.dummy.scale.set(s, s, s);

            this.dummy.rotation.set(
                Math.random() * Math.PI,
                Math.random() * Math.PI,
                Math.random() * Math.PI
            );

            this.dummy.updateMatrix();

            this.mesh.setMatrixAt(i / 3, this.dummy.matrix);
        }

        this.scene.add(this.mesh);
    }

    update() {

        const scrollT = this.scroll.smoothScroll;
        // 🔥 SCROLL → CHAOS BLEND
        const targetChaos = THREE.MathUtils.clamp(scrollT * 2.5, 0, 1);
        this.scrollChaos += (targetChaos - this.scrollChaos) * 0.08;

        this.raycaster?.update();

        const elapsed = performance.now() * 0.001;

        let progress = (elapsed - this.startTime) * this.introSpeed;
        progress = THREE.MathUtils.clamp(progress, 0, 1);
        progress = 1 - Math.pow(1 - progress, 4);

        const m = new THREE.Matrix4();
        const pos = new THREE.Vector3();
        const rot = new THREE.Quaternion();
        const scale = new THREE.Vector3();

        const radius = 2.2;
        const radiusSq = radius * radius;

        const strength = 0.30;
        const damping = 0.88;

        for (let i = 0; i < this.count; i++) {

            this.mesh.getMatrixAt(i, m);
            m.decompose(pos, rot, scale);

            // -------------------------
            // BASE MORPH
            // -------------------------
            const sx = this.startPositions[i * 3];
            const sy = this.startPositions[i * 3 + 1];
            const sz = this.startPositions[i * 3 + 2];

            const tx = this.targetPositions[i * 3];
            const ty = this.targetPositions[i * 3 + 1];
            const tz = this.targetPositions[i * 3 + 2];

            const baseX = THREE.MathUtils.lerp(sx, tx, progress);
            const baseY = THREE.MathUtils.lerp(sy, ty, progress);
            const baseZ = THREE.MathUtils.lerp(sz, tz, progress);

            // chaos field
            const cx = sx * 1.5;
            const cy = sy * 1.5;
            const cz = sz * 1.5;

            pos.x = THREE.MathUtils.lerp(baseX, cx, this.scrollChaos);
            pos.y = THREE.MathUtils.lerp(baseY, cy, this.scrollChaos);
            pos.z = THREE.MathUtils.lerp(baseZ, cz, this.scrollChaos);

            // -------------------------
            // FIXED SPACE DISTORTION
            // -------------------------
            const rx = this.restPositions[i * 3];
            const ry = this.restPositions[i * 3 + 1];
            const rz = this.restPositions[i * 3 + 2];

            const dx = rx - this.mousePoint.x;
            const dy = ry - this.mousePoint.y;
            const dz = rz - this.mousePoint.z;

            const distSq = dx * dx + dy * dy + dz * dz;

            if (distSq < radiusSq) {

                const force = Math.exp(-distSq * 2.0) * strength;

                const vi = i * 3;

                this.velocities[vi]     += dx * force;
                this.velocities[vi + 1] += dy * force;
                this.velocities[vi + 2] += dz * force;
            }

            // -------------------------
            // APPLY VELOCITY
            // -------------------------
            const vi = i * 3;

            pos.x += this.velocities[vi];
            pos.y += this.velocities[vi + 1];
            pos.z += this.velocities[vi + 2];

            this.velocities[vi]     *= damping;
            this.velocities[vi + 1] *= damping;
            this.velocities[vi + 2] *= damping;

            // -------------------------
            // BREATHING
            // -------------------------
            const t = elapsed;

            const noise =
                Math.sin(t * 1.1 + tx * 0.8) +
                Math.cos(t * 0.9 + ty * 0.7);

            const breathe = noise * 0.12;

            pos.x += breathe;
            pos.y += -breathe * 0.6;
            pos.z += breathe * 0.4;

            m.compose(pos, rot, scale);
            this.mesh.setMatrixAt(i, m);
        }

        this.mesh.instanceMatrix.needsUpdate = true;
    }

    destroy() {
        this.scene.remove(this.mesh);
        this.geometry.dispose();
        this.material.dispose();
    }
}