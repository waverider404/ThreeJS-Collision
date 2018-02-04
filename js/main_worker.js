
var SCREEN_WIDTH = 650, SCREEN_HEIGHT = 480;
var VIEW_ANGLE = 45, ASPECT = SCREEN_WIDTH / SCREEN_HEIGHT, NEAR = 0.1, FAR = 20000;
var scene=new THREE.Scene();
var camera = new THREE.PerspectiveCamera( VIEW_ANGLE, ASPECT, NEAR, FAR);

scene.add(camera);
camera.lookAt(scene.position);

// RENDERER
var renderer = new THREE.WebGLRenderer( {antialias:true} );
renderer.setSize(SCREEN_WIDTH, SCREEN_HEIGHT);
container = document.getElementById('canvas');
container.appendChild( renderer.domElement );

var pointerGeometry = new THREE.CubeGeometry(100, 100, 1);
var pointerMaterial = new THREE.MeshBasicMaterial( { color: 0x9999ff, side: THREE.BackSide } );
var pointer = new THREE.Mesh( pointerGeometry, pointerMaterial );
pointer.position.set(300,200,-700);
scene.add(pointer);


var elementMovedGeometry = new THREE.CubeGeometry(100, 100, 1);
var elementMovedMaterial = new THREE.MeshBasicMaterial( { color: 0x3588ff, side: THREE.BackSide } );
var elementMoved = new THREE.Mesh( elementMovedGeometry, elementMovedMaterial );
elementMoved.position.set(0,0,-700);
scene.add(elementMoved);

var collidingTest=[];
var animate_frame;
function animate(){
  animate_frame=requestAnimationFrame( animate );
  elementMoved.geometry.verticesNeedUpdate=true;
  move();
  render();
}

function render(){
  renderer.render( scene, camera );
}

function move(){
  elementMoved.position.x+=1;
  elementMoved.position.y+=1;
  checkIntersect();
}
var ray;
var worker=new Worker("/js/worker.js")
worker.onmessage=function(e){
  if(e.data=="1"){
    cancelAnimationFrame(animate_frame);
  }
}
function checkIntersect(){
  collidingTest=[pointer.toJSON()];
  worker.postMessage({element:elementMoved.toJSON(),
    element_moved_matrix:elementMoved.matrix.elements,
    element_moved_position:elementMoved.position,
    colliding_arr:collidingTest,
    colliding_matrix_array:[pointer.matrix.elements],
  });
}
animate();