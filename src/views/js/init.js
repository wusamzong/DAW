

var init ={
  container(doc){
    var container = doc.createElement("div");
    doc.body.appendChild(container);
    container.style.touchAction = "none";
    return container
  },
  // renderer(window,container){
  //   var renderer = new THREE.WebGLRenderer({ antialias: true }); //antialias 平滑化
  //   renderer.setPixelRatio(window.devicePixelRatio);
  //   renderer.setSize(window.innerWidth, window.innerHeight);
  //   container.appendChild(renderer.domElement);
  //   return renderer;
  // },
  onWindowResize(window,camera,renderer) {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
  },
}
export default init