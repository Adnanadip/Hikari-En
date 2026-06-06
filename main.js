import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

const scene = new THREE.Scene();
const canvas = document.getElementById("experience-canvas")
const sizes = {width: window.innerWidth, height: window.innerHeight, aspect: window.innerWidth/window.innerHeight};

//-------------renderer--------------
const renderer = new THREE.WebGLRenderer({canvas: canvas, antialias: true});
renderer.setSize( sizes.width, sizes.height );
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
renderer.shadowMap.enabled = true;
renderer.outputColorSpace = THREE.NoColorSpace;
renderer.toneMapping = THREE.ReinhardToneMapping;
renderer.toneMappingExposure = 5;


//---------camera-------------
const camera = new THREE.OrthographicCamera( -sizes.aspect*5, sizes.aspect*5, 5, -5, 1, 1000 );
camera.position.set(35.24, 7.548, 32.804);


//------------controls--------
const controls = new OrbitControls(camera, canvas);
controls.target.set(3, -10, -1);
controls.update();


//--------------light-----------
const sun = new THREE.DirectionalLight( 0xFFFFFF);
sun.castShadow = true;

const light = new THREE.AmbientLight( 0x404040, 0.5 ); 
scene.add( light )

sun.position.set(50, 150, 50);
sun.shadow.mapSize.width = 4096;
sun.shadow.mapSize.height = 4096;
sun.shadow.camera.left = -125;
sun.shadow.camera.right = 125;
sun.shadow.camera.top = 100;
sun.shadow.camera.bottom = -75;
sun.shadow.normalBias = 0.3;

scene.add(sun);

const Shadowhelper = new THREE.CameraHelper( sun.shadow.camera );
scene.add( Shadowhelper );

const helper = new THREE.DirectionalLightHelper(sun, 5);
scene.add( helper );

//---------------GLTF-------------------
const loader = new GLTFLoader();
loader.load(
    "./Hikari.glb",
    function(glb){
        glb.scene.traverse(child=>{
            if(child.isMesh){
                child.castShadow = true;
                child.receiveShadow = true;
            }
        })
        scene.add(glb.scene)
    },
    undefined,
    function(error) {
        console.error(error);
    }
)

function handleResize(){
    sizes.width = window.innerWidth;
    sizes.height = window.innerHeight;
    sizes.aspect = window.innerWidth/window.innerHeight;

    camera.left = -sizes.aspect*5;
    camera.right = sizes.aspect*5;
    camera.top = 5;
    camera.bottom = -5;

    camera.updateProjectionMatrix();
    
    renderer.setSize( sizes.width, sizes.height );
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
}

window.addEventListener("resize", handleResize)

function animate( time ) {
    renderer.render( scene, camera );
}
renderer.setAnimationLoop( animate );