import Experience from "../Experience.js";
import Environment from './Environment.js';
import Logo from './Logo.js';
import TedBow from './TedBow.js';

export default class World{
    constructor(){
        this.experience = new Experience();
        this.scene = this.experience.scene;
        this.resources = this.experience.resources;
        this.resources.on('ready', ()=>{
            this.envronment = new Environment();
            this.logo = new Logo();
            if(!this.experience.isMobile){
                this.tedbow = new TedBow();
            }
        });
    }

    update(){
        this.logo?.update();
        this.tedbow?.update();
    }
}