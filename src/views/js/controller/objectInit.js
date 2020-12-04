import STAR from "@/views/js/mesh/star";
import VECTOR from "@/views/js/mesh/vector";
import {addTrack} from '@/views/js/controller/trackControl';
import SCENE from "@/views/js/scene";
import TONE from "@/views/js/tone";
export function objectInit(){
  STAR.createStars();
  VECTOR.addVector();
  addTrack();
  SCENE.sceneChange(0);
  TONE.setTransport();
}