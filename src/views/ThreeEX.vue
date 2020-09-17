<template>
  <div id="app">
    {{test}}
  </div>
</template>
<script>
import * as THREE from 'three';
export default {
  data(){
    //const THREE=this.THREE
    var scene = new THREE.Scene();
    //var camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);

    //var renderer = new THREE.WebGLRenderer();
    /*var scene = THREE.Scene;
    var camera = THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    var renderer = THREE.WebGLRenderer();
    var geometry = THREE.BoxGeometry();
    var material = THREE.MeshBasicMaterial({ color: 0x00ff00 });
    var cube = THREE.Mesh(geometry, material);*/
    
    return{
      test: 'testt',
      //THREE,
      scene,
      //camera,
      //renderer,
      /*geometry,
      material,
      cube*/
    }
  },/*
  methods:{
    set(){
      this.renderer.setSize(window.innerWidth, window.innerHeight);
      document.body.appendChild(this.renderer.domElement);
      this.scene.add(this.cube);
      this.camera.position.z = 5;
    },
    animate(){
      //requestAnimationFrame(this.animate);
      this.renderer.render(this.scene, this.camera);
      this.cube.rotation.x += 0.01;
      this.cube.rotation.y += 0.01;
    }
  },
  mounted(){
    this.animate();
  }*/
}
</script>
<style scoped>

</style>