// here to put variables that need to be shared among different files
let G_canvas = document.getElementById("c");
let G_gl = G_canvas.getContext("webgl");
let G_fragmentShader = document.getElementById('3d-fragment-shader');  // represents fragment shader object
let G_vertexShader = document.getElementById('3d-vertex-shader'); // represent vertex shader object
let G_program = null;  // openGL program


CCZF2STXOS