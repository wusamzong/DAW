import * as THREE from 'three';
import TONE from "@/views/js/tone";
import SCENE from "@/views/js/scene";

var select = {
  raycaster: new THREE.Raycaster(),
  mouse: new THREE.Vector2(),
  which: -1, //當前要raycaster的Group
  INTERSECTED:undefined,
  init(document){
    document.addEventListener("mousemove",(event)=>{
      event.preventDefault();
      this.mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
      this.mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
    }, false);
    document.addEventListener("click", () => {
      this.onClick(this.which);
    });
  },
  raycasterAnimate(camera,selectGroup){
    this.raycaster.setFromCamera(this.mouse, camera);
    var intersects = []; 
     
    if (SCENE.sceneStatus === 0) { //大場景  
      intersects = this.raycaster.intersectObjects(selectGroup[0].children,true);
    } else if (SCENE.sceneStatus === 1) { //小場景
      intersects = this.raycaster.intersectObjects(selectGroup[1][0].children, true);
    }
     
    if (intersects.length > 0) {
      let parent = intersects[0].object.parent;
      if (parent === selectGroup[0]) {
        this.which = 0;
      }
      if (parent === selectGroup[1][0]) {
        this.which = 1;
        this.hoverKey(intersects);
      }
    } else {
      if (this.which === 0) {
        this.which = -1;
      } else if (this.which === 1) {
        this.leaveKey();
        this.which = -1;
      }
    }
  },
  hoverKey(intersects) {
    if (intersects[0].object != this.INTERSECTED) {
      //如果當前選擇的物體跟剛剛選擇的物體不一樣，則進行下一步
      if (this.INTERSECTED) {
        //如果剛剛有取得物件，那就先把剛剛取得的物件顏色先修改回來
        this.INTERSECTED.material.color.setHex(this.INTERSECTED.currentHex);
      }
      
      this.INTERSECTED = intersects[0].object;
      this.INTERSECTED.currentHex = this.INTERSECTED.material.color.getHex(); //currentHex
      this.INTERSECTED.material.color.setHex(0xff377e);
    }
  },
  leaveKey() {
    if (this.INTERSECTED) {
      //如果剛剛有取得物件，那就先把剛剛取得的物件顏色先修改回來
      this.INTERSECTED.material.color.setHex(this.INTERSECTED.currentHex);
    }
    this.INTERSECTED = null;
  },
  onClick() {
    if (this.which === 1) {
      this.clickKey();
    } else if (this.which === 0) {
      this.clickSimplifyTrack();
    }
  },
  clickKey() {
    let key = this.INTERSECTED;
    if (key === null) return;
    //console.log(key.index[0],key.index[1]);   //index[0]=>第幾個Track ,index[1]=>第幾個key
    //找到對應的TrackData
    //this.TrackData[key.index[0]][key.index[1]] = !this.TrackData[key.index[0]][key.index[1]];
    TONE.editTrackHandler(key);
    //顏色設置與否
    if (key.currentHex === 0xffff00) {
      key.currentHex = 0xff3dff;
    } else {
      key.currentHex = 0xffff00;
    }
    //當前應該關注的Track
    /*this.focusTrack = key.index[0];
    CAMERA.cameraVector = this.TrackGroup[this.focusTrack].cameraPosition;

    this.controls = CAMERA.moveCameraAnimation(
      SCENE.scene,
      this.renderer,
      this.controls,
      this.focusTrack
    );*/
  },
  clickSimplifyTrack() {
    SCENE.sceneChange(1);
  }

}
export default select;