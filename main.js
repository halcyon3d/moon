// SET UP KEYBOARD CONTROLS

const UKEY = 'KeyW';
const DKEY = 'KeyS';
const LKEY = 'KeyA';
const RKEY = 'KeyD';
const FKEY = 'KeyQ';
const BKEY = 'KeyE';

const LUKEY = 'ArrowUp';
const LDKEY = 'ArrowDown';
const LLKEY = 'ArrowLeft';
const LRKEY = 'ArrowRight';

const LEVEL = 'Space';

const KEYS = {};

document.addEventListener('keydown', function(e) {KEYS[e.code] = true; console.log(e.code)});
document.addEventListener('keyup', function(e) {KEYS[e.code] = false; console.log(e.code)});

// PROVIDED BY TheK3nger:
// https://www.davideaversa.it/blog/three-js-shader-loading-external-file/

// This is a basic asyncronous shader loader for THREE.js.
function ShaderLoader(vertex_url, fragment_url, onLoad, onProgress, onError) {
    var vertex_loader = new THREE.XHRLoader(THREE.DefaultLoadingManager);
    vertex_loader.setResponseType('text');
    vertex_loader.load(vertex_url, function (vertex_text) {
        var fragment_loader = new THREE.XHRLoader(THREE.DefaultLoadingManager);
        fragment_loader.setResponseType('text');
        fragment_loader.load(fragment_url, function (fragment_text) {
            onLoad(vertex_text, fragment_text);
        });
    }, onProgress, onError);
}

// CONSTANTS FOR COLORS [sic].
const COL_BLK = new THREE.Color(0x000000);
const COL_NVY = new THREE.Color(0x800080);
const COL_YLW = new THREE.Color(0xeeee77);
const COL_IVR = new THREE.Color(0xffffff);

// CONVERTS BLOCH SPHERE CO-ORDS TO X,Y,Z CO-ORDS
function coords(theta, phi, r=1) {
      x = r * Math.sin(phi) * Math.sin(theta);
      y = r * Math.cos(phi);
      z = r * Math.sin(phi) * Math.cos(theta);
      
      return new THREE.Vector3(x,y,z);
}

// CREATES THE WORLD
function genesis(vert, frag) {

    // set up the scene, camera etc
    var scene = new THREE.Scene();
    scene.background = new THREE.Color(COL_BLK);
    
    var camera = new THREE.PerspectiveCamera(50, window.innerWidth/window.innerHeight, 1, 1000 );
    
    // camera position, in bloch sphere co-ords
    var cp = new THREE.Vector3(0, Math.PI / 2, 5);
     
    var renderer = new THREE.WebGLRenderer({});
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(renderer.domElement);
    
    // set up moon material
    const uniforms = {
        col_blck: {type: 'vec3', value: COL_BLK},
        col_shdw: {type: 'vec3', value: COL_NVY},
        col_nrml: {type: 'vec3', value: COL_YLW},
        col_lite: {type: 'vec3', value: COL_IVR},
        

        ldir: {type: 'vec3', value: new THREE.Vector3(1,0,0)},
        cdir: {type: 'vec3', value: new THREE.Vector3(1,0,0)},
    };
  
    const material = new THREE.ShaderMaterial({
        uniforms: uniforms,
        fragmentShader: frag,
        vertexShader: vert,
    });
    
    // set up moon geometry
    const sphere = new THREE.IcosahedronGeometry(1,3);
    
    // create moon mesh and add it to the scene
    var moon = new THREE.Mesh(sphere, material);
    scene.add(moon);
    
    // timekeeping
    // keep track of time of last frame and time elapsed between frames
    let then = 0;
    let dt = 0;
    
    // main game loop.
    var gameloop = function (time) {
        // set dt to time since last frame in seconds, then update then
        dt = (time - then) / 1000;
        then = time;
        
        // update camera position by converting cp to cartesian coordinates
        c = coords(cp.x, cp.y, cp.z);
        camera.position.set(c.x, c.y, c.z);
        
        // update camera position (this is rotation around the moon)
        cp.x = time/4000;
        
        // point camera at moon
        camera.lookAt(0,0,0);
        
        // render the scene
        requestAnimationFrame(gameloop);
        renderer.render(scene, camera);
    }
    
    // start game!
    gameloop();
}

// Genesis 1:3
// "Then God said, "Let there be light"; and there was light."
ShaderLoader("shaders/vertex.vert", "shaders/hatched.frag", genesis, (()=>console.log("Loading shaders...")), (()=>console.log("Error loading shaders.")));