import * as THREE from 'three';
import SCENE from "@/views/js/scene";
var vector={
  addVector(){
    this.addLine(50,0,0,0xff0000)
    this.addLine(0,50,0,0x00ff00)
    this.addLine(0,0,50,0x0000ff)
  },
  addLine(x,y,z,color){
    var points = []
    points.push(new THREE.Vector3(-x,-y,-z));
    points.push(new THREE.Vector3(x,y,z));
    var geometry = new THREE.BufferGeometry().setFromPoints( points );
    var material = new THREE.LineBasicMaterial( { color: color } );
    var line = new THREE.Line( geometry, material );
    SCENE.scene.add(line);
  }
}
export default vector;