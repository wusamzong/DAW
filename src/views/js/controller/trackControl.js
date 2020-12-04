import {trackModel} from '@/views/js/model/track'
import TONE from "@/views/js/tone";
import SCENE from "@/views/js/scene";
import CAMERA from "@/views/js/camera"
import SQUARE from "@/views/js/mesh/square"
import {cameraAnimation} from "@/views/js/animation"
var TrackGroup = trackModel.UI.TrackGroup;
var Tracknum = trackModel.Tracknum;
export function addTrack() {
  if (Tracknum < 3) {
    
    SCENE.scene.add(SQUARE.Pianokey());
    SCENE.scene.add(
      SQUARE.addSimplifySquare()
    ); //加入簡易的Track
    
    TONE.focusTrack=Tracknum;
    TONE.addTrackHandler(Tracknum); //加入聲音資料
    CAMERA.cameraVector = TrackGroup[Tracknum].cameraPosition; //傳遞告訴camera要去某個Track的具體位置(Vector)
    
    cameraAnimation(Tracknum); //把攝影機對像最新創建的音軌
    SCENE.focusTrack(SCENE.focusing)
    trackModel.Tracknum++;    
    SCENE.sceneChange(SCENE.sceneStatus)
  }
}