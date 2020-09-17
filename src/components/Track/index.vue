<template src='./template.html'>

</template>

<script>
export default {
  data(){
    return{

    }
  },
  props: {
    boolean: {
      type: Object,
      required: true
    },
  },
  
  methods:{
    muteHandler(){
      this.$emit("setMute");
    },
    soloHandler(){
      this.solo= !this.solo
    },
    showboolean(){
     
    }
  },
  mounted(){
    
  }
}
</script>

<style scope>
.Track{
  display: inline-block;
  margin: 5px;
  border-radius: 5px;
  width: 95%;
  height: 130px;
  display: grid;
  grid-template-columns: 65px auto;
  grid-template-rows: 65px 65px;
  grid-template-areas: 
    "leftButton rightMessenge"
    "leftButton rightMessenge";
}
.notSelect{
  background: #464646;
}
.selectTrack{
  background: #797979;
}
.leftButton{
  grid-area: leftButton;
  display: flex;
  flex-direction: column;
  flex-wrap: nowrap;
  justify-content: space-around;
}
.leftButton button{
  width: 98%;
  height: 48%;
  background: #5c5c5c;
  border: none;
  font-size: 24px;
}
.rightMessenge{
  grid-area: rightMessenge;
}
</style>