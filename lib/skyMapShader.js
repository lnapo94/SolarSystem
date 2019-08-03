class SkyMapShader extends Shader {

    constructor(gl, pMatrix, tex){
        super(gl, vs_skyURL, fs_skyURL);
        //Custom Uniforms
        this.uniformLocation.dayTex = gl.getUniformLocation(this.program,"uSkyTex");
        //Standrd Uniforms
        this.setPerspective(pMatrix);
        this.tex = tex;
        gl.useProgram(null); //Done setting up shader
    }

    preRender() {
        //Setup Texture
        this.gl.activeTexture(this.gl.TEXTURE0);
        this.gl.bindTexture(this.gl.TEXTURE_CUBE_MAP, this.tex);
        this.gl.uniform1i(this.uniformLocation.dayTex,0);
        return this;
    }

}