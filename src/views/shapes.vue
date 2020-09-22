<template>
  <div id="app"></div>
</template>
<script>
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import Stats from "three/examples/jsm/libs/stats.module.js";
//import { NURBSCurve } from 'three/examples/jsm/curves/NURBSCurve.js';
import { NURBSSurface } from 'three/examples/jsm/curves/NURBSSurface.js';

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

      //this.nurbsCurve();

      this.stats = new Stats();
      this.container.appendChild(this.stats.dom);

      this.container.style.touchAction = "none";
    },
    addPlane() {
      var geometry = new THREE.PlaneBufferGeometry(4, 4);
      var material = new THREE.MeshStandardMaterial({
        color: 0xeeeeee,
        roughness: 1.0,
        metalness: 0.0
      });
      var floor = new THREE.Mesh(geometry, material);
      floor.rotation.x = -Math.PI / 2;
      floor.receiveShadow = true;
      this.scene.add(floor);
    },
    addShape(shape, /* extrudeSettings,*/ color, x, y, z, rx, ry, rz, s) {
      var geometry = new THREE.ShapeBufferGeometry(shape);

      var mesh = new THREE.Mesh(
        geometry,
        new THREE.MeshPhongMaterial({ color: color, side: THREE.DoubleSide })
      );
      mesh.position.set(x, y, z);
      mesh.rotation.set(rx, ry, rz);
      mesh.scale.set(s, s, s);
      this.group.add(mesh);
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
    nurbsCurve() {
      // NURBS surface

      var nsControlPoints = [
        [
          new THREE.Vector4(-200, -200, 100, 1),
          new THREE.Vector4(-200, -100, -200, 1),
          new THREE.Vector4(-200, 100, 250, 1),
          new THREE.Vector4(-200, 200, -100, 1)
        ],
        [
          new THREE.Vector4(0, -200, 0, 1),
          new THREE.Vector4(0, -100, -100, 5),
          new THREE.Vector4(0, 100, 150, 5),
          new THREE.Vector4(0, 200, 0, 1)
        ],
        [
          new THREE.Vector4(200, -200, -100, 1),
          new THREE.Vector4(200, -100, 200, 1),
          new THREE.Vector4(200, 100, -250, 1),
          new THREE.Vector4(200, 200, 100, 1)
        ]
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
        
        side: THREE.DoubleSide
      });
      var object = new THREE.Mesh(geometry, material);
      object.position.set(700, 100, 0);
      object.scale.multiplyScalar(1);
      this.group.add(object);
    },
    loadText(){
      let me = this;
      var loader = new THREE.FontLoader();
				loader.load( './Microsoft JhengHei_Regular.json', function ( font ) {

					var xMid, text;

					var color = 0x006699;

					var matDark = new THREE.LineBasicMaterial( {
						color: color,
						side: THREE.DoubleSide
					} );
          
					var matLite = new THREE.MeshBasicMaterial( {   //一種平面的物質 不理會light
						color: color,
						transparent: true,
						opacity: 0.4,
            side: THREE.DoubleSide 
            //side
            //https://threejs.org/docs/#api/en/materials/MeshDepthMaterial 
            //面的呈現─表面、內側或是雙面
					} );

					var message = "   Three.js\nSimple text.";

					var shapes = font.generateShapes( message, 100 ); //font.generateShapes(文字內容, 文字大小(※預設為100))

					var geometry = new THREE.ShapeBufferGeometry( shapes );
          console.log(geometry);
					geometry.computeBoundingBox(); //讓geometry可以去計算
          
					xMid = - 0.5 * ( geometry.boundingBox.max.x - geometry.boundingBox.min.x );
          //geometry.boundingBox.max 和 geometry.boundingBox.min分別為最大最小值
          //xMid取得是中間值
          geometry.translate( xMid, 0, -500 );  //調整位置
          console.log(geometry);
          

					// make shape ( N.B. edge view not visible )

					text = new THREE.Mesh( geometry, matLite );
					text.position.z = - 150;
					me.scene.add( text );

					// make line shape ( N.B. edge view remains visible )
          
					var holeShapes = [];

					for ( let i = 0; i < shapes.length; i ++ ) {

						let shape = shapes[ i ];  //把字串中的字體依序放入shape

            if ( shape.holes && shape.holes.length > 0 ) {  
              //如果這個圖案有洞 洞的尺寸大於一 則把這個洞找出來 以便等等的渲染
							for ( let j = 0; j < shape.holes.length; j ++ ) {
								var hole = shape.holes[ j ];
								holeShapes.push( hole );
							}

						}

					}

					shapes.push.apply( shapes, holeShapes );
          console.log(shapes);
					var lineText = new THREE.Object3D();

					for ( let i = 0; i < shapes.length; i ++ ) {

						let shape = shapes[ i ];

						var points = shape.getPoints();
						let geometry = new THREE.BufferGeometry().setFromPoints( points );

						geometry.translate( xMid, 0, -700 );

						var lineMesh = new THREE.Line( geometry, matDark );
						lineText.add( lineMesh );

					}

					me.scene.add( lineText );
          
				} ); //end load function
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