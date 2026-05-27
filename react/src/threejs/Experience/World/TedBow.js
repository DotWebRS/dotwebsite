import Experience from "../Experience.js";
import gsap from 'gsap';
import { ScrollTrigger } from "gsap/ScrollTrigger";
import * as THREE from 'three';

export default class TedBow{
    constructor(){
        this.experience = new Experience();
        this.scene = this.experience.scene;
        this.resources = this.experience.resources;
        this.setModel();
        this.setIntroAnimation();
        window.scrollTo(0, 0);
        document.body.style.overflow = 'hidden';
        document.documentElement.style.overflow = 'hidden';
    }
    setModel(){
        this.model = this.resources.items.tedbowModel.scene;
        this.model.children[0].rotation.x = Math.PI/2;
        this.model.scale.set(0,0,0);
        this.scene.add(this.model);
    }
    setIntroAnimation(){
        //final (18,8,0);
        this.curve = new THREE.CatmullRomCurve3([
            new THREE.Vector3(0,-3,-40),
            new THREE.Vector3(5, 1, -10),
            new THREE.Vector3(7,2,0),
            new THREE.Vector3(12,3,10)
        ]);
        this.flight = {
            progress: 0
        };
        gsap.to(this.flight, {
            progress: 1,
            duration: 4,
            ease: 'power3.inOut',
            onUpdate: ()=>{
                this.model.scale.set(this.flight.progress, this.flight.progress, this.flight.progress);
                const point = this.curve.getPoint(this.flight.progress);
                const tangent = this.curve.getTangent(this.flight.progress);
                this.model.position.copy(point);
                const lookAtPoint = point.clone().add(tangent);
                this.model.lookAt(lookAtPoint);
                if(this.flight.progress > 0.85 && this.model.children[0].rotation.x > 0){
                    this.model.children[0].rotation.x -= 0.01;
                }
            },
            onComplete: ()=>{
                document.body.style.overflow = '';
                document.documentElement.style.overflow = '';
                this.model.lookAt(this.experience.camera.instance.position);
                this.setScrollAnimation();
            }
        });
    }
    setScrollAnimation(){
        this.scrollCurve = new THREE.CatmullRomCurve3([
            new THREE.Vector3(12,3,10),
            new THREE.Vector3(-20,-5,4),
            new THREE.Vector3(15,-10,11),
            new THREE.Vector3(-6, -15, 18)
        ]);
        this.scrollAnim = {
            t: 0
        };
        gsap.registerPlugin(ScrollTrigger);
        this.tl = gsap.timeline({
            scrollTrigger: {
                trigger: "#body",
                start: "top top",
                end: "bottom bottom",
                scrub: 1, // NE 0.000001 (to je overkill i buggy)
                fastScrollEnd: true,

                onUpdate: (self) => {

                    const t = self.progress; // 🔥 KLJUČ
                    
                    const point = this.scrollCurve.getPoint(t);
                    const tangent = this.scrollCurve.getTangent(t);
                    this.experience.camera.instance.position.y = point.y - 3;
                    this.experience.camera.controls.target.y = point.y - 3;
                    this.model.position.copy(point);
                    if(self.direction == -1){
                        tangent.negate();
                    }
                    const lookAtPoint = point.clone().add(tangent);

                    this.model.lookAt(lookAtPoint);
                },
            }
        });
        ScrollTrigger.addEventListener("scrollStart", () => {
            gsap.to({}, {
                duration: 0.035,
                ease: "power2.out",
                onUpdate: () => {
                    this.model.children[0].rotation.x = THREE.MathUtils.lerp(
                        this.model.children[0].rotation.x,
                        Math.PI / 2,
                        0.2
                    );
                }
            });
        });
        ScrollTrigger.addEventListener("scrollEnd", () => {
            gsap.to({}, {
                duration: 0.035,
                ease: "power2.out",
                onUpdate: () => {
                    this.model.children[0].rotation.x = THREE.MathUtils.lerp(
                        this.model.children[0].rotation.x,
                        0,
                        0.2
                    );

                    this.model.lookAt(this.experience.camera.instance.position);
                }
            });
        });
    }
    update(){
        this.model.position.y += Math.sin(performance.now() * 0.001) * 0.003;
    }
}