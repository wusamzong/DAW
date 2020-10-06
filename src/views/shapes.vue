<template>
  <div id="app">
    <div id="info">
      <div class="header">
        <button @click="addTrack">add Track</button>
        <div class="step">
          <button>undo</button>
          <button>redo</button>
        </div>
        <div class="play">
          <button>skip_previous</button>
          <button>play</button>
          <button>skip_next</button>
          <p>time</p>
        </div>
      </div>
    </div>
  </div>
</template>
<script src="./js/GUI.vue"></script>
<script>
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import Stats from "three/examples/jsm/libs/stats.module.js";
//import { NURBSCurve } from 'three/examples/jsm/curves/NURBSCurve.js';
//import { NURBSSurface } from "three/examples/jsm/curves/NURBSSurface.js";

export default {
  data() {
    var container, stats;
    var camera, scene, raycaster, render;
    var group;
    var controls;
    var mouse, INTERSECTED;
    var effectController;
    var gui;
    //var extrudeSettings;
    return {
      container,
      stats,
      camera,
      scene,
      render,
      group,
      controls,
      raycaster,
      mouse,
      INTERSECTED,
      TrackUI: [],
      Tracknum: 0,
      cameraPosition: [],
      notMoved: true,
      TrackPositionY: 0,
      effectController,
      gui
      //extrudeSettings
    };
  },
  methods: {
    init() {
      
      this.container = document.createElement("div");
      document.body.appendChild(this.container);

      this.scene = new THREE.Scene();
      this.scene.background = new THREE.Color(0x2B0083);

      this.camera = new THREE.PerspectiveCamera(
        50,
        window.innerWidth / window.innerHeight,
        1,
        1000
      );
      this.camera.position.set(0, 0, 0); //(x,y,z)

      this.scene.add(this.camera);

      this.controls = new OrbitControls(this.camera, this.container);
      this.controls.target.set(0, 0, -1);
      this.controls.update();

      this.raycaster = new THREE.Raycaster();

      this.mouse = new THREE.Vector2();

      //this.Sphere();

      this.setRenderer();     


      this.stats = new Stats();
      this.container.appendChild(this.stats.dom);

      this.container.style.touchAction = "none";

      document.addEventListener("mousemove", this.onDocumentMouseMove, false);


    },
    addsquare(Length, x, y, z, rx, ry, rz, s, opacity) {
      var sqLength = Length;
      var squareShape = new THREE.Shape()
        .moveTo(0, 0)
        .lineTo(0, sqLength / 2)
        .lineTo(sqLength, sqLength / 2)
        .lineTo(sqLength, 0)
        .lineTo(0, 0);
      //var extrudeSettings = { depth: 8, bevelEnabled: true, bevelSegments: 2, steps: 2, bevelSize: 1, bevelThickness: 1 };
      //var geometry = new THREE.ExtrudeBufferGeometry( squareShape, extrudeSettings );
      var geometry = new THREE.ShapeBufferGeometry(squareShape);
      
      var material = new THREE.MeshBasicMaterial({
        color: 0xFF3DFF,
        transparent: true,
        opacity: opacity,
        side: THREE.DoubleSide
      });
      var mesh = new THREE.Mesh(geometry, material);
      mesh.position.set(x, y, z);
      mesh.rotation.set(rx, ry, rz);
      mesh.scale.set(s, s, s);
      return mesh;
      //this.scene.add(mesh);
    },

    EllipseCurve(R, y) {
      var curve = new THREE.EllipseCurve(
        0,
        0, // ax, aY
        R,
        R, // xRadius, yRadius
        0,
        2 * Math.PI, // aStartAngle, aEndAngle
        false, // aClockwise
        0 // aRotation
      );
      var points = curve.getPoints(50);
      var geometry = new THREE.BufferGeometry().setFromPoints(points);

      var material = new THREE.LineBasicMaterial({ color: 0xFFD966});

      // Create the final object to add to the scene
      var ellipse = new THREE.Line(geometry, material);

      ellipse.position.set(0, y, 0);
      ellipse.rotation.set(Math.PI / 2, 0, 0);

      this.scene.add(ellipse);
    },
    Sphere() {
      for (var i = -15 / 32; i < 1 / 2; i += 1 / 32) {
        let Rx = Math.cos(3.14 * i) * 31;
        let Ry = Math.sin(3.14 * i) * 31;
        this.EllipseCurve(Rx, Ry);
      }
    },
    Pianokey() {
      var R = 30;
      var Length;
      var angle = 0;
      
      for (let j = -3; j < 4; j++) {
        R = 30 * Math.cos(((Math.PI * 1) / 32) * j);
        Length = (Math.PI * R) / 60;
        
        let y = (R / 35) * j;

        angle = -1;
        var Gradient=0;
        for (let i = 2; i > 2/3; i -= 1 / 54) {
          let x = R * Math.cos(Math.PI * angle);
          let z = R * Math.sin(Math.PI * angle);        
          
          this.TrackUI.push(
              this.addsquare(
              Length,
              x,
              y,
              z,
              0,
              i * Math.PI + (Math.PI * 3) / 2,
              0,
              1,
              Math.sin(Math.PI * Gradient)*0.8+0.1
            ))
          /*
          this.TrackUI[this.Tracknum].add(
            this.addsquare( Length, x, y, z, 0, i * Math.PI + (Math.PI * 3) / 2, 0, 1, Math.sin(Math.PI * Gradient)*0.8+0.1)
          );*/
          Gradient += 1 / 72;
          angle += 1 / 54;
          
        }
      }
      
      this.TrackUI.forEach(element => {
        if(element.type != 'Group')
          this.scene.add(element);
      });
      console.log(this.TrackUI);
      //this.scene.add(this.TrackUI[this.Tracknum]);
    },
    addTrack() {
      if (this.Tracknum < 3) {
        
        if(this.Tracknum!=0)
          this.TrackPositionY = 8;
        else
          this.Pianokey(); 
        
        this.Tracknum++;
      }
    },
    onWindowResize() {
      this.camera.aspect = window.innerWidth / window.innerHeight;
      this.camera.updateProjectionMatrix();

      this.renderer.setSize(window.innerWidth, window.innerHeight);
    },
    onDocumentMouseMove(event) {
      event.preventDefault();

      this.mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
      this.mouse.y = -(event.clientY / window.innerHeight) * 2 + 1 + 0.03;
    },
    setRenderer() {
      this.renderer = new THREE.WebGLRenderer({ antialias: true }); //antialias 平滑化
      this.renderer.setPixelRatio(window.devicePixelRatio);
      this.renderer.setSize(window.innerWidth, window.innerHeight);
      this.container.appendChild(this.renderer.domElement);
    },
    animate() {
      requestAnimationFrame(this.animate);
      this.fcrender();
      this.stats.update();
    },
    fcrender() {
      //this.group.rotation.y += (3 - this.group.rotation.y) * 0.05;

      this.raycaster.setFromCamera(this.mouse, this.camera);

      var intersects = this.raycaster.intersectObjects(this.scene.children);
      //intersects 是持續偵測的物體  INTERSECTED是將偵測到的物件儲存起來，且改變顏色
      if (intersects.length > 0) {
        //判斷現在有沒有取得到物件
        if (this.INTERSECTED != intersects[0].object) {
          
          //如果當前選擇的物體跟剛剛選擇的物體不一樣，則進行下一步
          if (this.INTERSECTED && this.INTERSECTED.position.z != -150)
            //如果剛剛有取得物件，那就先把剛剛取得的物件顏色先修改回來
            this.INTERSECTED.material.color.setHex(this.INTERSECTED.currentHex);
          this.INTERSECTED = intersects[0].object; //取得新的物件          
          this.INTERSECTED.currentHex = this.INTERSECTED.material.color.getHex();
          this.INTERSECTED.material.color.setHex(0xff0000);

        }
      } else {
        //如果當前沒有取得物件的話，那就把剛剛蒐集的物件的顏色改回去
        if (this.INTERSECTED) {
          this.INTERSECTED.material.color.setHex(this.INTERSECTED.currentHex);
        }

        this.INTERSECTED = null;
      }

      /*if (this.cameraPositionY > 0) {
        this.cameraPositionY--;
        this.camera.position.set(0, this.camera.position.y - 1, 0); //(x,y,z)
      }*/
      if (this.TrackPositionY>1){
        this.TrackPositionY--;
        
        this.TrackUI.forEach(element => {
          element.position.set(element.position.x, element.position.y + 1,element.position.z);
        });
      }else if(this.TrackPositionY ===1){
        this.Pianokey();
        this.TrackPositionY--;
      }
      

      this.renderer.render(this.scene, this.camera);
    }
  },
  mounted() {
    this.init();
    this.animate();
  }
};
</script>
<style>
body {
  margin: 0 !important;
  font-family: sans-serif;
}
#info {
  width: 100vw;
  height: 15vh;
  position: absolute;
  z-index: 1;
  margin-left: 25px;
}
</style>