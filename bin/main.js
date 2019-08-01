import {Object} from "../data/planets.js";

function drawScene() {
    G_gl.clearColor(0.0, 0.0, 0.0, 1.0);  // Clear to black, fully opaque
    G_gl.clearDepth(1.0);                 // Clear everything
    G_gl.enable(G_gl.DEPTH_TEST);           // Enable depth testing
    G_gl.depthFunc(G_gl.LEQUAL);            // Near things obscure far things
    G_gl.enable(G_gl.CULL_FACE);

    // Enable the depth buffer
    G_gl.enable(G_gl.DEPTH_TEST);

    // Clear the canvas before we start drawing on it.
    G_gl.clear(G_gl.COLOR_BUFFER_BIT | G_gl.DEPTH_BUFFER_BIT);

    // Compute the matrices
    const fieldOfView = 45 * Math.PI / 180;   // in radians
    const aspect = G_gl.canvas.clientWidth / G_gl.canvas.clientHeight;
    const zNear = 0.0001;
    const zFar = 100.0;
    const projectionMatrix = mat4.create();
    
    mat4.perspective(projectionMatrix,
        fieldOfView,
        aspect,
        zNear,
        zFar);

    const modelViewMatrix = mat4.create();

    // Now move the drawing position a bit to where we want to
    // start drawing the square.

    mat4.translate(modelViewMatrix,     // destination matrix
        modelViewMatrix,     // matrix to translate
        [10.0, 10.0, -50.0]);  // amount to translate


    let o;
    for (o of G_Objects){
        G_gl.useProgram(G_program);
        o.render(projectionMatrix, modelViewMatrix);
    }
    // Set the shader uniforms
}

function  main(data) {
    let o;
    let res = loadMeshData(data);
    console.log(res);
    G_Objects.push( new Object(res, './data/assets/Terra1.jpg'));
    for (o of G_Objects) { o.lookup(); }
    requestAnimationFrame(drawScene)
}

$.ajax({
    url: "./data/assets/terra1.obj",
    dataType: 'text'
}).done(function(data) {
    main(data, G_TERRA_TEXTURE);
});

