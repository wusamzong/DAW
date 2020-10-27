import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";

var controls ={
  controls: undefined,
  init(camera, container){
    var controls = new OrbitControls(camera, container);
    controls.target.set(0, 0, -1);
    controls.orbitChanging = false; //加入一個紀錄orbit是否改變的值
    controls.update();
    controls.addEventListener("change",()=>{this.onControlsChange(controls)});
    controls.addEventListener("end",()=>{this.onControlsEnd(controls)});
    controls.keyPanSpeed = 150;
    this.controls = controls;
  },
  onControlsChange() {
    this.controls.orbitChanging = true;
  },
  onControlsEnd() {
    this.controls.orbitChanging = false;
  },
}
export default controls;