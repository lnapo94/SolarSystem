import {Object} from "../data/planets.js";
let then = 0;

function drawScene(then, deltatime) {
    G_gl.viewport(0, 0, G_gl.canvas.width, G_gl.canvas.height);
    G_gl.clearColor(0.0, 0.0, 0.0, 1.0);  // Clear to black, fully opaque
    G_gl.clearDepth(1.0);                 // Clear everything
    G_gl.enable(G_gl.DEPTH_TEST);           // Enable depth testing
    G_gl.depthFunc(G_gl.LEQUAL);            // Near things obscure far things
    G_gl.enable(G_gl.CULL_FACE);
    G_gl.clear(G_gl.COLOR_BUFFER_BIT | G_gl.DEPTH_BUFFER_BIT);      // Clear the canvas before we start drawing on it.

    // Compute perspective matrix
    const fieldOfView = 60 * Math.PI / 180;   // in radians
    const aspect = G_gl.canvas.clientWidth / G_gl.canvas.clientHeight;
    const zNear = 0.1;
    const zFar = 100.0;
    const projectionMatrix = mat4.create();
    mat4.perspective(projectionMatrix,
        fieldOfView,
        aspect,
        zNear,
        zFar);

    let o;
    for (o in G_Objects){
        G_gl.useProgram(G_program);
        G_Objects[o].render(projectionMatrix);
    }
}

function render(now) {
    now *= 0.001;  // convert to seconds
    const deltaTime = now - then;
    then = now;

    drawScene(then, deltaTime);

    requestAnimationFrame(render);
}

function setModelViewMatrixes() {
    let terraMVM = mat4.create();
    console.log(terraMVM);
    mat4.translate(terraMVM, terraMVM, [0, +.5,-2]);  // amount to translate
    mat4.scale(terraMVM, terraMVM, [5,5,5]);
    G_Objects.terra.setModelViewMatrix(terraMVM);
}

function  main(data) {
    let o;
    let res = loadMeshData(data);
    G_Objects = {
        terra : new Object(res, 'http://localhost:63342/SolarSystem/data/assets/Terra1.png?_ijt=o9keg75a007lrbem85al5r41sm'),
    };
    setModelViewMatrixes();
    for (o in G_Objects) {
        G_Objects[o].lookup();
    }
    requestAnimationFrame(render)
}


$.ajax({
    url: "./data/assets/terra1.obj",
    dataType: 'text'
}).done(function(data) {
    main(data, G_TERRA_TEXTURE);
});

