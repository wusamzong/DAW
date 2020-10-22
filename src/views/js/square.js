import * as THREE from 'three';
var square ={
  addsquare(Length, x, y, z, rx, ry, rz, s, opacity,Tracknum ,id) {
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
      color: 0xff3dff,
      transparent: true,
      opacity: opacity,
      side: THREE.DoubleSide
    });
    var mesh = new THREE.Mesh(geometry, material);
    mesh.position.set(x, y, z);
    mesh.rotation.set(rx, ry, rz);
    mesh.scale.set(s, s, s);
    mesh.index = [Tracknum, id]; //在mesh裡面插入Track和在這個Track的id
    return mesh;
    //this.scene.add(mesh);
  },
  Pianokey(TrackGroup,Tracknum,camera) {
    var R = 30;
    var Length;
    var angle = 0;
    var id = 0;
    var barNum = 72;

    TrackGroup[Tracknum] = new THREE.Group();
    
    
    for (let j = -3; j < 4; j++) {
      R = 30 * Math.cos(((Math.PI * 1) / 32) * j);
      Length = (Math.PI * R) / 60;
      let y = (R / 35) * j - Tracknum * 8;

      angle = -1;
      var Gradient = 0;
      for (let i = 2; i > 2 / 3; i -= 1 / 54) {
        let x = R * Math.cos(Math.PI * angle);
        let z = R * Math.sin(Math.PI * angle);
        TrackGroup[Tracknum].add(
          square.addsquare(
            Length,
            x,
            y,
            z,
            0,
            i * Math.PI + (Math.PI * 3) / 2,
            0,
            1,
            Math.sin(Math.PI * Gradient) * 0.8 + 0.1,
            Tracknum,
            id++
          )
        );
        Gradient += 1 / barNum;
        angle += 1 / 54;
      }
    }

    TrackGroup[Tracknum].cameraPosition = [
      camera.position.x,
      Tracknum * -8,
      camera.position.z,
    ];

    return TrackGroup[Tracknum];

    /*this.scene.add(this.TrackGroup[this.Tracknum]);
    //console.log(this.TrackGroup[this.Tracknum].cameraPosition);
    this.cameraVector = this.TrackGroup[this.Tracknum].cameraPosition;
    this.moveCameraAnimation(this.Tracknum); //把攝影機對像最新創建的音軌
    this.Tracknum++;*/
  },
}
export default square
