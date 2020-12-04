<template>
  <div id="ui" class="ui">
    <template v-if="!sceneStatus">
      <img class="add" @click="addTrackHandler" src="../../assets/icon/add.png" height="50px" alt="add.png" />
      <!--play / pause-->
      <img v-if="!TONE.isPlaying" @click="playHandler" src="../../assets/icon/play.png" height="50px" alt="play.png" />
      <img v-else @click="playHandler" src="../../assets/icon/pause.png" height="50px" alt="pause.png" />
      <!--loop-->
      <img v-if="!TONE.loop" @click="loopHandler" src="../../assets/icon/notloop.png" height="50px" alt="loop.png" />
      <img v-else @click="loopHandler" src="../../assets/icon/loop.png" height="50px" alt="loop.png" />
      <div class="text">
        <p>{{bpm}} BPM</p>
        <div class="number">
          <img @click="setBPM(5)" src="../../assets/icon/increase.png" height="24px" alt="">
          <img @click="setBPM(-5)" src="../../assets/icon/decrease.png" height="24px" alt="">
        </div>
        <p>{{time}}</p>
      </div>
    </template>

    <template v-else>
      <img
        class="back"
        @click="SCENE.sceneChange(0)"
        src="../../assets/icon/back.png"
        height="50px"
        alt="back.png"
      />
      <img class="add" @click="addTrackHandler" src="../../assets/icon/add.png" height="50px" alt="add.png" />
      <!--play / pause-->
      <img v-if="!TONE.isPlaying" @click="playHandler" src="../../assets/icon/play.png" height="50px" alt="play.png" />
      <img v-else @click="playHandler" src="../../assets/icon/pause.png" height="50px" alt="pause.png" />
      <!--loop-->
      <img v-if="!TONE.loop" @click="loopHandler" src="../../assets/icon/notloop.png" height="50px" alt="loop.png" />
      <img v-else @click="loopHandler" src="../../assets/icon/loop.png" height="50px" alt="loop.png" />
      <div class="text">
        <p>{{bpm}} BPM</p>
        <div class="number">
          <img @click="setBPM(5)" src="../../assets/icon/increase.png" height="24px" alt="">
          <img @click="setBPM(-5)" src="../../assets/icon/decrease.png" height="24px" alt="">
        </div>
        
        <p>{{time}}</p>
        <p v-bind:class="[Track.isSolo ? 'activate' : 'deactivate']">S</p> 
        <p @click="muteHandler" v-bind:class="[Track.isMute ? 'activate' : 'deactivate']">M</p>
        <p @click="$emit('windowHandler')">LFO</p>
        <p @click="$emit('windowHandler')">ADSR</p>
        <p @click="$emit('windowHandler')">Filter</p>

      </div>
      
    </template>
  </div>  
</template>
<script>

import {addTrack} from '@/views/js/controller/trackControl';
import {trackModel} from '@/views/js/model/track'
import TONE from "@/views/js/tone"
import SCENE from "@/views/js/scene"
export default {
  data() {
    return {
      Track:undefined,
      isMute: 0,
      isSolo: 0,
      test: "test",
      bpm: 120,
      time: "00:00:00",
      editTrack: false,
      SCENE,
      sceneStatus: SCENE.sceneStatus,
      TONE,

    };
  },
  // props: {
  //   isPlaying:{
  //     type: Boolean,
  //     required: true
  //   }
  // },
  watch:{
    "SCENE.sceneStatus": function(){
      this.sceneStatus = SCENE.sceneStatus
      if(this.sceneStatus === 1)
        this.Track = trackModel.audioData[SCENE.focusing]
      else
        this.Track = undefined;
    },
    "TONE.time.ms": function(){
      this.time = TONE.time.m+':'+TONE.time.s+':'+TONE.time.ms;
    },
    "Track.isMute": function(){
      if(this.sceneStatus === 1)
        this.isMute = this.Track.isMute;
    },
    "Track.isSolo": function(){
      if(this.sceneStatus === 1)
        this.isSolo = this.Track.isSolo;
    }
  },
  methods: {
    addTrackHandler() { 
      addTrack();
    },
    playHandler() {
      this.isPlaying = TONE.playHandler(this.isPlaying);
      if (!this.isPlaying) {
        this.index = -1;
      }
    },
    loopHandler(){
      TONE.loop = !TONE.loop;
      console.log(TONE.loop)
    },
    setBPM(value){
      this.bpm+=value
      TONE.setBPM(this.bpm)
    },
    muteHandler(){
      TONE.muteHandler(this.Track)
    },
  },
  mounted() {

  }
};
</script>
<style scoped>
.ui {
  display: flex;
  flex-direction: row;
  flex-wrap: nowrap;
  justify-content: flex-end;
  align-items: stretch;
}
.ui .text {
  display: flex;
  justify-content: flex-end;
  font-size: 18px;
  color: white;
  /* position: relative;
  margin: 20px;
  font-size: 25px;
  bottom: 5px !important;
  color: white; */
}
.activate{
  color: rgba(255, 255, 255, 1);
}
.deactivate{
  color: rgba(255, 255, 255, 0.5);
}
.ui .text p {
  margin: 0;
  padding: 20px;
  margin: 0px 2px;
  background-color: rgba(255, 255, 255, 0.5);
  cursor: pointer;
}
.ui .text p:hover{
  background-color: rgba(222, 103, 255, 0.5);
}

img {
  margin: 0px 2px;
  background-color: rgba(255, 255, 255, 0.5);
  cursor: pointer;
}
.back {
  background-color: rgba(255, 255, 255, 0) !important;
}
.add {
  background-color: rgba(218, 80, 148, 0.5) !important;
}
img:hover{
  background-color: rgba(222, 103, 255, 0.5);
}
.number{
  display:flex;
  flex-direction: column;
  flex-wrap: nowrap;
  justify-content: space-between;
}


</style>