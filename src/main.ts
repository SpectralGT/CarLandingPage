import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/Addons.js';
import { gsap } from 'gsap';
import { EffectComposer } from 'three/addons/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/addons/postprocessing/RenderPass.js';
import { UnrealBloomPass } from 'three/addons/postprocessing/UnrealBloomPass.js';
import { OutputPass } from 'three/addons/postprocessing/OutputPass.js';
import { ShaderPass } from 'three/examples/jsm/Addons.js';
// import { FXAAShader } from 'three/examples/jsm/Addons.js';
import { VignetteShader } from 'three/examples/jsm/Addons.js';
import { FlyControls } from 'three/addons/controls/FlyControls.js';

// Constants for window dimensions
const WINDOW_WIDTH = window.innerWidth;
const WINDOW_HEIGHT = window.innerHeight;


// Mouse movement variables
let mouseX: number = 0;
let mouseY: number = 0;

// Scene setup
const scene: THREE.Scene = new THREE.Scene();
scene.fog = new THREE.Fog(0xff3030, 10, 100);


//Camera setup
const camera: THREE.PerspectiveCamera = new THREE.PerspectiveCamera(10, WINDOW_WIDTH / WINDOW_HEIGHT, 0.1, 1000);
camera.position.z = 13;

//Renderer setup
const renderer: THREE.WebGLRenderer = new THREE.WebGLRenderer({ antialias: true });

//Pivot for Camera to Move Around
const pivot: THREE.Group = new THREE.Group();
scene.add(pivot);
pivot.add(camera);
pivot.position.set(0, 0, 0);

//Initialising Everything
function init(): void {
  renderer.setSize(WINDOW_WIDTH, WINDOW_HEIGHT);
  document.getElementById('container3D')?.append(renderer.domElement);
  scene.background = new THREE.Color(0xff3030);
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFShadowMap;

  loadModel();
  setupLighting();
  setupGround();
  setupEventListeners();
}

//Loading Car Model
function loadModel(): void {
  const loader: GLTFLoader = new GLTFLoader();
  loader.load('/model.glb', (gltf: any) => {
    const car = gltf.scene;
    car.position.set(-2, -1, -7);
    car.castShadow = true;
    car.receiveShadow = false;

    gltf.scene.traverse((child: any) => {
      if (child.isMesh) {
        child.castShadow = true;
      }
    });
    scene.add(car);
  });
}

//Light setup
function setupLighting(): void {
  const createLight = (x: number, y: number, z: number): THREE.DirectionalLight => {
    const light = new THREE.DirectionalLight(0xffffff, 1);
    light.position.set(x, y, z);
    light.castShadow = true;
    return light;
  };
  scene.add(new THREE.AmbientLight(0xaaaaaa, 1));
  scene.add(createLight(5, 5, 7.5));
  scene.add(createLight(-5, 5, 7.5));
  scene.add(createLight(0, 5, -7.5));
  scene.add(createLight(0, 5, 7.5));
}

//Ground plane setup
function setupGround(): void {
  const plane: THREE.Mesh = new THREE.Mesh(
    new THREE.PlaneGeometry(1000, 1000),
    new THREE.MeshPhongMaterial({ color: 0xff0000, depthWrite: false })
  );
  plane.receiveShadow = true;
  plane.position.set(-3, -0.9, 0);
  plane.rotation.set(-Math.PI / 2, 0, 0);
  scene.add(plane);
}

//Adding Post Processing
function postProcessing(): void {
  const composer: EffectComposer = new EffectComposer(renderer);
  composer.addPass(new RenderPass(scene, camera));
  composer.addPass(new UnrealBloomPass(new THREE.Vector2(1024, 1024), 0.1, 0, 0.8));
  composer.addPass(new ShaderPass(VignetteShader));
  composer.addPass(new OutputPass());
  composer.renderTarget1.samples = 8;
  composer.renderTarget2.samples = 8;
  renderLoop(composer);
}

//EventListener setup
function setupEventListeners(): void {

  window.addEventListener('scroll', modelMove);

  window.addEventListener('resize', () => {
    renderer.setSize(window.innerWidth, window.innerHeight);
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
  });

  window.addEventListener('mousemove', (event) => {
    mouseX = (event.clientX / window.innerWidth) * 2 - 1;
    mouseY = -(event.clientY / window.innerHeight) * 2 + 1;
    modelMove();
  });
}

function modelMove(): void {
  const sections = document.querySelectorAll('section');
  let currentSection = '';

  sections.forEach((section) => {
    const rect = section.getBoundingClientRect();
    if (rect.top <= window.innerHeight / 3) {
      currentSection = section.className;
    }
  });

  const arrPositionModel = [
    { id: 'hero-section', position: new THREE.Vector3(2, 1, 5), rotation: new THREE.Euler(-0.1, 0.2, 0) },
    { id: 'features', position: new THREE.Vector3(12, 0, -8), rotation: new THREE.Euler(0, 1.5, 0) },
    { id: 'specs', position: new THREE.Vector3(2, 1, -20), rotation: new THREE.Euler(0.1, 3, 0) },
    { id: 'call-to-action', position: new THREE.Vector3(0, 0, 10), rotation: new THREE.Euler(0, 0, 0) }
  ];
  const positionActive = arrPositionModel.find((val) => val.id === currentSection);

  if (positionActive) {
    gsap.to(camera.rotation, { x: positionActive.rotation.x + mouseY * 0.01, y: positionActive.rotation.y, z: positionActive.rotation.z, duration: 1, ease: "power1.out" });
    gsap.to(camera.position, { x: positionActive.position.x, y: positionActive.position.y, z: positionActive.position.z, duration: 1, ease: "power1.out" });
    gsap.to(pivot.rotation,{y:mouseX*0.05, duration: 1, ease: "power1.out"} );
  }
}

function renderLoop(composer: EffectComposer): void {

  const clock: THREE.Clock = new THREE.Clock();
  const controls: FlyControls = new FlyControls(camera, renderer.domElement);
  controls.movementSpeed = 1000;
  controls.rollSpeed = Math.PI / 24;
  controls.autoForward = false;
  controls.dragToLook = false;

  function rerender3D(): void {
    requestAnimationFrame(rerender3D);
    controls.update(clock.getDelta());
    composer.render();
  }
  rerender3D();
}

init();
postProcessing();