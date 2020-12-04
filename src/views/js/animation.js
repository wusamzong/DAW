import SCENE from "@/views/js/scene";
import CAMERA from "@/views/js/camera";
import STAR from "@/views/js/mesh/star";
import RENDERER from "@/views/js/renderer"
import {positionMove} from "@/views/js/objectChange";
import { Vector3 } from "three";
import CONTROLS from "@/views/js/controls";
import SELECT from "@/views/js/select";

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
export function animateInterface(){
  requestAnimationFrame(animateInterface);
  let STAR_ANIMATE= new StarAnimate(STAR.stars);
  STAR_ANIMATE.animate();
  if (CONTROLS.controls.enabled || !CONTROLS.controls.orbitChanging) {
    SELECT.selectController()
  }
  RENDERER.renderer.render(SCENE.scene, CAMERA.camera)
}

export function cameraAnimation(focusTrack) {
  
  let position = CAMERA.camera.position;
  let up = new Vector3(0,1,0);
  let down = new Vector3(0,-1,0);
  if (CAMERA.cameraTrack === focusTrack) {
    //當關注的Track等於camera關注的track時 就不跑這個function
    CONTROLS.controls.enabled = true;
  }
  if (Math.abs(CAMERA.cameraVector[1] - position.y) > 1) { //開始移動
    CONTROLS.controls.enabled = false; //用來代表是否移動
    
    if (CAMERA.cameraVector[1] - position.y < 1) {
      positionMove(CAMERA.camera, down) //往下
    } else if (CAMERA.cameraVector[1] - position.y > 1) {
      positionMove(CAMERA.camera, up)   //往上
    }
    
    //console.log(position.x,position.y,position.z);
    let requestId = requestAnimationFrame(() => {
      cameraAnimation(focusTrack);
    });
    requestId;
    //renderer.render(SCENE.scene, CAMERA.camera);
    //stats.update();
  } else {
    // 不要動
    CAMERA.camera.position.set(position.x, CAMERA.cameraVector[1], position.z);
    CAMERA.cameraTrack = focusTrack;
    CONTROLS.controls.enabled = true;
  }
}