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
    }, loadText() {
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