import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/Addons.js';

const camera = new THREE.PerspectiveCamera(
  10,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
)

camera.position.z = 13;

const scene = new THREE.Scene()
let car;
const loader = new GLTFLoader();
loader.load('/model.glb',
  function (gltf) {
    car = gltf.scene;
    console.log(car)
    scene.add(car)
    camera.lookAt(car.position)
  },
  function (xhr) {},
  function (error) {}
)


const renderer = new THREE.WebGLRenderer({alpha:true});
renderer.setSize(window.innerWidth,window.innerHeight)
document.getElementById('container3D')?.append(renderer.domElement);

const rerender3D = () =>{
  requestAnimationFrame(rerender3D);
  renderer.render(scene,camera)
}
rerender3D