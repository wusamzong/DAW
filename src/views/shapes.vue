<template>
  <div id="app">
    <UI id="ui" />
    <div id="info">
      <div class="header">
        <button @click="addTrack">add Track</button>
        <button @click="playHandler">Play/Pause</button>
        <button @click="showCameraPosition">Show Camera Position</button>
        <button @click="cameraIsMoving = !cameraIsMoving">
          change cameraIsMoving status
        </button>
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
import * as Tone from "tone";
//import Stats from "three/examples/jsm/libs/stats.module.js";
import UI from "../components/UI/index.vue";
import SQUARE from "@/views/js/square";
import STAR from "@/views/js/star";
import INIT from "@/views/js/init";
import TONE from "@/views/js/tone";
//import { Camera } from 'three';
//import { NURBSCurve } from 'three/examples/jsm/curves/NURBSCurve.js';
//import { NURBSSurface } from "three/examples/jsm/curves/NURBSSurface.js";

export default {
  components: {
    UI,
  },
  data() {
    var container;
    //var stats
    var camera, scene, raycaster, renderer;
    var group;
    var controls;
    var mouse, INTERSECTED;
    var star;
    //var extrudeSettings;
    return {
      container,
      //stats,
      camera,
      scene,
      renderer,
      group,
      controls,
      raycaster: new THREE.Raycaster(),
      mouse: new THREE.Vector2(),
      INTERSECTED,
      star,
      TrackGroup: [], //用於push Mesh
      Tracknum: 0,
      //cameraPosition: [],
      cameraVector: 0,
      cameraTrack: 0,
      cameraIsMoving: false,
      notMoved: true,
      TrackPositionY: -1,
      id: 0,
      orbitChanging: false,
      //MeshID_to_TrackDataID:[],  //每個Track的第一個Mesh的Mesh ID
      focusTrack: -1,
      tempAnimate: [],

      Track: [],
      isPlaying: false,
      index: -1,
    };
  },
  methods: {
    init() {
      this.container = INIT.container(document);
      this.scene = INIT.scene();
      this.camera = INIT.camera(this.scene);
      this.controls = INIT.controller(this.camera, this.container);
      this.renderer = INIT.renderer(window, this.container);
      //this.star = STAR.createStars(this.scene)
      this.initEventListener();
      this.addTrack();
      TONE.setTransport(this.Track,this.index);
    },
    initEventListener() {
      document.addEventListener("mousemove", this.onDocumentMouseMove, false);
      this.controls.addEventListener("change", this.onControlsChange);
      this.controls.addEventListener("end", this.onControlsEnd);
    },
    addTrack() {
      if (this.Tracknum < 3) {
        this.scene.add(
          SQUARE.Pianokey(
            this.TrackGroup,
            this.Tracknum,
            this.camera
          )
        );
        this.Track[this.Tracknum]=TONE.addTrackHandler(this.Tracknum);
        console.log(this.Track[this.Tracknum])
        this.cameraVector = this.TrackGroup[this.Tracknum].cameraPosition;
        this.moveCameraAnimation(this.Tracknum); //把攝影機對像最新創建的音軌
        this.Tracknum++;
      }
    },
    playHandler(){
      this.isPlaying=TONE.playHandler(this.isPlaying)
      if(!this.isPlaying){
        index = -1;
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
    animate() {
      requestAnimationFrame(this.animate);
      if (!this.cameraIsMoving || !this.orbitChanging) {
        this.select();
      }
      //STAR.starRender(this.star.children);
      this.renderer.render(this.scene, this.camera);
      //this.stats.update();
    },
    select() {
      this.raycaster.setFromCamera(this.mouse, this.camera);
      var intersects = [];
      intersects = this.raycaster.intersectObjects(this.TrackGroup, true);
      if (intersects.length > 0) {
        //intersects 是持續偵測的物體  INTERSECTED是將偵測到的物件儲存起來，且改變顏色
        if (intersects[0].object != this.INTERSECTED) {
          //如果當前選擇的物體跟剛剛選擇的物體不一樣，則進行下一步
          if (this.INTERSECTED) {
            //如果剛剛有取得物件，那就先把剛剛取得的物件顏色先修改回來
            this.INTERSECTED.material.color.setHex(this.INTERSECTED.currentHex);
          }
          this.INTERSECTED = intersects[0].object;
          this.INTERSECTED.currentHex = this.INTERSECTED.material.color.getHex(); //currentHex
          this.INTERSECTED.material.color.setHex(0xff377e);
          document.addEventListener("click", this.onClick); //偵測是否有點擊
        }
      } else {
        if (this.INTERSECTED) {
          //如果剛剛有取得物件，那就先把剛剛取得的物件顏色先修改回來
          this.INTERSECTED.material.color.setHex(this.INTERSECTED.currentHex);
        }
        this.INTERSECTED = null;
      }
    },
    onControlsChange() {
      this.orbitChanging = true;
    },
    onControlsEnd() {
      this.orbitChanging = false;
    },
    onClick() {
      let key = this.INTERSECTED;
      if (key === null) return;
      //console.log(key.index[0],key.index[1]);   //index[0]=>第幾個Track ,index[1]=>第幾個key
      //找到對應的TrackData
      //this.TrackData[key.index[0]][key.index[1]] = !this.TrackData[key.index[0]][key.index[1]];
      TONE.editTrackHandler(this.Track[key.index[0]].Data, key.index[1]);
      //顏色設置與否
      if (key.currentHex === 0xffff00) {
        key.currentHex = 0xff3dff;
      } else {
        key.currentHex = 0xffff00;
      }
      //當前應該關注的Track
      this.focusTrack = key.index[0];
      this.cameraVector = this.TrackGroup[this.focusTrack].cameraPosition;
      this.moveCameraAnimation(this.focusTrack);
    },
    showCameraPosition() {
      console.log("Camera Position(x,y,z):");
      console.log(
        this.camera.position.x,
        this.camera.position.y,
        this.camera.position.z
      );
    },
    moveCameraAnimation(goalTrack) {
      let position = this.camera.position;
      if (this.cameraTrack === goalTrack) {
        //當關注的Track等於camera關注的track時 就不跑這個function
        this.controls.enabled = true;
        return;
      }

      if (Math.abs(this.cameraVector[1] - position.y) > 1) {
        //開始移動
        this.cameraIsMoving = true;
        this.controls.enabled = false;
        if (this.cameraVector[1] - position.y < 1) {
          //往下
          this.camera.position.set(position.x, position.y - 1, position.z);
        } else if (this.cameraVector[1] - position.y > 1) {
          //往上
          this.camera.position.set(position.x, position.y + 1, position.z);
        }
        //console.log(position.x,position.y,position.z);
        let requestId = requestAnimationFrame(() => {
          this.moveCameraAnimation(goalTrack);
        });
        requestId;
        this.renderer.render(this.scene, this.camera);
        //this.stats.update();
      } else {
        // 不要動
        this.camera.position.set(position.x, this.cameraVector[1], position.z);
        this.cameraTrack = goalTrack;
        this.cameraIsMoving = false;
        this.controls.enabled = true;
      }
    },
  },
  mounted() {
    this.init();
    this.animate();
  },
};
</script>
<style>
body {
  margin: 0 !important;
  font-family: sans-serif;
}
#ui {
  width: 100vw;
  height: 15vh;
  position: absolute;
  z-index: 1;
  margin-left: 25px;
}
#info {
  width: 100vw;
  height: 15vh;
  position: absolute;
  z-index: 1;
  margin-left: 25px;
}
</style>