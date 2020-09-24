<template>
  <div id="app"></div>
</template>
<script>
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import Stats from "three/examples/jsm/libs/stats.module.js";
//import { NURBSCurve } from 'three/examples/jsm/curves/NURBSCurve.js';
//import { NURBSSurface } from "three/examples/jsm/curves/NURBSSurface.js";

export default {
  data() {
    var container, stats;
    var camera, scene, render;
    var group;
    var controls;

    //var extrudeSettings;
    return {
      container,
      stats,
      camera,
      scene,
      render,
      group,
      controls
      //extrudeSettings
    };
  },
  methods: {
    init() {
      this.container = document.createElement("div");
      document.body.appendChild(this.container);

      this.scene = new THREE.Scene();
      this.scene.background = new THREE.Color(0x000000);

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

      //this.addPlane();

      var light = new THREE.PointLight(0xffffff, 10);
      this.camera.add(light); //在從camera發出光源

      this.group = new THREE.Group();
      //this.group.position.y = 50;
      this.scene.add(this.group);

      this.extrudeSettings = {
        depth: 8,
        bevelEnabled: true,
        bevelSegments: 2,
        steps: 2,
        bevelSize: 1,
        bevelThickness: 1
      };
      this.Sphere();

      this.setRenderer();

      this.loadText();

      this.Pianokey();

      this.EllipseCurve();

      //this.nurbsCurve();

      this.stats = new Stats();
      this.container.appendChild(this.stats.dom);

      this.container.style.touchAction = "none";
      window.addEventListener("resize", this.onWindowResize, false);
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

      var material = new THREE.LineBasicMaterial({ color: 0xff0000 });

      // Create the final object to add to the scene
      var ellipse = new THREE.Line(geometry, material);

      ellipse.position.set(0, y, 0);
      ellipse.rotation.set(Math.PI / 2, 0, 0);

      this.scene.add(ellipse);
    },
    Sphere() {
      for (var i = -15 / 32; i < 1 / 2; i += 1 / 32) {
        let Rx = Math.cos(3.14 * i) * 300;
        let Ry = Math.sin(3.14 * i) * 100;
        this.EllipseCurve(Rx, Ry);
      }
    },
    Pianokey() {
      var R = 40;
      var Length = (3.14 * R) / 66;
      var angle = 0;
      for (let i = 2; i > 0; i -= 1 / 64) {
        let x = R * Math.cos(3.14 * angle);
        let z = R * Math.sin(3.14 * angle);
        //this.addsquare(Length,x,0,z, 0, i*3.14,0 ,1);
        //this.addsquare(Length,x,0,z, 0, i*3.14+3.14/2,0 ,1);
        //this.addsquare(Length,x,0,z, 0, i*3.14+3.14,0 ,1);
        this.addsquare(Length, x, 0, z, 0, i * 3.14 + (3.14 * 3) / 2, 0, 1);
        angle += 1 / 64;

        //console.log(parseInt(x),parseInt(z));
        //this.addsquare(Length,x,0,z, 0,-i*3.14,0 ,1)
      }
      //this.addsquare(Length,x,y,z,rx,ry,rz,s);
    },
    addsquare(Length, x, y, z, rx, ry, rz, s) {
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
        color: 0xffd966,
        transparent: true,
        opacity: 0.7,
        side: THREE.DoubleSide
      });
      var mesh = new THREE.Mesh(geometry, material);
      mesh.position.set(x, y, z);
      mesh.rotation.set(rx, ry, rz);
      mesh.scale.set(s, s, s);
      this.scene.add(mesh);
    },
    loadText() {
      let me = this;
      var loader = new THREE.FontLoader();
      loader.load("./Microsoft JhengHei_Regular.json", function(font) {
        var xMid, text;

        var color = 0x006699;

        var matDark = new THREE.LineBasicMaterial({
          color: color,
          side: THREE.DoubleSide
        });

        var matLite = new THREE.MeshBasicMaterial({
          //一種平面的物質 不理會light
          color: color,
          transparent: true,
          opacity: 0.4,
          side: THREE.DoubleSide
          //side
          //https://threejs.org/docs/#api/en/materials/MeshDepthMaterial
          //面的呈現─表面、內側或是雙面
        });

        var message = "   Three.js\nSimple text.";

        var shapes = font.generateShapes(message, 100); //font.generateShapes(文字內容, 文字大小(※預設為100))

        var geometry = new THREE.ShapeBufferGeometry(shapes);

        geometry.computeBoundingBox(); //讓geometry可以去計算

        xMid = -0.5 * (geometry.boundingBox.max.x - geometry.boundingBox.min.x);
        //geometry.boundingBox.max 和 geometry.boundingBox.min分別為最大最小值
        //xMid取得是中間值
        geometry.translate(xMid, 0, -500); //調整位置

        // make shape ( N.B. edge view not visible )

        text = new THREE.Mesh(geometry, matLite);
        text.position.z = -150;
        me.scene.add(text);

        // make line shape ( N.B. edge view remains visible )

        var holeShapes = [];

        for (let i = 0; i < shapes.length; i++) {
          let shape = shapes[i]; //把字串中的字體依序放入shape

          if (shape.holes && shape.holes.length > 0) {
            //如果這個圖案有洞 洞的尺寸大於一 則把這個洞找出來 以便等等的渲染
            for (let j = 0; j < shape.holes.length; j++) {
              var hole = shape.holes[j];
              holeShapes.push(hole);
            }
          }
        }

        shapes.push.apply(shapes, holeShapes);
        var lineText = new THREE.Object3D();

        for (let i = 0; i < shapes.length; i++) {
          let shape = shapes[i];

          var points = shape.getPoints();
          let geometry = new THREE.BufferGeometry().setFromPoints(points);

          geometry.translate(xMid, 0, -700);

          var lineMesh = new THREE.Line(geometry, matDark);
          lineText.add(lineMesh);
        }

        me.scene.add(lineText);
      }); //end load function
    },
    onWindowResize() {
      this.camera.aspect = window.innerWidth / window.innerHeight;
      this.camera.updateProjectionMatrix();

      this.renderer.setSize(window.innerWidth, window.innerHeight);
    },
    setRenderer() {
      this.renderer = new THREE.WebGLRenderer({ antialias: true });
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
      this.group.rotation.y += (3 - this.group.rotation.y) * 0.05;
      this.renderer.render(this.scene, this.camera);
    }
  },
  mounted() {
    this.init();
    this.animate();
  }
};
</script>
<style scoped>
</style>