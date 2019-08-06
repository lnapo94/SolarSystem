class PlanetShader extends Shader{
    constructor(gl, vsURL, fsURL, validate = false) {
        super(gl, vsURL, fsURL, validate);

        gl.useProgram(this.program);

        // Load new Uniforms
        this.uniformLocation.normalMatrix = gl.getUniformLocation(this.program, 'uNormalMatrix');
        this.uniformLocation.cameraPosition = gl.getUniformLocation(this.program, 'uCameraPosition');
        this.uniformLocation.lightPosition = gl.getUniformLocation(this.program, 'uLightPosition');

        // Load Light Uniforms
        this.uniformLocation.lightTargetDistance = gl.getUniformLocation(this.program, 'LTarget');
        this.uniformLocation.lightDecay = gl.getUniformLocation(this.program, 'LDecay');
        this.uniformLocation.ambientLightPower = gl.getUniformLocation(this.program, 'ambientPower');
        this.uniformLocation.diffuseLightPower = gl.getUniformLocation(this.program, 'diffusePower');

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

    setLightParameters(position, targetDistance, lightDecay, ambientPower, diffusePower) {
        this.gl.uniform3fv(this.uniformLocation.lightPosition, position);
        this.gl.uniform1f(this.uniformLocation.lightTargetDistance, targetDistance);
        this.gl.uniform1f(this.uniformLocation.lightDecay, lightDecay);
        this.gl.uniform1f(this.uniformLocation.ambientLightPower, ambientPower);
        this.gl.uniform1f(this.uniformLocation.diffuseLightPower, diffusePower);

        return this;
    }

}