<template>
  <div id="app"></div>
</template>
<script>
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { VRButton } from "three/examples/jsm/webxr/VRButton.js";
import { XRControllerModelFactory } from "three/examples/jsm/webxr/XRControllerModelFactory.js";

export default {
  data() {
    var container = document.createElement("div"); //用來裝一個div,而這個div連接到的是document.body
    var camera = new THREE.PerspectiveCamera(
      50,
      window.innerWidth / window.innerHeight,
      0.1,
      10
    );
    var scene = new THREE.Scene();
    var renderer = new THREE.WebGLRenderer({ antialias: true });
    var controller1 = renderer.xr.getController(0);
    var controller2 = renderer.xr.getController(1);
    var controllerGrip1, controllerGrip2;

    var raycaster,intersected = [];
    var tempMatrix = new THREE.Matrix4();

    var controls = new OrbitControls(camera, container);
    var group = new THREE.Group();
    return {
      container,
      camera,
      scene,
      renderer,
      controller1,
      controller2,
      controllerGrip1,
      controllerGrip2,
      raycaster,
      intersected,
      tempMatrix,
      controls,
      group
    };
  },
  methods: {
    init() {
      //container 的設置
      this.container = document.createElement("div");
      document.body.appendChild(this.container);

      //scene 的設置
      this.scene = new THREE.Scene();
      this.scene.background = new THREE.Color(0x808080);

      //camera 的設置
      this.camera = new THREE.PerspectiveCamera(
        50,
        window.innerWidth / window.innerHeight,
        0.1,
        10
      );
      this.camera.position.set(0, 1.6, 3); //位置

      //控制鏡頭的控制器
      this.controls = new OrbitControls(this.camera, this.container);
      this.controls.target.set(0, 1.6, 0); //方向的設置
      this.controls.update();

      //地板的幾何(geometry)、材質(material)、轉動、陰影
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

      //燈光的設置
      var light = new THREE.DirectionalLight(0xffd7a1);
      light.position.set(0, 6, 0);
      light.castShadow = true;
      light.shadow.camera.top = 2;
      light.shadow.camera.bottom = -2;
      light.shadow.camera.right = 2;
      light.shadow.camera.left = -2;
      light.shadow.mapSize.set(4096, 4096);
      this.scene.add(light);

      //Group 可以將物件群組化
      this.group = new THREE.Group();
      this.scene.add(this.group);

      //列出需要的物件形狀
      var geometries = [
        new THREE.BoxBufferGeometry(0.2, 0.2, 0.2),
        new THREE.ConeBufferGeometry(0.2, 0.2, 64),
        new THREE.CylinderBufferGeometry(0.2, 0.2, 0.2, 64),
        new THREE.IcosahedronBufferGeometry(0.2, 3),
        new THREE.TorusBufferGeometry(0.2, 0.04, 64, 32)
      ];

      //隨機生成50個物件
      for (var i = 0; i < 50; i++) {
        //隨機的去從geometries中取得想要的形狀和顏色
        var obgeometry =
          geometries[Math.floor(Math.random() * geometries.length)];
        var obmaterial = new THREE.MeshStandardMaterial({
          color: Math.random() * 0xffffff,
          roughness: 0.7,
          metalness: 0.0
        });

        var object = new THREE.Mesh(obgeometry, obmaterial);
        //隨機的放置和旋轉
        object.position.x = Math.random() * 4 - 2;
        object.position.y = Math.random() * 2;
        object.position.z = Math.random() * 4 - 2;

        object.rotation.x = Math.random() * 2 * Math.PI;
        object.rotation.y = Math.random() * 2 * Math.PI;
        object.rotation.z = Math.random() * 2 * Math.PI;
        //將 (x,y,z)x隨機的向量(Scalar)
        object.scale.setScalar(Math.random() + 0.5);

        object.castShadow = true;
        object.receiveShadow = true;

        this.group.add(object);
      }

      //渲染
      this.renderer = new THREE.WebGLRenderer({ antialias: true }); //antialias=>平滑化
      this.renderer.setPixelRatio(window.devicePixelRatio); //設置畫素比例
      this.renderer.setSize(window.innerWidth, window.innerHeight);
      this.renderer.outputEncoding = THREE.sRGBEncoding; //編碼方式的設定，預設值是THREE.LinearEncoding.
      this.renderer.shadowMap.enabled = true;
      this.renderer.xr.enabled = true;
      this.container.appendChild(this.renderer.domElement);

      //將按鈕加入renderer
      document.body.appendChild(VRButton.createButton(this.renderer));

      //this.controller1 = this.renderer.xr.getController(0);
      this.controller1.addEventListener("selectstart", this.onSelectStart); //當選擇時呼叫函式
      this.controller1.addEventListener("selectend", this.onSelectEnd);
      this.scene.add(this.controller1);

      //this.controller2 = this.renderer.xr.getController(1);
      this.controller2.addEventListener("selectstart", this.onSelectStart); //當選擇時呼叫函式
      this.controller2.addEventListener("selectend", this.onSelectEnd);
      this.scene.add(this.controller2);

      var controllerModelFactory = new XRControllerModelFactory();

      this.controllerGrip1 = this.renderer.xr.getControllerGrip(0);
      this.controllerGrip1.add(
        controllerModelFactory.createControllerModel(this.controllerGrip1)
      );
      this.scene.add(this.controllerGrip1);

      this.controllerGrip2 = this.renderer.xr.getControllerGrip(0);
      this.controllerGrip2.add(
        controllerModelFactory.createControllerModel(this.controllerGrip2)
      );
      this.scene.add(this.controllerGrip2);

      var geometryLine = new THREE.BufferGeometry().setFromPoints([
        new THREE.Vector3(0, 0, 0),
        new THREE.Vector3(0, 0, -1)
      ]);

      var line = new THREE.Line(geometryLine);
      line.name = "line";
      line.scale.z = 5;

      this.controller1.add(line.clone());
      this.controller2.add(line.clone());

      this.raycaster = new THREE.Raycaster(); //光線投射，用來給模型綁定事件

      window.addEventListener("resize", this.onWindowResize, false);
    },
    onWindowResize() {
      this.camera.aspect = window.innerWidth / window.innerHeight;
      this.camera.updateProjectionMatrix();

      this.renderer.setSize(window.innerWidth, window.innerHeight);
    },
    onSelectStart(event) {
      var controller = event.target;
      var intersections = this.getIntersections(controller);
      if (intersections.length > 0) {
        var intersection = intersections[0];
        var object = intersection.object;
        object = intersection.object;
        object.material.emissive.b = 1;
        controller.attach(object);
        controller.userData.selected = object;
      }
    },
    onSelectEnd(event) {
      var controller = event.target;

      if (controller.userData.selected !== undefined) {
        var object = controller.userData.selected;
        object.material.emissive.b = 0;
        this.group.attach(object);

        controller.userData.selected = undefined;
      }
    },
    getIntersections(controller) {
      this.tempMatrix.identity().extractRotation(controller.matrixWorld);

      this.raycaster.ray.origin.setFromMatrixPosition(controller.matrixWorld);
      this.raycaster.ray.direction.set(0, 0, -1).applyMatrix4(this.tempMatrix);

      return this.raycaster.intersectObjects(this.group.children);
    },
    intersectObjects(controller) {
      if (controller.userData.selected !== undefined) return;

      var line = controller.getObjectByName("line");
      var intersections = this.getIntersections(controller);

      if (intersections.length > 0) {
        var intersection = intersections[0];
        var object = intersection.object;
        object.material.emissive.r = 1;
        this.intersected.push(object);

        line.scale.z = intersection.distance;
      } else {
        line.scale.z = 5;
      }
    },
    cleanIntersected() {
      while (this.intersected.length) {
        var object = this.intersected.pop();
        object.material.emissive.r = 0;
      }
    },
    animate() {
      this.renderer.setAnimationLoop(this.render);
    },
    render() {
      this.cleanIntersected();

      this.intersectObjects(this.controller1);
      this.intersectObjects(this.controller2);
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