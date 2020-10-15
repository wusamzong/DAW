<template>
  <div id="app">
    <div id="info">
      <div class="header">
        <button @click="addTrack">add Track</button>
        <button @click="showCameraPosition">Show Camera Position</button>
        <button @click="cameraIsMoving=!cameraIsMoving">change cameraIsMoving status</button>
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
//import { Camera } from 'three';
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
      TrackGroup: [], //用於push Mesh
      Tracknum: 0,
      //cameraPosition: [],
      cameraVector: 0,
      cameraTrack: 0,
      cameraIsMoving:false,
      notMoved: true,
      TrackPositionY: -1,
      barNum: 0,
      TrackData: [], //用於操作Track
      id: 0,
      orbitChanging: false,
      //MeshID_to_TrackDataID:[],  //每個Track的第一個Mesh的Mesh ID
      focusTrack: -1,
      tempAnimate: [],
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
    initContainer() {
      this.container = document.createElement("div");
      document.body.appendChild(this.container);
      this.stats = new Stats();
      this.container.appendChild(this.stats.dom);
      this.container.style.touchAction = "none";
    },
    initScene() {
      this.scene = new THREE.Scene();
      this.scene.background = new THREE.Color(0x2b0083);
    },
    initCamera() {
      this.camera = new THREE.PerspectiveCamera(
        50,
        window.innerWidth / window.innerHeight,
        1,
        1000
      );
      this.camera.position.set(0, 0, 0); //(x,y,z)
      this.camera.rotation.set(0,0,0);
      this.scene.add(this.camera);
    },
    initController() {
      this.controls = new OrbitControls(this.camera, this.container);
      this.controls.target.set(0, 0, -1);
      this.controls.update();
      this.raycaster = new THREE.Raycaster();
      this.mouse = new THREE.Vector2();
      document.addEventListener("mousemove", this.onDocumentMouseMove, false);
      this.controls.addEventListener("change", this.onControlsChange);
      this.controls.addEventListener("end", this.onControlsEnd);
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
        color: 0xff3dff,
        transparent: true,
        opacity: opacity,
        side: THREE.DoubleSide
      });
      var mesh = new THREE.Mesh(geometry, material);
      mesh.position.set(x, y, z);
      mesh.rotation.set(rx, ry, rz);
      mesh.scale.set(s, s, s);
      mesh.index = [this.Tracknum, id]; //在mesh裡面插入Track和在這個Track的id
      return mesh;
      //this.scene.add(mesh);
    },
    Pianokey() {
      var R = 30;
      var Length;
      var angle = 0;
      var id = 0;
      this.TrackGroup[this.Tracknum] = new THREE.Group();
      this.TrackData[this.Tracknum] = [];
      this.barNum = 72;
      for (let j = -3; j < 4; j++) {
        R = 30 * Math.cos(((Math.PI * 1) / 32) * j);
        Length = (Math.PI * R) / 60;
        let y = (R / 35) * j - this.Tracknum * 8;

        angle = -1;
        var Gradient = 0;
        for (let i = 2; i > 2 / 3; i -= 1 / 54) {
          let x = R * Math.cos(Math.PI * angle);
          let z = R * Math.sin(Math.PI * angle);

          this.TrackData[this.Tracknum].push(false);
          this.TrackGroup[this.Tracknum].add(
            this.addsquare(
              Length,
              x,
              y,
              z,
              0,
              i * Math.PI + (Math.PI * 3) / 2,
              0,
              1,
              Math.sin(Math.PI * Gradient) * 0.8 + 0.1,
              id++
            )
          );
          Gradient += 1 / this.barNum;
          angle += 1 / 54;
        }
      }

      this.TrackGroup[this.Tracknum].cameraPosition = [
        this.camera.position.x,
        this.Tracknum * -8,
        this.camera.position.z,
      ];

      this.scene.add(this.TrackGroup[this.Tracknum]);
      //console.log(this.TrackGroup[this.Tracknum].cameraPosition);
      
      
      this.cameraVector = this.TrackGroup[this.Tracknum].cameraPosition;

      
      this.moveCameraAnimation(this.Tracknum); //把攝影機對像最新創建的音軌

      this.Tracknum++;
    },
    addTrack() {
      if (this.Tracknum < 3) {        
        this.Pianokey();
        
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
    onDocumentClick(event) {
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
      if(!this.cameraIsMoving || !this.orbitChanging){
        this.select();
      }
      this.renderer.render(this.scene, this.camera);
      this.stats.update();
    },
    select() {
      
      this.raycaster.setFromCamera(this.mouse, this.camera);    

      var intersects = [];

      intersects = this.raycaster.intersectObjects(this.TrackGroup, true);
      if (intersects.length > 0) {
        //intersects 是持續偵測的物體  INTERSECTED是將偵測到的物件儲存起來，且改變顏色
        if (intersects != this.INTERSECTED) {
          //如果當前選擇的物體跟剛剛選擇的物體不一樣，則進行下一步
          if (this.INTERSECTED) {
            //如果剛剛有取得物件，那就先把剛剛取得的物件顏色先修改回來
            this.INTERSECTED.material.color.setHex(this.INTERSECTED.currentHex);
          }
          this.INTERSECTED = intersects[0].object;
          this.INTERSECTED.currentHex = this.INTERSECTED.material.color.getHex();
          this.INTERSECTED.material.color.setHex(0xff377e);
          
          document.addEventListener('click',this.onClick);//偵測是否有點擊
        }
      } else {
        if (this.INTERSECTED) {
          //如果剛剛有取得物件，那就先把剛剛取得的物件顏色先修改回來
          this.INTERSECTED.material.color.setHex(this.INTERSECTED.currentHex);
        }
        this.INTERSECTED = null;
      }
    },
    onControlsChange(){
      this.orbitChanging = true;
    },
    onControlsEnd(){
      this.orbitChanging = false;
    },
    onClick() {
      let key = this.INTERSECTED
      console.log(key.index[0],key.index[1]);
      this.focusTrack = key.index[0];
      key.material.color.setHex(0xffff00);
      this.cameraVector = this.TrackGroup[this.focusTrack].cameraPosition;
      this.moveCameraAnimation(this.focusTrack);
    },
    showCameraPosition(){
      console.log('Camera Position(x,y,z):' );
      console.log(this.camera.position.x,this.camera.position.y,this.camera.position.z);
    },
    moveCameraAnimation(goalTrack) {
      let position = this.camera.position
      if(this.cameraTrack === goalTrack){ //當關注的Track等於camera關注的track時 就不跑這個function
        this.controls.enabled = true;
        return;
      }

      if(Math.abs(this.cameraVector[1]-position.y)>1){  //開始移動
        this.cameraIsMoving =true;
        this.controls.enabled = false;
        if(this.cameraVector[1]-position.y<1){  //往下
          this.camera.position.set(position.x,position.y-1,position.z);
        }
        else if(this.cameraVector[1]-position.y>1){  //往上
          this.camera.position.set(position.x,position.y+1,position.z);    
        }
        //console.log(position.x,position.y,position.z);
        let requestId = requestAnimationFrame(() => { this.moveCameraAnimation(goalTrack); });
        requestId;
        this.renderer.render(this.scene, this.camera);
        this.stats.update();
        
      }else{  // 不要動
        this.camera.position.set(position.x,this.cameraVector[1],position.z); 
        this.cameraTrack = goalTrack;
        this.cameraIsMoving =false;
        this.controls.enabled = true;
      }
      console.log(goalTrack ,this.cameraTrack)
    },

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