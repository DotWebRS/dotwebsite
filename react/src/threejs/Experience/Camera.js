import * as THREE from "three"
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import Experience from "./Experience.js";

export default class Camera{
    constructor(){
        this.experience = new Experience();

        this.sizes = this.experience.sizes;
        this.scene = this.experience.scene;
        this.canvas = this.experience.canvas;
        this.setInstance();
        this.setOrbitControls();
    }

    setInstance(){
        this.instance = new THREE.PerspectiveCamera(35, this.sizes.width / this.sizes.height, 0.1, 1000);
        console.log(this.experience.isMobile);
        if(this.experience.isMobile){
            console.log(this.instance);
            this.instance.fov = 80;
            this.instance.updateProjectionMatrix();
        }
        this.instance.position.set(0, 0, 40);
        this.scene.add(this.instance);
    }
    setOrbitControls(){
        this.controls = new OrbitControls(this.instance, this.canvas);
        this.controls.enableDamping = true;
    }
    resize(){
        if(this.experience.isMobile){
            this.instance.fov = 80;
        }else{
            this.instance.fov = 35;
        }
        this.instance.aspect = this.sizes.width / this.sizes.height;
        this.instance.updateProjectionMatrix();
    }
    update(){
        this.controls.update();
    }
}