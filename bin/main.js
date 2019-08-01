function main() {

    // Create the canvas and attach it to the body
    canvas = utils.createCanvas();

    gl = canvas.getContext('webgl2');

    if(!gl) {
        alert("WebGL cannot be loaded");
        return;
    }

    utils.resizeCanvasToDisplaySize(gl.canvas);
    gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);
    gl.enable(gl.CULL_FACE);
    gl.enable(gl.DEPTH_TEST);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
}