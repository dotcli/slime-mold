const randomColor = require( 'randomcolor' );

global.THREE = require( 'three' );
const createOrbitViewer = require( 'three-orbit-viewer' )( THREE );

const SlimeMold = require('./lib/SlimeMold')

/* Scene */
const app = createOrbitViewer( {
  clearColor: 0x000000,
  clearAlpha: 1,
  fov: 50,
  position: new THREE.Vector3( 0, 0, 1 ), // camera
} );

const plane = new THREE.Mesh(
  new THREE.PlaneGeometry( 1, 1, 1, 1 ),
  new THREE.MeshBasicMaterial()
);
const wireframe = new THREE.LineSegments(
  new THREE.WireframeGeometry(
    new THREE.PlaneGeometry( 1, 1, 10, 10 )
  ),
  new THREE.LineBasicMaterial({ color: 0x000000 })
);

app.scene.add( plane );
app.scene.add( wireframe );

const raycaster = new THREE.Raycaster();
const mouse = new THREE.Vector2();
app.on( 'tick', function ( dt ) {
  //.. handle pre-render updates
  raycaster.setFromCamera( mouse, app.camera );
} );

window.addEventListener( 'click', germinate );
window.addEventListener( 'mousemove', updateMouse );

function germinate() {
  let intersects = raycaster.intersectObjects( app.scene.children );
  if (intersects.length === 0) return;
  for (var i = 0; i < intersects.length; i ++) {
    if (intersects[i].object.id === plane.id) {
      // NOTE so yeah this is how you add the thing
      // TODO spawn slimeMold
      let box = new THREE.Mesh(
        new THREE.BoxGeometry(1, 1, 1),
        new THREE.MeshNormalMaterial()
      )
      box.scale.multiplyScalar( 0.01 )
      box.position.copy( intersects[i].point )
      app.scene.add(box)
    }
  }
}

function updateMouse( e ) {
  mouse.x = ( e.clientX / window.innerWidth ) * 2 - 1;
  mouse.y = - ( e.clientY / window.innerHeight ) * 2 + 1;
}
