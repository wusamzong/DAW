<template>
  <div id="app">
    <div id="nav" v-if="showRouter" >
      <router-link to="/Todo">To do list</router-link> |
      <router-link to="/DAW" @click.native="showPage">DAW</router-link> |
      <router-link to="/APITest">API Test</router-link> |
      <router-link to="/ThreeEX">ThreeEX</router-link> |
      <router-link to="/Dragging">Dragging</router-link>|
      <router-link to="/shapes" @click.native="showPage">shapes</router-link>|
      <router-link to="/lightOut" @click.native="showPage">lightOut</router-link>
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
      var url =window.location.href.split('/').reverse();
      if(url[0]==='lightOut' ||url[0]==='DAW'||url[0]==='shapes'){
        this.showRouter =!this.showRouter;
      }
    }
  },
  mounted(){
    this.showPage();    
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
