<template>
  <div id="app">
    <topUI id="topUI" @windowHandler="windowHandler"/>
    <windows v-if="openWindow" />
    <bottomUI id="bottomUI" @zoom="zoomHandler"/>
  </div>
</template>
<script>
import topUI from "../components/UI/top.vue";
import bottomUI from "../components/UI/bottom.vue";
import windows from "../components/UI/window.vue";

import {animateInterface} from "@/views/js/animation";
import {objectInit} from "@/views/js/controller/objectInit";
import {init} from "@/views/js/init";

import CAMERA from "@/views/js/camera";


//import * as Tone from "tone";
//import { Camera } from 'three';
//import { NURBSCurve } from 'three/examples/jsm/curves/NURBSCurve.js';
//import { NURBSSurface } from "three/examples/jsm/curves/NURBSSurface.js";

export default {
  components: {
    topUI,
    bottomUI,
    windows
  },
  data() {
    return {
      openWindow: false,
    };
  },
  methods: {
    zoomHandler(boolean){
      if(boolean){ //out
        CAMERA.zoomOut();
      }else{  //in
        CAMERA.zoomIn();
      }
    },
    windowHandler(){
      this.openWindow = !this.openWindow;
    },
  },
  mounted() {
    init(document, window);
    objectInit();
    animateInterface();
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