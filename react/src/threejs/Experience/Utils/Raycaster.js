import * as THREE from 'three';
import EventEmitter from './EventEmitter.js';
import Experience from '../Experience.js';

export default class Raycaster extends EventEmitter {
    constructor() {
        super();

        this.experience = new Experience();
        this.camera = this.experience.camera.instance;
        this.canvas = this.experience.canvas;

        this.raycaster = new THREE.Raycaster();
        this.mouse = new THREE.Vector2();

        // 🔥 stable brush point in world space
        this.cursorPoint = new THREE.Vector3();

        // 🔥 plane for stable projection (IMPORTANT FIX)
        this.plane = new THREE.Plane(new THREE.Vector3(0, 0, 1), 0);

        this.tempPoint = new THREE.Vector3();

        this.onMouseMove = (event) => {

            const rect = this.canvas.getBoundingClientRect();

            this.mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
            this.mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;
        };

        window.addEventListener('mousemove', this.onMouseMove);
    }

    update() {

        this.raycaster.setFromCamera(this.mouse, this.camera);

        // 🔥 PROJECT RAY ONTO FIXED PLANE (no object dependency)
        const hit = this.raycaster.ray.intersectPlane(this.plane, this.tempPoint);

        if (hit) {

            this.cursorPoint.copy(this.tempPoint);

            // emit stable brush position
            this.trigger('mouseMove', [this.cursorPoint]);
        }
    }

    destroy() {
        window.removeEventListener('mousemove', this.onMouseMove);
    }
}