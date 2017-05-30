global.THREE = require( 'three' );
const TWEEN = require('tween.js');
const createOrbitViewer = require( 'three-orbit-viewer' )( THREE );

import SlimeMold from './lib/SlimeMold'

/* Scene */
const app = createOrbitViewer( {
  clearColor: 0x000000,
  clearAlpha: 1,
  fov: 1,
  position: new THREE.Vector3( 0, 0, 20 ), // camera
} );

const plane = new THREE.Mesh(
  new THREE.PlaneGeometry( 1, 1, 1, 1 ),
  new THREE.MeshBasicMaterial({ color: 0x000000 })
);
plane.material.transparent = true
plane.material.opacity = 0
app.scene.add( plane );

// const wireframe = new THREE.LineSegments(
//   new THREE.WireframeGeometry(
//     new THREE.PlaneGeometry( 1, 1, 10, 10 )
//   ),
//   new THREE.LineBasicMaterial({ color: 0x000000 })
// );
// app.scene.add( wireframe );

const raycaster = new THREE.Raycaster();
const mouse = new THREE.Vector2();

const molds = []

window.addEventListener( 'click', germinateOnRaycast );
window.addEventListener( 'mousemove', updateMouse );

window.addEventListener( 'keypress', (e)=>{
  if (e.key === ' ') {
    const start = app.camera.position.z > 0 ? 0 : Math.PI
    const end = start + Math.PI;
    let tween = new TWEEN.Tween({ angle: start })
      .to({ angle: end }, 4000)
      .easing(TWEEN.Easing.Quartic.InOut)
      .onUpdate(function () {
        console.log(this.angle);
        app.camera.position.set(Math.sin(this.angle) * 20, 0, Math.cos(this.angle) * 20)
        app.camera.lookAt(new THREE.Vector3())
      })
    tween.start()
  }
} )

function germinateOnRaycast() {
  let intersects = raycaster.intersectObject( plane );
  if (intersects.length === 0) return;
  germinate( intersects[0].point )
}

function germinate(point) {
  // NOTE so yeah this is where you add the thing
  // TODO spawn slime mold
  let sm = new SlimeMold()
  sm.position.copy( point )
  molds.push(sm)
  app.scene.add(sm)
}

function updateMouse( e ) {
  mouse.x = ( e.clientX / window.innerWidth ) * 2 - 1;
  mouse.y = - ( e.clientY / window.innerHeight ) * 2 + 1;
}

app.on( 'tick', function ( dt ) {
  //.. handle pre-render updates
  raycaster.setFromCamera( mouse, app.camera );
  molds.forEach((sm) => {
    sm.grow(dt)
  })
  TWEEN.update();
} );
