import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/Addons.js';
import { gsap } from 'gsap';
import { EffectComposer } from 'three/addons/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/addons/postprocessing/RenderPass.js';
import { UnrealBloomPass } from 'three/addons/postprocessing/UnrealBloomPass.js';
import { OutputPass } from 'three/addons/postprocessing/OutputPass.js';
import { ShaderPass } from 'three/examples/jsm/Addons.js';
import { FXAAShader } from 'three/examples/jsm/Addons.js';

import { FlyControls } from 'three/addons/controls/FlyControls.js';

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

    car.castShadow = true; //default is false
    car.receiveShadow = false;


    gltf.scene.traverse(function (child) {
      if (child.isMesh) {
        child.castShadow = true;
      }
    });
    console.log(car.children[0].children[0].children[0]);
    scene.add(car);

  },
  function (xhr) { },
  function (error) { }
)

const geometry = new THREE.PlaneGeometry(1000, 1000);
const material = new THREE.MeshPhongMaterial({ color: 0xf0f0f0, depthWrite: false });
const plane = new THREE.Mesh(geometry, material);
plane.receiveShadow = true;
plane.position.set(-3, -0.9, 0);
plane.rotation.set(-Math.PI / 2, 0, 0)
scene.add(plane);


const ambientLight = new THREE.AmbientLight(0xaaaaaa, 1);
// ambientLight.castShadow = true;
scene.add(ambientLight);

const topLight = new THREE.DirectionalLight(0xffffff, 1);
topLight.position.set(5, 5, 7.5);
topLight.castShadow = true;
topLight.shadow.radius=10;
topLight.shadow.intensity = 2;
scene.add(topLight);

const topLight2 = new THREE.DirectionalLight(0xffffff, 1);
topLight2.position.set(-5, 5, 7.5);
topLight2.castShadow = true;
topLight2.shadow.radius=10;
topLight2.shadow.intensity = 2;
scene.add(topLight2);



const topLight3 = new THREE.DirectionalLight(0xffffff, 1);
topLight3.position.set(0, 5, -7.5);
topLight3.castShadow = true;
topLight3.shadow.radius=10;
topLight3.shadow.intensity = 2;
scene.add(topLight3);

const topLight4 = new THREE.DirectionalLight(0xffffff, 1);
topLight4.position.set(0, 5, 7.5);
topLight4.castShadow = true;
topLight4.shadow.radius=10;
topLight4.shadow.intensity = 2;
scene.add(topLight4);


topLight.shadow.mapSize.width = 512*10; // default
topLight.shadow.mapSize.height = 512*10; // default
topLight.shadow.camera.near = 0.5; // default
topLight.shadow.camera.far = 500; // default
topLight.shadow.camera.top = 100;
topLight.shadow.camera.right = 100;
topLight.shadow.camera.bottom = -100;
topLight.shadow.camera.left = -100;

topLight2.shadow.mapSize.width = 512*10; // default
topLight2.shadow.mapSize.height = 512*10; // default
topLight2.shadow.camera.near = 0.5; // default
topLight2.shadow.camera.far = 500; // default
topLight2.shadow.camera.top = 100;
topLight2.shadow.camera.right = 100;
topLight2.shadow.camera.bottom = -100;
topLight2.shadow.camera.left = -100;

topLight3.shadow.mapSize.width = 512*10; // default
topLight3.shadow.mapSize.height = 512*10; // default
topLight3.shadow.camera.near = 0.5; // default
topLight3.shadow.camera.far = 500; // default
topLight3.shadow.camera.top = 100;
topLight3.shadow.camera.right = 100;
topLight3.shadow.camera.bottom = -100;
topLight3.shadow.camera.left = -100;

topLight4.shadow.mapSize.width = 512*10; // default
topLight4.shadow.mapSize.height = 512*10; // default
topLight4.shadow.camera.near = 0.5; // default
topLight4.shadow.camera.far = 500; // default
topLight4.shadow.camera.top = 100;
topLight4.shadow.camera.right = 100;
topLight4.shadow.camera.bottom = -100;
topLight4.shadow.camera.left = -100;


//Create a helper for the shadow camera (optional)
const helper = new THREE.CameraHelper(topLight.shadow.camera);
scene.add(helper);

const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight)
document.getElementById('container3D')?.append(renderer.domElement);

renderer.setClearColor(0x000000,0);
scene.background = new THREE.Color(0xdadada);

renderer.shadowMap.enabled = true;

renderer.shadowMap.type = THREE.PCFShadowMap;


renderer.setClearColor(0x7CEEB, 1)
const composer = new EffectComposer(renderer);

const renderPass = new RenderPass(scene, camera);
composer.addPass(renderPass);

const bloomPass = new UnrealBloomPass(new THREE.Vector2(1024,1024),0.1,0,0.8);

composer.addPass(bloomPass);


const fxaaPass = new ShaderPass( FXAAShader );
// composer.addPass(fxaaPass);
const outputPass = new OutputPass();
composer.addPass(outputPass);

composer.renderTarget1.samples = 8;
composer.renderTarget2.samples = 8;


let controls
controls = new FlyControls(camera, renderer.domElement);

controls.movementSpeed = 1000;
controls.domElement = renderer.domElement;
controls.rollSpeed = Math.PI / 24;
controls.autoForward = false;
controls.dragToLook = false;

let clock = new THREE.Clock;

const rerender3D = () => {
  requestAnimationFrame(rerender3D);

  const delta = clock.getDelta();

  controls.update(delta);
  // renderer.render(scene, camera);
  composer.render();
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
    position: { x: 12, y: 0, z: -8 },
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

