import * as THREE from 'three';
import TONE from "@/views/js/tone";
import SCENE from "@/views/js/scene";
import CAMERA from "@/views/js/camera";
import {cameraAnimation} from "@/views/js/animation"
import {trackModel} from '@/views/js/model/track'
let intersects;
let INTERSECTED=undefined;
let hover= false; //當前要raycaster的Group
let simpleTrack = trackModel.UI.SimplifyTrackGroup;
let completeTrack = trackModel.UI.TrackGroup;
let focusTrackID = -1;
var select = {
  raycaster: new THREE.Raycaster(),
  mouse: new THREE.Vector2(),
  init(document){
    document.addEventListener("mousemove",(event)=>{
      event.preventDefault();
      this.mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
      this.mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
    }, false);
    document.addEventListener("click", () => {
      onClick();
    });
  },
  selectController(){
    this.raycaster.setFromCamera(this.mouse, CAMERA.camera);
    setIntersects()
  },
}
function setIntersects(){ //依據目前的場景來設置intersects
  if (SCENE.sceneStatus === 0) { //大場景
    intersects = select.raycaster.intersectObjects(simpleTrack.children,true);
    hoverTrack();
  } else if (SCENE.sceneStatus === 1) { //小場景
    intersects = select.raycaster.intersectObjects(completeTrack[focusTrackID].children, true);
    hoverKey();
  }
}
function hoverTrack(){ //大場景時，我們辨識滑鼠是否有在Track上
  if (intersects.length > 0) {
    let parent = intersects[0].object.parent;
    if (parent === simpleTrack) {
      hover = true;
    }
  } else {
    hover = false
  }
}
function hoverKey(){ //大場景時，我們辨識滑鼠是否有在Key上，以及是在哪個key上
  if (intersects.length > 0) {
    let parent = intersects[0].object.parent;
    if (parent === completeTrack[focusTrackID]) {
      hover = true;
      if (intersects[0].object != INTERSECTED) {
        //如果當前選擇的物體跟剛剛選擇的物體不一樣，則進行下一步
        if (INTERSECTED) {
          //如果剛剛有取得物件，那就先把剛剛取得的物件顏色先修改回來
          INTERSECTED.material.color.setHex(INTERSECTED.currentHex);
        }
        
        INTERSECTED = intersects[0].object;
        INTERSECTED.currentHex = INTERSECTED.material.color.getHex(); //currentHex
        INTERSECTED.material.color.setHex(0xff377e);
      }
    }
  } else {
    hover = false;
    if (INTERSECTED) {
      //如果剛剛有取得物件，那就先把剛剛取得的物件顏色先修改回來
      INTERSECTED.material.color.setHex(INTERSECTED.currentHex);
    }
    INTERSECTED = null;
  }
}

function onClick() {  //依據目前的場景來control
  if (hover === true) {
    if(SCENE.sceneStatus === 0)
      clickTrack();
    else if(SCENE.sceneStatus ===1)
      clickKey();
  } else if (hover === false) {
    return;
  }
}
function clickTrack() {
  SCENE.sceneChange(1);
  focusTrackID = intersects[0].object.name
  SCENE.focusTrack(focusTrackID)
  cameraAnimation(focusTrackID)
}
function clickKey() {
  let key = INTERSECTED;
  if (key === null) return;
  console.log(key)
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
}



export default select;