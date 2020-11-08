import * as THREE from 'three';
var renderer={
  renderer,
  init(window,container){
    var renderer = new THREE.WebGLRenderer({ antialias: true});
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(window.innerWidth, window.innerHeight);
    container.appendChild(renderer.domElement);
    return this.renderer = renderer
  }
}
export default renderer