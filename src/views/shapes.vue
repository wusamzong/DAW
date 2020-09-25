<template>
  <div id="app"></div>
</template>
<script>
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import Stats from "three/examples/jsm/libs/stats.module.js";
//import { NURBSCurve } from 'three/examples/jsm/curves/NURBSCurve.js';
import { NURBSSurface } from "three/examples/jsm/curves/NURBSSurface.js";

export default {
  data() {
    var container, stats;
    var camera, scene, raycaster, render;
    var group;
    var controls;
    var mouse, INTERSECTED;
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

      this.raycaster = new THREE.Raycaster();

      this.mouse = new THREE.Vector2();

      this.extrudeSettings = {
        depth: 8,
        bevelEnabled: true,
        bevelSegments: 2,
        steps: 2,
        bevelSize: 1,
        bevelThickness: 1,
      };
      this.Sphere();

      this.setRenderer();

      this.loadText();

      this.Pianokey();

      //this.nurbsCurve();

      this.stats = new Stats();
      this.container.appendChild(this.stats.dom);

      this.container.style.touchAction = "none";
      document.addEventListener("mousemove", this.onDocumentMouseMove, false);
    },
    addPlane() {
      var geometry = new THREE.PlaneBufferGeometry(4, 4);
      var material = new THREE.MeshStandardMaterial({
        color: 0xeeeeee,
        roughness: 1.0,
        metalness: 0.0,
      });
      var floor = new THREE.Mesh(geometry, material);
      floor.rotation.x = -Math.PI / 2;
      floor.receiveShadow = true;
      this.scene.add(floor);
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
        side: THREE.DoubleSide,
      });
      var mesh = new THREE.Mesh(geometry, material);
      mesh.position.set(x, y, z);
      mesh.rotation.set(rx, ry, rz);
      mesh.scale.set(s, s, s);
      this.scene.add(mesh);
    },
    addLineShape(shape, color, x, y, z, rx, ry, rz, s) {
      shape.autoClose = true;
      var points = shape.getPoints();
      //var spacedPoints = shape.getSpacedPoints( 50 );

      var geometryPoints = new THREE.BufferGeometry().setFromPoints(points);
      //var geometrySpacedPoints = new THREE.BufferGeometry().setFromPoints( spacedPoints );

      var line = new THREE.Line(
        geometryPoints,
        new THREE.LineBasicMaterial({ color: color })
      );
      line.position.set(x, y, z);
      line.rotation.set(rx, ry, rz);
      line.scale.set(s, s, s);
      this.group.add(line);
    },
    Circle(R) {
      var circleRadius = R;
      var circleShape = new THREE.Shape()
        .moveTo(0, circleRadius)
        .quadraticCurveTo(circleRadius, circleRadius, circleRadius, 0)
        .quadraticCurveTo(circleRadius, -circleRadius, 0, -circleRadius)
        .quadraticCurveTo(-circleRadius, -circleRadius, -circleRadius, 0)
        .quadraticCurveTo(-circleRadius, circleRadius, 0, circleRadius);
      return circleShape;
    },

    Sphere() {
      for (var i = -15 / 32; i < 1 / 2; i += 1 / 32) {
        let Rx = Math.cos(3.14 * i) * 300;
        let Ry = Math.sin(3.14 * i) * 100;
        this.addLineShape(
          this.Circle(Rx),
          0x00f000,
          0,
          Ry,
          0,
          -Math.PI / 2,
          0,
          0,
          1
        );
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
    nurbsCurve() {
      // NURBS surface

      var nsControlPoints = [
        [
          new THREE.Vector4(-200, -200, 100, 1),
          new THREE.Vector4(-200, -100, -200, 1),
          new THREE.Vector4(-200, 100, 250, 1),
          new THREE.Vector4(-200, 200, -100, 1),
        ],
        [
          new THREE.Vector4(0, -200, 0, 1),
          new THREE.Vector4(0, -100, -100, 5),
          new THREE.Vector4(0, 100, 150, 5),
          new THREE.Vector4(0, 200, 0, 1),
        ],
        [
          new THREE.Vector4(200, -200, -100, 1),
          new THREE.Vector4(200, -100, 200, 1),
          new THREE.Vector4(200, 100, -250, 1),
          new THREE.Vector4(200, 200, 100, 1),
        ],
      ];
      var degree1 = 2;
      var degree2 = 3;
      var knots1 = [0, 0, 0, 1, 1, 1];
      var knots2 = [0, 0, 0, 0, 1, 1, 1, 1];
      var nurbsSurface = new NURBSSurface(
        degree1,
        degree2,
        knots1,
        knots2,
        nsControlPoints
      );
      /*
      var map = new THREE.TextureLoader().load("https://github.com/mrdoob/three.js/tree/dev/examples/textures/uv_grid_opengl.jpg");
      map.wrapS = map.wrapT = THREE.RepeatWrapping;
      map.anisotropy = 16;
      */
      function getSurfacePoint(u, v, target) {
        return nurbsSurface.getPoint(u, v, target);
      }

      var geometry = new THREE.ParametricBufferGeometry(
        getSurfacePoint,
        20,
        20
      );
      var material = new THREE.MeshLambertMaterial({
        side: THREE.DoubleSide,
      });
      var object = new THREE.Mesh(geometry, material);
      object.position.set(700, 100, 0);
      object.scale.multiplyScalar(1);
      this.group.add(object);
    },
    loadText() {
      let me = this;
      var loader = new THREE.FontLoader();
      loader.load("./Microsoft JhengHei_Regular.json", function (font) {
        var xMid, text;

        var color = 0x006699;

        var matDark = new THREE.LineBasicMaterial({
          color: color,
          side: THREE.DoubleSide,
        });

        var matLite = new THREE.MeshBasicMaterial({
          //一種平面的物質 不理會light
          color: color,
          transparent: true,
          opacity: 0.4,
          side: THREE.DoubleSide,
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
    onDocumentMouseMove(event) {
      event.preventDefault();

      this.mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
      this.mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
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
      this.group.rotation.y += (3 - this.group.rotation.y) * 0.05;

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
          if (this.INTERSECTED.position.z != -150) {
            this.INTERSECTED.currentHex = this.INTERSECTED.material.color.getHex();
            this.INTERSECTED.material.color.setHex(0xff0000);
            this.INTERSECTED.material.transparent = true;
            this.INTERSECTED.material.opacity = 0.7;
          }
        }
      } else {
        //如果當前沒有取得物件的話，那就把剛剛蒐集的物件的顏色改回去
        if (this.INTERSECTED) {
          this.INTERSECTED.material.color.setHex(this.INTERSECTED.currentHex);
        }

        this.INTERSECTED = null;
      }

      this.renderer.render(this.scene, this.camera);
    },
  },
  mounted() {
    this.init();
    this.animate();
  },
};
</script>
<style scoped>
</style>