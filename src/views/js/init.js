import * as THREE from 'three';
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
var init ={
  container(doc){
    var container = doc.createElement("div");
    doc.body.appendChild(container);
    container.style.touchAction = "none";
    return container
  },
  scene(){
    var scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2( 0x3D85C6, 0.005 );
    scene.background = new THREE.Color(0x4C1130);
    return scene
  },
  camera(scene) {
    var camera = new THREE.PerspectiveCamera(
      50,
      window.innerWidth / window.innerHeight,
      1,
      1000
    );
    camera.position.set(0, 0, 0); //(x,y,z)
    camera.rotation.set(0,0,0);
    scene.add(camera);
    return camera;
  },
  controller(camera, container){
    var controls = new OrbitControls(camera, container);
    controls.target.set(0, 0, -1);
    controls.update();
    return controls;
  },
  renderer(window,container){
    var renderer = new THREE.WebGLRenderer({ antialias: true }); //antialias 平滑化
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(window.innerWidth, window.innerHeight);
    container.appendChild(renderer.domElement);
    return renderer;
  }
}
export default init