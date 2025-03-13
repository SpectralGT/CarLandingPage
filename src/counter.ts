import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/Addons.js';
import { gsap } from 'gsap';
import { EffectComposer } from 'three/addons/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/addons/postprocessing/RenderPass.js';
import { BloomPass } from 'three/addons/postprocessing/BloomPass.js';
import { OutputPass } from 'three/addons/postprocessing/OutputPass.js';

const camera = new THREE.PerspectiveCamera(
  10,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
)

camera.position.z = 13;

const scene = new THREE.Scene()

const pivot = new THREE.Group();
scene.add(pivot)
pivot.add(camera)
pivot.position.set(0, 0, 0)
let car;
const loader = new GLTFLoader();
loader.load('/model.glb',
  function (gltf) {
    car = gltf.scene;
    console.log(car.animations);

    car.position.set(-2, -1, -7);
    car.rotation.set(0, 0, 0);
    modelMove();
    scene.add(car);

  },
  function (xhr) { },
  function (error) { }
)

const geometry = new THREE.PlaneGeometry( 1000, 1000 );
const material = new THREE.MeshBasicMaterial( {color: 0xebebeb, side: THREE.DoubleSide} );
const plane = new THREE.Mesh( geometry, material );
// scene.add( plane );
plane.position.set(-3,-2,0);
plane.rotation.set(1.6,0,0)


const ambientLight = new THREE.AmbientLight(0xffffff, 2);
scene.add(ambientLight);

const topLight = new THREE.DirectionalLight(0xffffff, 10);
topLight.position.set(500, 500, 500);
scene.add(topLight);

const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight)
document.getElementById('container3D')?.append(renderer.domElement);
// renderer.setClearColor(0x7CEEB, 1)
//const composer = new EffectComposer(renderer);

//const renderPass = new RenderPass(scene, camera);
//composer.addPass(renderPass);

//const bloomPass = new BloomPass(5, 0.1);

//composer.addPass(bloomPass);

//const outputPass = new OutputPass();
//composer.addPass(outputPass);

const rerender3D = () => {
  requestAnimationFrame(rerender3D);

  renderer.render(scene, camera);
}

rerender3D()

let arrPositionModel = [
  {
    id: 'hero-section',
    position: { x: 2, y: 1, z: 5 },
    rotation: { x: -0.1, y: 0.2, z: 0 }

  },
  {
    id: 'features',
    position: { x: 12, y: 0, z:-8 },
    rotation: { x: 0, y: 1.5, z: 0 }

  }, {
    id: 'specs',
    position: { x: 2, y: 1, z: -20 },
    rotation: { x: 0.1, y: 3, z: 0 }

  }, {
    id: 'call-to-action',
    position: { x: -2, y: 0, z: 10 },
    rotation: { x: 0, y: 0, z: 0 }

  },
]


const modelMove = () => {
  const sections = document.querySelectorAll('section');
  let currentSection;
  sections.forEach((section) => {
    const rect = section.getBoundingClientRect();
    if (rect.top <= window.innerHeight / 3) {
      currentSection = section.className;
    }
  })

  let position_active = arrPositionModel.findIndex((val) => val.id == currentSection)

  if (position_active >= 0) {

    let new_coordinates = arrPositionModel[position_active];
    gsap.to(camera.rotation, {
      x: new_coordinates.rotation.x,
      y: new_coordinates.rotation.y,
      z: new_coordinates.rotation.z,
      duration: 1,
      ease: "power1.out"
    })
    gsap.to(camera.position, {
      x: new_coordinates.position.x,
      y: new_coordinates.position.y,
      z: new_coordinates.position.z,
      duration: 1,
      ease: "power1.out"
    })

  }
}

window.addEventListener('scroll', () => {
  console.log("scrolling")
  if (car) {
    modelMove();
  }
})

window.addEventListener('resize', () => {
  renderer.setSize(window.innerWidth, window.innerHeight);
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
})

window.addEventListener('mousemove', (event) => {
  let mouse_x = (event.clientX / window.innerWidth) * 2 - 1;
  let mouse_y = -(event.clientY / window.innerHeight) * 2 + 1;
  // pivot.rotation.x = -mouse_y * 0.1;
  // pivot.rotation.y = mouse_x * 0.1;
})

