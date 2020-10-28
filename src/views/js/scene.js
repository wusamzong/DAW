import * as THREE from "three";
import TONE from "@/views/js/tone";
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
    SimplifyTrackGroup.visible = true;

    this.scene.children.forEach(element =>{
      let name=element.name.split(' ')[0]
      if(name==='TrackGroup')
        element.visible = false;
    })
  },
  smallScene() {
    var SimplifyTrackGroup = this.scene.getObjectByName('SimplifyTrackGroup');
    SimplifyTrackGroup.visible = false;

    this.scene.children.forEach(element =>{
      let name=element.name.split(' ')
      let groupName=name[0]
      let index=Number(name[1])
      console.log(groupName,index,TONE.focusTrack)
      if(groupName==='TrackGroup'){
        if(index === TONE.focusTrack){
          element.visible = true;
        }
      }
        
    })
  },
}
export default scene;