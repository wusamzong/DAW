<template>
  <div id="app">
    <div id="nav" v-if="showRouter" >
      <router-link to="/Todo">To do list</router-link> |
      <router-link to="/DAW" @click.native="showPage">DAW</router-link> |
      <router-link to="/APITest">API Test</router-link> |
      <router-link to="/ThreeEX">ThreeEX</router-link> |
      <router-link to="/Dragging">Dragging</router-link>|
      <router-link to="/shapes" @click.native="showPage">shapes</router-link>
    </div>
    <router-view/>    <!--會把首面檔案引用到這裡來-->
    
  </div>
    
</template>

<script>
export default {
  name:'app',
  data(){
    return{
      showRouter:true
    }
  },
  methods:{
    showPage(){
      this.showRouter=!this.showRouter
    }
  }
}
</script>

<style scoped>
body {
  font-family: sans-serif;
  margin: 0;
}
#nav {
  margin: 0 auto;
  padding: 0 20%;
}

</style>
