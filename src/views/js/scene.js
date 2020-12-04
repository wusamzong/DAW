import * as THREE from "three";
import {trackModel} from '@/views/js/model/track'
let simpleTrack = trackModel.UI.SimplifyTrackGroup;
let completeTrack = trackModel.UI.TrackGroup;
var scene ={
  scene: new THREE.Scene(),
  sceneStatus: 0,
  focusing: 0, //正在關注的Track id
  init(){
    this.scene.fog = new THREE.FogExp2( 0x3D85C6, 0.005 );
    this.scene.background = new THREE.Color(0x4C1130);
  },
  sceneChange(goalStatus) {
    if (goalStatus === 0) {
      bigScene();
      this.sceneStatus = 0;
    } else {
      smallScene();
      this.sceneStatus = 1;
    }
  },
  focusTrack(track){ //點擊的track
    this.focusing = track;
    completeTrack.forEach(element => {
      if(element.name.split(' ')[1] != track)
        element.visible = false;
    });
  }
}


function bigScene() {
  simpleTrack.visible = true;
  completeTrack.forEach(element => {
    element.visible = false;
  });
}
function smallScene() {
  simpleTrack.visible = false;
  completeTrack.forEach(element => {
    element.visible = true;
  });
}
export default scene;