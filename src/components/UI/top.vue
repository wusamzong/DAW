<template>
  <div id="ui" class="ui">
    <template v-if="!sceneStatus">
      <img class="add" src="../../assets/icon/add.png" height="50px" alt="add.png" />
      <!--play / pause-->
      <img src="../../assets/icon/play.png" height="50px" alt="play.png" />
      <img src="../../assets/icon/pause.png" height="50px" alt="pause.png" />
      <img src="../../assets/icon/loop.png" height="50px" alt="loop.png" />
      <div class="text">
        <p>{{bpm}} BPM</p>
        <p>{{time}}</p>
        <p @click="$emit('sceneChange',1)">change</p>
      </div>
    </template>

    <template v-else>
      <img
        class="back"
        @click="$emit('sceneChange',0)"
        src="../../assets/icon/back.png"
        height="50px"
        alt="back.png"
      />
      <img class="add" src="../../assets/icon/add.png" height="50px" alt="add.png" />
      <!--play / pause-->
      <img src="../../assets/icon/play.png" height="50px" alt="play.png" />
      <img src="../../assets/icon/pause.png" height="50px" alt="pause.png" />
      <div class="text">
        <p>{{bpm}} BPM</p>
        <p>{{time}}</p>
        <p>S</p>
        <p>M</p>
        <p>LFO</p>
        <p>ADSR</p>
        <p>Filter</p>
        <p @click="$emit('sceneChange',0)">change</p>
      </div>
    </template>
  </div>
</template>
<script>
export default {
  data() {
    return {
      test: "test",
      bpm: 120,
      time: "00:00:00",
      editTrack: false
    };
  },
  props: {
    sceneStatus: {
      type: Number,
      required: true
    },
  },

  methods: {

  },
  mounted() {}
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


</style>