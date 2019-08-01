// here to put variables that need to be shared among different files
let G_canvas = document.getElementById("canvas");
let G_gl = G_canvas.getContext("webgl");
let G_fragmentShaderSrc = document.getElementById('3d-fragment-shader').text;  // represents fragment shader object
let G_vertexShaderSrc = document.getElementById('3d-vertex-shader').text; // represent vertex shader object
let G_fragmentShader = null;
let G_vertexShader = null;
let G_program = null;  // openGL program
let G_Objects = [];

const G_TERRA_TEXTURE = './data/assets/Terra1.jpg';
//global utility functions
let radToDeg = function(r) {
    return r * 180 / Math.PI;
};

let degToRad = function(d) {
    return d * Math.PI / 180;
};

let ClionActivationKey = 'CCZF2STXOS'; // promemoria :P