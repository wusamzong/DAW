<template>
  <div id="app"></div>
</template>
<script>
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import Stats from "three/examples/jsm/libs/stats.module.js";
import STAR from "@/views/js/star";
export default {
  data() {
    var container, stats;
    var camera, scene, renderer;
    var controls, raycaster;
    var group;
    var mouse, INTERSECTED;
    var star
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
      star,
      INTERSECTED,
      isClick: false,
      triangleMap: new Map(),
      level: new Map(),
      lightData: new Array(), //可用來儲存燈亮與否
      
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
      this.star = STAR.createStars(this.scene);
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
      this.controls.rotateSpeed = 0.3;
      this.controls.zoomSpeed = 0.5
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
      document.addEventListener("mousemove", this.onDocumentMouseMove);
    },
    addTriangle(Length, x, y, z, rx, ry, rz, s, id) {
      var triangleShape = new THREE.Shape()
        .moveTo(0, Length)
        .lineTo((Length / 2) * Math.sqrt(3), -Length / 2)
        .lineTo((-Length / 2) * Math.sqrt(3), -Length / 2)
        .lineTo(0, Length);
      var geometry = new THREE.ShapeBufferGeometry(triangleShape);
      var material = new THREE.MeshBasicMaterial({
        color: 0xff3dff,
        side: THREE.DoubleSide
      });
      var mesh = new THREE.Mesh(geometry, material);
      mesh.position.set(x, y, z);
      mesh.rotation.set(rx, ry, rz);
      mesh.scale.set(s, s, s);
      this.triangleMap.set(mesh.id, id);
      return mesh;
    },
    buildPlayGround(level) {
      //this.addTriangle(Length,x,y,z,rx,ry,rz,1)
      //let playGround = new Array();
      let pORn;
      var xP,
        temp = 0,
        id = 0;
      this.group = new THREE.Group();
      for (let i = 0; i < level; i++) {
        pORn = true;
        if (i > 1 && i % 2 === 0) {
          temp -= 3;
        }
        xP = temp + Math.ceil(i / 2) * -3;
        this.level.set(i + 1, id);
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
              this.addTriangle(3, xP + j * 3, -i * 5, -50, 0, 0, 0, 1, id++)
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
                1,
                id++
              )
            );
          this.lightData.push(false);
          pORn = !pORn;
        }
      }
      /*playGround.forEach(element => {
        this.scene.add(element);
      });*/
      this.scene.add(this.group);
    },

    onDocumentMouseMove(event) {
      this.controls.enabled = true;
      event.preventDefault();
      this.mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
      this.mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
      
    },
    onDocumentMouseUp(event) {
      event.preventDefault();
      this.isClick = true;
    },
    render() {
      this.renderer.render(this.scene, this.camera);
      this.catchObject();
      
      
    },
    catchObject() {
      this.raycaster.setFromCamera(this.mouse, this.camera);
      var intersects = this.raycaster.intersectObjects(
        this.group.children,
        true
      );
      if (intersects.length > 0) {  //有碰到group的東西
        if (intersects != this.INTERSECTED) {
          if (intersects[0].object.parent === this.group) {
            if (this.INTERSECTED)
              this.INTERSECTED.material.color.setHex(
                this.INTERSECTED.currentHex
              );
            this.INTERSECTED = intersects[0].object;
            this.INTERSECTED.currentHex = this.INTERSECTED.material.color.getHex();
            this.INTERSECTED.material.color.setHex(0xff377e);
            this.eventListenerControl(false);   //監聽是否要讓Orbit controller 作用
            this.onClick(this.INTERSECTED);
          }
        }
      } else {
        if (this.INTERSECTED) {
          this.INTERSECTED.material.color.setHex(this.INTERSECTED.currentHex);
        }        
        this.eventListenerControl(true);
        this.INTERSECTED = null;
      }

    },
    eventListenerControl(boolean){
      if(boolean){        
        this.controls.enabled=true;
        
      }else{
        this.controls.saveState();
        this.controls.enabled=false;
        document.addEventListener('mouseup',this.onDocumentMouseUp);
        this.controls.reset();
      }
    },
    onClick(OB) {
      if (this.isClick === true) {
        var active = new Array();
        var culId = this.triangleMap.get(OB.id);
        var level, levelNum; //第n層 , 第n層的第m個
        var pORn;
        //console.log(culId);  //0,1,2,3....
        
        for (var [key, value] of this.level.entries()) {
          if (culId >= value) {
            level = key; //找到是在第n層
            levelNum = culId - value + 1; //找到是在第 n 層的第 m 個
            if (levelNum % 2 === 0)
              //如果是偶數代表反面
              pORn = false;
            //如果是積數代表是正面
            else pORn = true;
          }
        }
        if (pORn) {//正面時
          if(culId + level * 2 < this.group.children.length)
            active.push(culId + level * 2);
        } else {
          active.push(culId - (level - 1) * 2);
        }

        if (culId !== 0) {
          if (levelNum === 1) {
            active.push(culId + 1);
          } else if (culId + 1 === this.level.get(level + 1)  || culId === this.group.children.length-1) {//culId從0開始 所以要先+1  
            //console.log('here?');         
            active.push(culId - 1);
          } else {
            active.push(culId - 1, culId + 1);
          }
        }

        active.forEach(element => {          
          let color = this.group.children[element].material.color.getHex();
          this.lightData[element] = !this.lightData[element];
          if (color === 0xffd966) {
            this.group.children[element].material.color.setHex(0xff3dff);
          } else {
            this.group.children[element].material.color.setHex(0xffd966);
          }
        });
      }
      this.isClick = false;
      
    },
    animate() {
      requestAnimationFrame(this.animate);
      this.render();
      this.stats.update();
      STAR.starRender(this.star.children);
    }
  },
  mounted() {
    this.init();
    this.animate();
  }
};
</script>