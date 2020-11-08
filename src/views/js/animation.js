import SCENE from "@/views/js/scene";
import CAMERA from "@/views/js/camera";
import STAR from "@/views/js/mesh/star";
import RENDERER from "@/views/js/renderer"

class animation{
  constructor(object){
    this.object = object;
  }
  checkStatus(status){
    if(status==='stop'){
      this.status = status
    }else{
      this.checkRotation(status); 
    }
  }
  checkRotation(status){
    if(status==='rotation'){
      this.status = status
    }else{
      return;
    }
  }
}
export class StarAnimate extends animation{
  animate(){
    var stars = this.object.children 
    const time = Date.now() * 0.00005;
    for(let i=0;i<stars.length;i++){
      stars[i].rotation.y = time * (i+0.05)*1.3
    }
  }
}
export class CameraAnimate extends animation{
  constructor(object,frequency,status){
    super(object)
    this.frequency = frequency;
    this.status = status;
  }
  animate(){
    var camera = this.object

  }
  get frequency(){
    return this.frequency
  }
  set frequency(v){
    this.frequency = v
  }
  get status(){
    return this.status
  }
  set status(v){
    this.status = v
  }
  
}
export function animateInterface(){
  requestAnimationFrame(animateInterface);
  let STAR_ANIMATE= new StarAnimate(STAR.stars);
  STAR_ANIMATE.animate();

  RENDERER.renderer.render(SCENE.scene, CAMERA.camera)
}
