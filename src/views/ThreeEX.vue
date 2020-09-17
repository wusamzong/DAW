<template>
  <div id="app">
    
  </div>
</template>
<script>
import * as THREE from 'three';
import { VRButton } from 'three/examples/jsm/webxr/VRButton.js'
export default {
  data(){
    //const THREE=this.THREE
    var scene = new THREE.Scene();
    //camera=>(FOV(field of view) ,aspect ratio ,near ,far)
    var camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 1, 100);

    var renderer = new THREE.WebGLRenderer();
    
    var geometry = new THREE.BoxGeometry();
    //Mesh是指一個幾何物件
    var material = new THREE.MeshBasicMaterial({ color: 0xFFDFB0 });
    var cube = new THREE.Mesh(geometry, material);
    var line = new THREE.Line(geometry, material);
    /*var scene = THREE.Scene;
    var camera = THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    var renderer = THREE.WebGLRenderer();
    var geometry = THREE.BoxGeometry();
    var material = THREE.MeshBasicMaterial({ color: 0x00ff00 });
    var cube = THREE.Mesh(geometry, material);*/
    
    return{
      test: 'testt',
      scene,
      camera,
      renderer,
      geometry,
      material,
      cube,
      line,
      points: [],
    }
  },
  methods:{
    set(){
      this.renderer.setSize(window.innerWidth, window.innerHeight); //讓app指渲染一半的螢幕大小
      document.body.appendChild(this.renderer.domElement);
      document.body.appendChild(VRButton.createButton(this.renderer));
      this.renderer.xr.enabled = true;
      this.renderer.setAnimationLoop(function(){
        this.renderer.render(this.scene, this.camera);
      })
      
      //設置照相機
      this.setCamera();
      //設置物件
      //this.setLine();
      this.setCube();
      //始之動畫
      this.animate();
    },
    setCamera(){
      this.camera.position.set(0,0,10);
      this.camera.lookAt(0,0,0);
    },
    setCube(){
      this.scene.add(this.cube);//把東西加在(0,0,0)
    },
    setLine(){
      this.material = new THREE.LineBasicMaterial({color: 0x0000ff});
      this.points.push(new THREE.Vector3(-100, 0, 0));
      this.points.push(new THREE.Vector3(0, 100, 0));
      this.points.push(new THREE.Vector3(100, 0, 0));
      this.geometry = new THREE.BufferGeometry().setFromPoints(this.points);
      this.scene.add(this.line);
      this.renderer.render(this.scene, this.camera);
    },
    animate(){
      requestAnimationFrame(this.animate); //讓動畫一直渲染出來
      this.renderer.render(this.scene, this.camera);
      this.CubeAnimate();
    },
    
    CubeAnimate(){
      this.cube.rotation.x += 0.01;
      this.cube.rotation.y += 0.01;
    }
  },
  mounted(){
    this.set();
  }
}
</script>
<style scoped>
canvas { display: block; }
</style>