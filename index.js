const {PerspectiveCamera, Scene, AmbientLight, DirectionalLight, Loader, WebGLRenderer} = require('three');
const MTLLoader = require('./javascripts/lib/three-loader/MTLLoader.js');
const DDSLoader = require('./javascripts/lib/three-loader/DDSLoader.js');
const OBJLoader = require('./javascripts/lib/three-loader/OBJLoader.js');

let camera, scene, renderer;
let timefleg = 0;
const pi = Math.PI / 180;
const dis = 300;


init();
animate();


function init() {


    camera = new PerspectiveCamera( 45, window.innerWidth / window.innerHeight, 1, 2000 );
    camera.position.z = dis;

    // scene

    scene = new Scene();

    scene.add( new AmbientLight( 0x444444 ) );

    const directionalLight = new DirectionalLight( 0xffeedd );
    directionalLight.position.set( 0, 0, 1 ).normalize();
    scene.add( directionalLight );

    // model

    Loader.Handlers.add( /\.dds$/i, new DDSLoader() );

    const mtlLoader = new MTLLoader();
    mtlLoader.setPath( 'file/' );
    mtlLoader.load( 'male02_dds.mtl', materials => {

        materials.preload();

        const objLoader = new OBJLoader();
        objLoader.setMaterials( materials );
        objLoader.setPath( 'file/' );
        objLoader.load( 'male02.obj', object => {

            object.position.y = - 95;
            scene.add( object );

        } );

    });

    //renderer
    renderer = new WebGLRenderer();
    renderer.setPixelRatio( window.devicePixelRatio );
    renderer.setSize( window.innerWidth, window.innerHeight );
    document.getElementById( 'container' ).appendChild( renderer.domElement );

    window.addEventListener( 'resize', onWindowResize, false );

}

function onWindowResize() {

    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();

    renderer.setSize( window.innerWidth, window.innerHeight );

}

function onDocumentMouseMove( event ) {

    mouseX = ( event.clientX - windowHalfX ) / 2;
    mouseY = ( event.clientY - windowHalfY ) / 2;

}

//

function animate() {

    requestAnimationFrame( animate );
    render();

}
function render() {
    timefleg++;
    timefleg = timefleg % 360;
    const angle = pi * timefleg;
    camera.position.x = Math.cos(angle) * dis;
    camera.position.z = Math.sin(angle) * dis;
    camera.lookAt( scene.position );

    renderer.render( scene, camera );

}