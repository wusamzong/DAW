import * as THREE from "three";
import SCENE from "@/views/js/scene";


var camera = {
  camera,
  cameraVector: 0,
  cameraTrack: 0,
  init() {
    this.camera = new THREE.PerspectiveCamera(
      50,
      window.innerWidth / window.innerHeight,
      1,
      1000
    );
    this.camera.position.set(0,0,0); //(x,y,z)
    this.camera.rotation.set(0,0,0);
    SCENE.scene.add(this.camera);
  },
  zoomIn(){
    this.camera.zoom+=0.2;
    this.camera.updateProjectionMatrix();
  },
  zoomOut(){
    this.camera.zoom-=0.2;
    this.camera.updateProjectionMatrix();
  }
}
export default camera