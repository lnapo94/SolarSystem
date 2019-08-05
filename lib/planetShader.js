class PlanetShader extends Shader{
    constructor(gl, vsURL, fsURL, validate = false) {
        super(gl, vsURL, fsURL, validate);

        gl.useProgram(this.program);

        // Load new uniforms
        this.uniformLocation.normalMatrix = gl.getUniformLocation(this.program, 'uNormalMatrix');
        this.uniformLocation.cameraPosition = gl.getUniformLocation(this.program, 'uCameraPosition');
        this.uniformLocation.lightPosition = gl.getUniformLocation(this.program, 'uLightPosition');

        gl.useProgram(null);

        return this;
    }

    setNormalMatrix(matData) {
        this.gl.uniformMatrix3fv(this.uniformLocation.normalMatrix, false, matData);
        return this;
    }

    setCameraPosition(position) {
        this.gl.uniform3fv(this.uniformLocation.cameraPosition, position);
        return this;
    }

    setLightPosition(position) {
        this.gl.uniform3fv(this.uniformLocation.lightPosition, position);
        return this;
    }

}