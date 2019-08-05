class PlanetModel extends Model{
    constructor(gl) {
        super(gl);
        return this;
    }

    loadShader(vsURL, fsURL, validate = false) {
        this.shader = new PlanetShader(this.gl, vsURL, fsURL, validate);
        return this;
    }

    setShaderNormalMatrix(matData) {
        this.shader.enable().setNormalMatrix(matData).disable();
        return this;
    }

    setShaderCameraPosition(cameraPosition) {
        this.shader.enable().setCameraPosition(cameraPosition).disable();
        return this;
    }

    setShaderLightPosition(lightPosition) {
        this.shader.enable().setLightPosition(lightPosition).disable();
        return this;
    }
}