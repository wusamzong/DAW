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