import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/Addons.js';
import { gsap } from 'gsap';

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
    car.position.set(-2, -1, -5);
    car.rotation.set(0.1, -0.5, 0);
    scene.add(car);

  },
  function (xhr) { },
  function (error) { }
)


const ambientLight = new THREE.AmbientLight(0xffffff, 1.3);
scene.add(ambientLight);

const topLight = new THREE.DirectionalLight(0xffffff, 5);
topLight.position.set(500, 500, 500);
scene.add(topLight);

const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight)
document.getElementById('container3D')?.append(renderer.domElement);

const rerender3D = () => {
  requestAnimationFrame(rerender3D);
  renderer.render(scene, camera);
}

rerender3D()

let arrPositionModel = [
  {
    id: 'features',
    position: { x: 0, y: 0, z: 0 },
    rotation: { x: 0, y: 0, z: 0 }

  }
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
    gsap.to(car.position, {
      x: new_coordinates.position.x,
      y: new_coordinates.position.y,
      z: new_coordinates.position.z,
      duration: 3,
      ease: "power1.out"
    })

    gsap.to(car.rotation, {
      x: new_coordinates.rotation.x,
      y: new_coordinates.rotation.y,
      z: new_coordinates.rotation.z,
      duration: 3,
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
  pivot.rotation.x = -mouse_y * 0.1;
  pivot.rotation.y = mouse_x * 0.1;
})

