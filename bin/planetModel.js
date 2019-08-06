class PlanetModel extends Model{
    constructor(gl, modelData, jsonMesh) {
        super(gl);
        this.noCulling = modelData.noCulling;
        this.doBlending = modelData.doBlending;

        this.name = modelData.name;

        this.loadShader(modelData.vShaderURL, modelData.fShaderURL, true);

        this.loadMeshFromJSON(jsonMesh);

        this.loadTexture(document.getElementById(modelData.texture), modelData.doYFlip);

        this.transform.setScale(modelData.scale.X, modelData.scale.Y, modelData.scale.Z);
        this.transform.setPosition(modelData.position.X, modelData.position.Y, modelData.position.Z);

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

    setShaderLightParameters(lightPosition, lightTargetDistance, lightDecay, lightAmbientPower, lightDiffusePower) {
        this.shader.enable().setLightParameters(lightPosition, lightTargetDistance, lightDecay, lightAmbientPower, lightDiffusePower).disable();
        return this;
    }
}