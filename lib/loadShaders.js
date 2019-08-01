
let FRAGMENT = "PUT FRAGMENT NAME ON HTML HERE"
let VERTEX = "PUT VERTEX NAME ON HTML HERE";

function createShader(G_gl, type, source) {
    var shader = G_gl.createShader(type);
    G_gl.shaderSource(shader, source);
    G_gl.compileShader(shader);
    var success = G_gl.getShaderParameter(shader, G_gl.COMPILE_STATUS);
    if (success) {
        return shader;
    }

    console.log(G_gl.getShaderInfoLog(shader));
    G_gl.deleteShader(shader);
}

const vertexShaderSource = document.getElementById(VERTEX).text;
const fragmentShaderSource = document.getElementById(FRAGMENT).text;

G_vertexShader = createShader(gl, gl.VERTEX_SHADER, vertexShaderSource);
 G_fragmentShader = createShader(gl, gl.FRAGMENT_SHADER, fragmentShaderSource);
