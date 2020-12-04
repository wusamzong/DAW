import SCENE from "@/views/js/scene";
import CAMERA from "@/views/js/camera";
import SELECT from "@/views/js/select";
import CONTROLS from "@/views/js/controls";
import RENDERER from "@/views/js/renderer"

var container;
var initWindow ={
  container(doc){
    container = doc.createElement("div");
    doc.body.appendChild(container);
    container.style.touchAction = "none";
  },
  onWindowResize(window,camera,renderer) {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
  },
}
export function init(doc,win){
  initWindow.container(doc);
  SCENE.init();
  CAMERA.init(SCENE.scene);
  SELECT.init(doc);
  RENDERER.init(win, container);
  CONTROLS.init(CAMERA.camera, container)
  initWindow.onWindowResize(win, CAMERA.camera, RENDERER.renderer)
} 