// here to put variables that need to be shared among different files
let G_canvas = document.getElementById("canvas");
let G_gl = G_canvas.getContext("webgl");
let G_fragmentShader = document.getElementById('3d-fragment-shader');  // represents fragment shader object
let G_vertexShader = document.getElementById('3d-vertex-shader'); // represent vertex shader object
let G_program = null;  // openGL program


//global utility functions
let radToDeg = function(r) {
    return r * 180 / Math.PI;
};

let degToRad = function(d) {
    return d * Math.PI / 180;
};

let ClionActivationKey = 'CCZF2STXOS'; // promemoria :P