<template>
  <div id="app">
    <div id="info">
      <div class="header">
        <button @click="addTrack">add Track</button>
        <div class="step">
          <button>undo</button>
          <button>redo</button>
        </div>
        <div class="play">
          <button>skip_previous</button>
          <button>play</button>
          <button>skip_next</button>
          <p>time</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import Stats from "three/examples/jsm/libs/stats.module.js";
//import { NURBSCurve } from 'three/examples/jsm/curves/NURBSCurve.js';
//import { NURBSSurface } from "three/examples/jsm/curves/NURBSSurface.js";

export default {
  data() {
    var container, stats;
    var camera, scene, raycaster, render;
    var group;
    var controls;
    var mouse, INTERSECTED;
    
    //var extrudeSettings;
    return {
      container,
      stats,
      camera,
      scene,
      render,
      group,
      controls,
      raycaster,
      mouse,
      INTERSECTED,
      TrackGroup: [],  //用於push Mesh
      Tracknum: 0,
      cameraPosition: [],
      notMoved: true,
      TrackPositionY: -1,
      barNum: 0,
      TrackData: [],  //用於操作Track    
      MeshID_to_TrackDataID: new Map(),  //每個Track的第一個id  
      //extrudeSettings
    };
  },
  methods: {
    init() {
      this.initContainer();
      this.initScene();
      this.initCamera();
      this.initController();
      //this.Sphere();
      this.setRenderer();     
    },
    initContainer(){
      this.container = document.createElement("div");
      document.body.appendChild(this.container);
      this.stats = new Stats();
      this.container.appendChild(this.stats.dom);
      this.container.style.touchAction = "none";
    },
    initScene(){
      this.scene = new THREE.Scene();
      this.scene.background = new THREE.Color(0x2B0083);
    },
    initCamera(){
      this.camera = new THREE.PerspectiveCamera(
        50,
        window.innerWidth / window.innerHeight,
        1,
        1000
      );
      this.camera.position.set(0, 0, 0); //(x,y,z)
      this.scene.add(this.camera);
    },
    initController(){
      this.controls = new OrbitControls(this.camera, this.container);
      this.controls.target.set(0, 0, -1);
      this.controls.update();
      this.raycaster = new THREE.Raycaster();
      this.mouse = new THREE.Vector2();
      document.addEventListener("mousemove", this.onDocumentMouseMove, false);
    },
    addsquare(Length, x, y, z, rx, ry, rz, s, opacity, id) {
      var sqLength = Length;
      var squareShape = new THREE.Shape()
        .moveTo(0, 0)
        .lineTo(0, sqLength / 2)
        .lineTo(sqLength, sqLength / 2)
        .lineTo(sqLength, 0)
        .lineTo(0, 0);
      //var extrudeSettings = { depth: 8, bevelEnabled: true, bevelSegments: 2, steps: 2, bevelSize: 1, bevelThickness: 1 };
      //var geometry = new THREE.ExtrudeBufferGeometry( squareShape, extrudeSettings );
      var geometry = new THREE.ShapeBufferGeometry(squareShape);
      
      var material = new THREE.MeshBasicMaterial({
        color: 0xFF3DFF,
        transparent: true,
        opacity: opacity,
        side: THREE.DoubleSide
      });
      var mesh = new THREE.Mesh(geometry, material);
      mesh.position.set(x, y, z);
      mesh.rotation.set(rx, ry, rz);
      mesh.scale.set(s, s, s);
      this.MeshID_to_TrackDataID.set(mesh.id, id)
      return mesh;
      //this.scene.add(mesh);
    },
    Pianokey() {
      var R = 30;
      var Length;
      var angle = 0;
      
      var id=1;

      this.TrackGroup[this.Tracknum] = new THREE.Group();
      this.TrackData[this.Tracknum] = [];
      console.log(this.Tracknum);
      this.barNum = 72;
      for (let j = -3; j < 4; j++) {
        R = 30 * Math.cos(((Math.PI * 1) / 32) * j);
        Length = (Math.PI * R) / 60;        
        let y = (R / 35) * j;

        angle = -1;
        var Gradient=0;
        for (let i = 2; i > 2/3; i -= 1 / 54) {          
          let x = R * Math.cos(Math.PI * angle);
          let z = R * Math.sin(Math.PI * angle);
          
          this.TrackData[this.Tracknum].push(false);
          this.TrackGroup[this.Tracknum].add(
            this.addsquare( Length, x, y, z, 0, i * Math.PI + (Math.PI * 3) / 2, 0, 1, Math.sin(Math.PI * Gradient)*0.8+0.1, id*(this.Tracknum+1))
          );
          id++;
          Gradient += 1 / this.barNum;
          angle += 1 / 54;
        }
      }
      this.scene.add(this.TrackGroup[this.Tracknum]);
      this.Tracknum++;  
    },
    addTrack() {
      if (this.Tracknum < 3) {        
        if(this.Tracknum!=0){          
          this.TrackPositionY = 8
        }else{
          this.Pianokey();
        }
      }
    },
    onWindowResize() {
      this.camera.aspect = window.innerWidth / window.innerHeight;
      this.camera.updateProjectionMatrix();

      this.renderer.setSize(window.innerWidth, window.innerHeight);
    },
    onDocumentMouseMove(event) {
      event.preventDefault();

      this.mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
      this.mouse.y = -(event.clientY / window.innerHeight) * 2 + 1 + 0.03;
    },
    onDocumentMouseUp(event){
      event.preventDefault();
      this.isClick = true;
    },
    setRenderer() {
      this.renderer = new THREE.WebGLRenderer({ antialias: true }); //antialias 平滑化
      this.renderer.setPixelRatio(window.devicePixelRatio);
      this.renderer.setSize(window.innerWidth, window.innerHeight);
      this.container.appendChild(this.renderer.domElement);
    },
    animate() {
      requestAnimationFrame(this.animate);
      this.select();
      this.moveCamera();
      this.renderer.render(this.scene, this.camera);
      this.stats.update();
    },
    select() {
      this.raycaster.setFromCamera(this.mouse, this.camera);
      var intersects=[];
      /*this.TrackGroup.forEach(element => {
        intersects.push(this.raycaster.intersectObjects(element,true))
      });*/
      intersects = this.raycaster.intersectObjects(this.TrackGroup,true)
      
      if(intersects.length>0){ //intersects 是持續偵測的物體  INTERSECTED是將偵測到的物件儲存起來，且改變顏色
        if(intersects != this.INTERSECTED){  //如果當前選擇的物體跟剛剛選擇的物體不一樣，則進行下一步
          if(this.INTERSECTED){ //如果剛剛有取得物件，那就先把剛剛取得的物件顏色先修改回來
          this.INTERSECTED.material.color.setHex(this.INTERSECTED.currentHex);
          }
          this.INTERSECTED = intersects[0].object;
          this.INTERSECTED.currentHex=this.INTERSECTED.material.color.getHex();
          this.INTERSECTED.material.color.setHex(0xff377e);
          this.eventListenerControl(false); //監聽是否要讓Orbit controller 作用
          this.onClick(this.INTERSECTED); //偵測是否有點擊
        }
      }else{
        if(this.INTERSECTED){  //如果剛剛有取得物件，那就先把剛剛取得的物件顏色先修改回來
          this.INTERSECTED.material.color.setHex(this.INTERSECTED.currentHex);
        }
        this.eventListenerControl(true);
        this.INTERSECTED=null;
      }
    },
    eventListenerControl(boolean){
      if(boolean){
        this.controls.enabled=true;
      }else{
        this.controls.saveState();
        this.controls.enabled = false;
        document.addEventListener('mouseup', this.onDocumentMouseUp);
        this.controls.reset();
      }
    },
    onClick(key){
      if(this.isClick === true){
        var culID = this.MeshID_to_TrackDataID.get(key.id)
        
        console.log(culID);
        this.isClick =false;
      }
    },
    moveCamera(){
      if (this.TrackPositionY>0){
        this.TrackPositionY--;
        this.TrackGroup.forEach(element => {
          element.position.set(element.position.x, element.position.y + 1,element.position.z);
        });
      }else if(this.TrackPositionY ===0){
        this.Pianokey();
        this.TrackPositionY=-1;
      }
    }
  },
  mounted() {
    this.init();
    this.animate();
  }
};
</script>
<style>
body {
  margin: 0 !important;
  font-family: sans-serif;
}
#info {
  width: 100vw;
  height: 15vh;
  position: absolute;
  z-index: 1;
  margin-left: 25px;
}
</style>