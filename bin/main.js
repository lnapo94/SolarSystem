import {Object} from "../data/planets.js";
let then = 0;

function drawScene(then, deltatime) {
    // TODO THIS IS AN ANTIPATTERN, BETTER TO CHANGE IT
    G_gl.viewport(0, 0, G_gl.canvas.width, G_gl.canvas.height);
    G_gl.clearColor(0.0, 0.0, 0.0, 1.0);  // Clear to black, fully opaque
    G_gl.clearDepth(1.0);                 // Clear everything
    G_gl.enable(G_gl.DEPTH_TEST);           // Enable depth testing
    G_gl.depthFunc(G_gl.LEQUAL);            // Near things obscure far things
    G_gl.enable(G_gl.CULL_FACE);
    G_gl.clear(G_gl.COLOR_BUFFER_BIT | G_gl.DEPTH_BUFFER_BIT);      // Clear the canvas before we start drawing on it.

    // Compute perspective matrix
    const fieldOfView = 30 * Math.PI / 180;   // in radians
    const aspect = G_gl.canvas.clientWidth / G_gl.canvas.clientHeight;
    const zNear = 0.1;
    const zFar = 1000.0;
    const projectionMatrix = mat4.create();
    mat4.perspective(projectionMatrix,
        fieldOfView,
        aspect,
        zNear,
        zFar);
    let o;
    for (o in G_Objects){
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
    let sunMVM = mat4.create();
    console.log(sunMVM);
    mat4.translate(sunMVM, sunMVM, [-.5, 0, -1]);  // amount to translate
    mat4.scale(sunMVM, sunMVM, [.00002,.00002,.00002]); // THIS SUN IS HUUUUUUUGE

    let terraMVM = mat4.create();
    console.log(terraMVM);
    mat4.translate(terraMVM, terraMVM, [.5, .5,-10]);  // amount to translate
    mat4.scale(terraMVM, terraMVM, [1.5,1.5,1.5]);

    G_Objects['sun'].setModelViewMatrix(sunMVM);
    G_Objects['terra'].setModelViewMatrix(terraMVM);
}

function  main(data) {
    let o;
    for (o of data){
        let res = loadMeshData(o.mesh);
        G_Objects[o.name] = new Object(res, o.texture)
    }
    setModelViewMatrixes();
    for (o in G_Objects) {
        G_Objects[o].lookup();
    }
    requestAnimationFrame(render);
}

let requestMeshes = {
    sun : function () {
        return $.ajax({
                url: "./data/assets/sun.obj",
                dataType: 'text'
            })
    },
    mercury : function () {

    },
    venus : function () {

    },
    terra : function () {
        return $.ajax({
                url: "./data/assets/terra1.obj",
                dataType: 'text'
            });
    },
    mars : function () {

    },
    jupiter : function () {

    },
    saturn : function () {

    },
    uran : function () {

    },
    neptune : function () {

    },
    pluto : function () {

    }
};
$.when(
    requestMeshes.sun(),
    requestMeshes.mercury(),
    requestMeshes.venus(),
    requestMeshes.terra(),
    requestMeshes.mars(),
    requestMeshes.jupiter(),
    requestMeshes.saturn(),
    requestMeshes.uran(),
    requestMeshes.neptune(),
    requestMeshes.pluto()).done(( sun, mercury, venus, terra, mars, jupiter,saturn, urane, neptune, pluto) => {
        let data = [
            {
                name : 'terra',
                texture : G_TERRA_TEXTURE,
                mesh : terra[0]
            },
            {
                name : 'sun',
                texture : G_SUN_TEXTURE,
                mesh : sun[0]
            }
        ];
        main(data)
    });

