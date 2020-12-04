import * as THREE from "three";
import SCENE from "@/views/js/scene";
import {Group} from "three";
var star = {
  stars: new Group(),
  createStars(){
    let vertices = [];
    
    for(let i=0;i<100;i++){
      let x = Math.random() *2000 -1000;
      let y = Math.random() *2000 -1000;
      let z = Math.random() *2000 -1000;
      vertices.push(x,y,z);
    }
    
    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute('position', new THREE.Float32BufferAttribute(vertices, 3))
    
    let parameters = [
      [[ 1.0, 0.2, 0.5 ], 20 ],
      [[ 0.95, 0.1, 0.5 ], 15 ],
      [[ 0.90, 0.05, 0.5 ], 10 ],
      [[ 0.85, 0, 0.5 ], 8 ],
      [[ 0.80, 0, 0.5 ], 5 ]
    ];

    for(let i=0; i<parameters.length; i++){
      const color = parameters[i][0];
      const size = parameters[i][1];
      let materials =[];
      materials[ i ] = new THREE.PointsMaterial( { size: size,map:null, blending: THREE.AdditiveBlending, depthTest: false, transparent: true } );
      materials[ i ].color.setHSL( color[ 0 ], color[ 1 ], color[ 2 ] );

      const particles = new THREE.Points( geometry, materials[ i ] );
      
      particles.rotation.x = Math.random() * 6;
      particles.rotation.y = Math.random() * 6;
      particles.rotation.z = Math.random() * 6;
      
      this.stars.add(particles);
      // SCENE.scene.add( particles );
    }
    SCENE.scene.add(this.stars)
  },
  // starRender(stars){
  //   const time = Date.now() * 0.00005;
  //   for(let i=0;i<stars.length;i++){
  //     stars[i].rotation.y = time * (i+0.05)*1.3
  //     //stars[i].rotation.z = time * (i+0.1)
  //   }
  // }

}
export default star

