import {trackModel} from '@/views/js/model/track'
import SCENE from "@/views/js/scene";
let completeTrack = trackModel.UI.TrackGroup;
let temp = [];
export function playingKeys(index){
  index = index%72
  temp.forEach(element => {
    element.material.color.setHex(element.HexBeforePlaying)
  });
  temp = [];
  for(let i=0;i<7;i++){
    let currentKey=completeTrack[SCENE.focusing].children[index+i*72]
    currentKey.HexBeforePlaying = currentKey.material.color.getHex();
    currentKey.material.color.setHex(0xFF0087)
    temp.push(currentKey)
  }
}
export function clearTemp(){
  temp.forEach(element => {
    element.material.color.setHex(element.HexBeforePlaying)
  });
}