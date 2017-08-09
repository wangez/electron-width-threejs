const {PerspectiveCamera, Scene, AmbientLight, DirectionalLight, Loader, WebGLRenderer} = require('three');
const MTLLoader = require('./javascripts/lib/three-loader/MTLLoader.js');
const DDSLoader = require('./javascripts/lib/three-loader/DDSLoader.js');
const OBJLoader = require('./javascripts/lib/three-loader/OBJLoader.js');
let container, stats;

let camera, scene, renderer;

let mouseX = 0, mouseY = 0;

let windowHalfX = window.innerWidth / 2;
let windowHalfY = window.innerHeight / 2;


init();
animate();


function init() {

    container = document.createElement( 'div' );
    document.body.appendChild( container );

    camera = new PerspectiveCamera( 45, window.innerWidth / window.innerHeight, 1, 2000 );
    camera.position.z = 250;

    // scene

    scene = new Scene();

    var ambient = new AmbientLight( 0x444444 );
    scene.add( ambient );

    var directionalLight = new DirectionalLight( 0xffeedd );
    directionalLight.position.set( 0, 0, 1 ).normalize();
    scene.add( directionalLight );

    // model

    var onProgress = function ( xhr ) {
        if ( xhr.lengthComputable ) {
            var percentComplete = xhr.loaded / xhr.total * 100;
            console.log( Math.round(percentComplete, 2) + '% downloaded' );
        }
    };

    var onError = function ( xhr ) { };

    Loader.Handlers.add( /\.dds$/i, new DDSLoader() );

    var mtlLoader = new MTLLoader();
    mtlLoader.setPath( 'file/' );
    mtlLoader.load( 'male02_dds.mtl', function( materials ) {

        materials.preload();

        var objLoader = new OBJLoader();
        objLoader.setMaterials( materials );
        objLoader.setPath( 'file/' );
        objLoader.load( 'male02.obj', function ( object ) {

            object.position.y = - 95;
            scene.add( object );

        }, onProgress, onError );

    });

    //

    renderer = new WebGLRenderer();
    renderer.setPixelRatio( window.devicePixelRatio );
    renderer.setSize( window.innerWidth, window.innerHeight );
    container.appendChild( renderer.domElement );

    document.addEventListener( 'mousemove', onDocumentMouseMove, false );

    //

    window.addEventListener( 'resize', onWindowResize, false );

}

function onWindowResize() {

    windowHalfX = window.innerWidth / 2;
    windowHalfY = window.innerHeight / 2;

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

    camera.position.x += ( mouseX - camera.position.x ) * .05;
    camera.position.y += ( - mouseY - camera.position.y ) * .05;

    camera.lookAt( scene.position );

    renderer.render( scene, camera );

}