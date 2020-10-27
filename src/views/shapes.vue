<template>
  <div id="app">
    <topUI id="topUI" :sceneStatus="goalStatus" @sceneChange="sceneChange" />
    <bottomUI id="bottomUI" @zoom="zoom"/>
  </div>
</template>
<script>
import * as THREE from "three";
import topUI from "../components/UI/top.vue";
import bottomUI from "../components/UI/bottom.vue";
import SQUARE from "@/views/js/square";
import STAR from "@/views/js/star";
import INIT from "@/views/js/init";
import TONE from "@/views/js/tone";
import CAMERA from "@/views/js/camera";
import SELECT from "@/views/js/select";
import SCENE from "@/views/js/scene";
import CONTROLS from "@/views/js/controls";
import VECTOR from "@/views/js/vector";
//import * as Tone from "tone";
//import Stats from "three/examples/jsm/libs/stats.module.js";
//import { Camera } from 'three';
//import { NURBSCurve } from 'three/examples/jsm/curves/NURBSCurve.js';
//import { NURBSSurface } from "three/examples/jsm/curves/NURBSSurface.js";

export default {
  components: {
    topUI,
    bottomUI
  },
  data() {
    var container;
    //var stats
    var renderer;
    var group;
    var INTERSECTED;
    var star;
    return {
      container,
      goalStatus: 0, //是在大場景或是小場景
      selectGroup:[],
      renderer,
      group,
      INTERSECTED,
      which: -1,
      star,
      TrackGroup: [], //用於push Mesh
      SimplifyTrackGroup: new THREE.Group(),
      Tracknum: 0,
      focusTrack: -1,
      isPlaying: false
      //stats,
    };
  },
  methods: {
    init() {
      this.container = INIT.container(document);
      this.renderer = INIT.renderer(window, this.container);
      
      SCENE.init();
      CAMERA.init(SCENE.scene);
      SELECT.init(document);
      CONTROLS.init(CAMERA.camera, this.container)
      //this.controls = INIT.controller(CAMERA.camera, this.container);
      INIT.onWindowResize(window, CAMERA.camera, this.renderer);
      
      this.star = STAR.createStars(SCENE.scene);
      VECTOR.addVector();
      this.addTrack();
      SCENE.sceneChange(0);
      
      TONE.setTransport();
       //偵測是否有點擊
    },

    addTrack() {
      if (this.Tracknum < 3) {
        SCENE.scene.add(SQUARE.Pianokey(this.TrackGroup, this.Tracknum));
        SCENE.scene.add(
          SQUARE.addSimplifySquare(0, 0, 0, this.SimplifyTrackGroup)
        ); //加入簡易的Track
        this.selectGroup=[this.SimplifyTrackGroup, this.TrackGroup]
        TONE.addTrackHandler(this.Tracknum); //加入聲音資料

        CAMERA.cameraVector = this.TrackGroup[this.Tracknum].cameraPosition; //傳遞告訴camera要去某個Track的具體位置(Vector)
        CAMERA.moveCameraAnimation(
          SCENE.scene,
          this.renderer,
          this.focusTrack
        ); //把攝影機對像最新創建的音軌
        this.Tracknum++;
      }
    },
    playHandler() {
      this.isPlaying = TONE.playHandler(this.isPlaying);
      if (!this.isPlaying) {
        this.index = -1;
      }
    },
    animate() {
      requestAnimationFrame(this.animate);
      this.goalStatus=SCENE.sceneStatus;
      if (!CAMERA.cameraIsMoving || !CONTROLS.controls.orbitChanging) {
        SELECT.raycasterAnimate(CAMERA.camera,this.selectGroup)
      }
      STAR.starRender(this.star.children);
      this.renderer.render(SCENE.scene, CAMERA.camera);
      //this.stats.update();

    },
    sceneChange(num){
      SCENE.sceneChange(num);
    },
    zoom(boolean){
      if(boolean){ //out
        CAMERA.zoomOut(this.renderer);
      }else{  //in
        CAMERA.zoomIn(this.renderer);
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
  overflow: hidden;
}
#topUI {
  top: 50px;
  left: 50px;
  height: 6vh;
  position: absolute;
  z-index: 1;
  /* background: rgba(255,255,255,0.3); */
}
#bottomUI {
  bottom: 50px;
  right: 50px;

  position: absolute;
  z-index: 1;
  /* background: rgba(255,255,255,0.3); */
}
#info {
  width: 100vw;
  height: 15vh;
  position: absolute;
  z-index: 1;
  margin-left: 25px;
}
</style>