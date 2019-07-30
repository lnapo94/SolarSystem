function createProgram(G_gl, vertexShader, fragmentShader) {
    var program = G_gl.createProgram();
    G_gl.attachShader(program, vertexShader);
    G_gl.attachShader(program, fragmentShader);
    G_gl.linkProgram(program);
    var success = G_gl.getProgramParameter(program, G_gl.LINK_STATUS);
    if (success) {
        return program;
    }

    console.log(G_gl.getProgramInfoLog(program));
    G_gl.deleteProgram(program);
}

G_program = createProgram(G_gl, G_vertexShader, G_fragmentShader);
