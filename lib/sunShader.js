class SunShader extends Shader{
    constructor(gl) {
        super(gl, vs_sunURL, fs_sunURL, true);

        this.uniformLocation.mainTexture = gl.getUniformLocation(this.program, 'uSunTexture');

        gl.useProgram(null);
    }

    setTexture(texture) {
        this.texture = texture;
        return this;
    }

    preRender() {
        this.gl.activeTexture(this.gl.TEXTURE0);
        this.gl.bindTexture(this.gl.TEXTURE_2D, this.texture);
        this.gl.uniform1i(this.uniformLocation.mainTexture, 0);
        return this;
    }
}