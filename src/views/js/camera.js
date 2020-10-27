import * as THREE from "three";
import CONTROLS from "@/views/js/controls";
import SCENE from "@/views/js/scene";
var camera = {
  camera,
  cameraVector: 0,
  cameraTrack: 0,
  cameraIsMoving: false,
  init() {
    this.camera = new THREE.PerspectiveCamera(
      50,
      window.innerWidth / window.innerHeight,
      1,
      1000
    );
    this.camera.position.set(0, 0, 0); //(x,y,z)
    this.camera.rotation.set(0,0,0);
    SCENE.scene.add(this.camera);
  },
  moveCameraAnimation(renderer,focusTrack) {
    let position = this.camera.position;
    if (this.cameraTrack === focusTrack) {
      //當關注的Track等於camera關注的track時 就不跑這個function
      CONTROLS.controls.enabled = true;
    }

    if (Math.abs(this.cameraVector[1] - position.y) > 1) {
      //開始移動
      this.cameraIsMoving = true;
      CONTROLS.controls.enabled = false;
      if (this.cameraVector[1] - position.y < 1) {
        //往下
        this.camera.position.set(position.x, position.y - 1, position.z);
      } else if (this.cameraVector[1] - position.y > 1) {
        //往上
        this.camera.position.set(position.x, position.y + 1, position.z);
      }
      //console.log(position.x,position.y,position.z);
      let requestId = requestAnimationFrame(() => {
        this.moveCameraAnimation(renderer,focusTrack);
      });
      requestId;
      renderer.render(SCENE.scene, this.camera);
      //stats.update();
    } else {
      // 不要動
      this.camera.position.set(position.x, this.cameraVector[1], position.z);
      this.cameraTrack = focusTrack;
      this.cameraIsMoving = false;
      CONTROLS.controls.enabled = true;
    }
  },
}
export default camera