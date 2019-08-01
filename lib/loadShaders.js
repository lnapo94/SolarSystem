
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

G_vertexShader = createShader(G_gl, G_gl.VERTEX_SHADER, G_vertexShaderSrc);
G_fragmentShader = createShader(G_gl, G_gl.FRAGMENT_SHADER, G_fragmentShaderSrc);
