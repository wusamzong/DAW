import * as THREE from "three";
var scene ={
  scene: new THREE.Scene(),
  sceneStatus: 0,
  init(){
    this.scene.fog = new THREE.FogExp2( 0x3D85C6, 0.005 );
    this.scene.background = new THREE.Color(0x4C1130);
  },
  sceneChange(goalStatus) {
    if (goalStatus === 0) {
      this.bigScene();
      this.sceneStatus = 0;
    } else {
      this.smallScene();
      this.sceneStatus = 1;
    }
  },
  bigScene() {
    var SimplifyTrackGroup = this.scene.getObjectByName('SimplifyTrackGroup');
    var TrackGroup = this.scene.getObjectByName('TrackGroup');
    console.log(SimplifyTrackGroup)
    console.log(TrackGroup)
    SimplifyTrackGroup.visible = true;
    TrackGroup.visible = false;
  },
  smallScene() {
    var SimplifyTrackGroup = this.scene.getObjectByName('SimplifyTrackGroup');
    var TrackGroup = this.scene.getObjectByName('TrackGroup');
    console.log(SimplifyTrackGroup)
    console.log(TrackGroup)
    SimplifyTrackGroup.visible = false;
    TrackGroup.visible = true;
  },
}
export default scene;