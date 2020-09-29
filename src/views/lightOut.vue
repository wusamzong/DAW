<template>
  <div id="app"></div>
</template>
<script>
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import Stats from "three/examples/jsm/libs/stats.module.js";
export default {
  data() {
    var container, stats;
    var camera, scene, renderer;
    var controls, raycaster;
    var group;
    var mouse, INTERSECTED;
    return {
      container,
      stats,
      camera,
      scene,
      renderer,
      controls,
      raycaster,
      group,
      mouse,
      INTERSECTED,
      temp: [],
    };
  },
  methods: {
    init() {
      this.initContainer();
      this.initScene();
      this.initCamera();
      this.initController();
      this.initRender();
      this.initSelect();
      this.buildPlayGround(12);
    },
    initContainer() {
      this.container = document.createElement("div");
      document.body.appendChild(this.container);
      this.stats = new Stats();
      this.container.appendChild(this.stats.dom);
    },
    initScene() {
      this.scene = new THREE.Scene();
      this.scene.background = new THREE.Color(0x2b0083);
    },
    initCamera() {
      this.camera = new THREE.PerspectiveCamera(
        50,
        window.innerWidth / window.innerHeight,
        1,
        1000
      );
      this.camera.position.set(0, 0, 0);
      this.scene.add(this.camera);
    },
    initController() {
      this.controls = new OrbitControls(this.camera, this.container);
      this.controls.target.set(0, 0, -1);
      this.controls.update();
    },
    initRender() {
      this.renderer = new THREE.WebGLRenderer({ antialias: true }); //antialias 平滑化
      this.renderer.setPixelRatio(window.devicePixelRatio);
      this.renderer.setSize(window.innerWidth, window.innerHeight);
      this.container.appendChild(this.renderer.domElement);
    },
    initSelect() {
      this.raycaster = new THREE.Raycaster();
      this.mouse = new THREE.Vector2();
      document.addEventListener("mousemove", this.onDocumentMouseMove, false);
    },
    addTriangle(Length, x, y, z, rx, ry, rz, s) {
      var triangleShape = new THREE.Shape()
        .moveTo(0, Length)
        .lineTo((Length / 2) * Math.sqrt(3), -Length / 2)
        .lineTo((-Length / 2) * Math.sqrt(3), -Length / 2)
        .lineTo(0, Length);
      var geometry = new THREE.ShapeBufferGeometry(triangleShape);
      var material = new THREE.MeshBasicMaterial({
        color: 0xff3dff,
        side: THREE.DoubleSide,
      });
      var mesh = new THREE.Mesh(geometry, material);
      mesh.position.set(x, y, z);
      mesh.rotation.set(rx, ry, rz);
      mesh.scale.set(s, s, s);
      return mesh;
    },
    buildPlayGround(level) {
      //this.addTriangle(Length,x,y,z,rx,ry,rz,1)
      //let playGround = new Array();
      let pORn;
      var xP,
        temp = 0;
      this.group = new THREE.Group();
      for (let i = 0; i < level; i++) {
        pORn = true;
        if (i > 1 && i % 2 === 0) {
          temp -= 3;
        }
        xP = temp + Math.ceil(i / 2) * -3;
        /*for(let j=0;j<i*2+1;j++){
          if(pORn === true)
            playGround.push(this.addTriangle(3,xP+j*3,-i*5,-50,0,0,0,1)) 
          else
            playGround.push(this.addTriangle(3,xP+j*3,-i*5+1.5,-50,0,0,Math.PI,1)) 
          pORn = !pORn

        }*/
        for (let j = 0; j < i * 2 + 1; j++) {
          if (pORn === true)
            this.group.add(
              this.addTriangle(3, xP + j * 3, -i * 5, -50, 0, 0, 0, 1)
            );
          else
            this.group.add(
              this.addTriangle(
                3,
                xP + j * 3,
                -i * 5 + 1.5,
                -50,
                0,
                0,
                Math.PI,
                1
              )
            );
          pORn = !pORn;
        }
      }
      /*playGround.forEach(element => {
        this.scene.add(element);
      });*/
      this.scene.add(this.group);
    },
    onDocumentMouseMove(event) {
      event.preventDefault();
      this.mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
      this.mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
    },
    render() {
      this.renderer.render(this.scene, this.camera);
      this.catchObject();
    },
    catchObject() {
      this.raycaster.setFromCamera(this.mouse, this.camera);
      var intersects = this.raycaster.intersectObjects(this.group.children, true);
      if (intersects.length > 0) {
        for (var i = 0; i < this.group.children.length; i++) {
          if (intersects[0].object.parent === this.group.children[i]) {
            // What I tested with
            //intersects[ 0 ].object.material.color.set( 0xff0000 )
            // Your code
            console.log('it work');
          }
        }
      }
      /*if (intersects.lenght>0){
        console.log(intersects);
        if(this.INTERSECTED != intersects[0].object){
          if(this.INTERSECTED)
            console.log('剛剛選擇的'+this.INTERSECTED)
          this.INTERSECTED= intersects[0].object;
          console.log('把資料放進暫存的INTERSECTED');
        }
      }else{
        if(this.INTERSECTED){
          console.log('沒有選到物件');
        }
        this.INTERSECTED = null;
      }*/
    },
    animate() {
      requestAnimationFrame(this.animate);
      this.render();
      this.stats.update();
    },
  },
  mounted() {
    this.init();
    this.animate();
  },
};
</script>