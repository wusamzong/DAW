<template>
  <div id="ui" class="ui">
    <img src="../../assets/icon/left.png" height="30px" alt="left.png" />
    <div class="text">
      <p v-for="index in 10" :key="index">{{index}}</p>
    </div>
    <img src="../../assets/icon/right.png" height="30px" alt="right.png" />
    <img class="zoom" src="../../assets/icon/zoomIn.png" height="30px" alt="zoomIn.png" />
    <img class="zoom" src="../../assets/icon/zoomOut.png" height="30px" alt="zoomOut.png" />
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

  },

  methods: {},
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
  font-size: 16px;
  color: white;
}
.ui .text p {
  padding: 5px;
  margin: 0 1px;
  background-color: rgba(255, 255, 255, 0.5);
  cursor: pointer;
}
.ui .text p:hover{
  background-color: rgba(222, 103, 255, 0.5);
}

img {
  margin: 0px 1px;
  background-color: rgba(255, 255, 255, 0.5);
  cursor: pointer;
}
.zoom {
  background-color: rgba(255, 255, 255, 0) !important;
}
img:hover{
  background-color: rgba(222, 103, 255, 0.5);
}
</style>