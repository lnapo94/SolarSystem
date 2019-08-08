class PlanetModel extends Model{
    constructor(gl, modelData) {
        super(gl);
        this.noCulling = modelData.noCulling;
        this.doBlending = modelData.doBlending;

        this.name = modelData.name;

        this.loadShader(modelData.vShaderURL, modelData.fShaderURL, true);

        this.loadMeshFromJSON(modelData.loadedMesh);

        this.loadTexture(document.getElementById(modelData.texture), modelData.doYFlip);

        this.position = 0;
        this.transform.setScale(modelData.scale.X, modelData.scale.Y, modelData.scale.Z);
        this.transform.setPosition(modelData.position.X, modelData.position.Y, modelData.position.Z);
        this.transform.setRotation(modelData.orientation.X, modelData.orientation.Y, modelData.orientation.Z);
        this.motion = modelData.motion;

        this.lightTargetDistance = modelData.lightTargetDistance;
        this.lightDecay = modelData.lightDecay;
        this.lightAmbientPower = modelData.lightAmbientPower;
        this.lightDiffusePower = modelData.lightDiffusePower;

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

    getLocalMatrix(){
        return this.transform.localMatrix;
    }

    setShaderCameraPosition(cameraPosition) {
        this.shader.enable().setCameraPosition(cameraPosition).disable();
        return this;
    }

    setShaderLightParameters(lightPosition) {
        this.shader.enable().setLightParameters(
            lightPosition,
            this.lightTargetDistance,
            this.lightDecay,
            this.lightAmbientPower,
            this.lightDiffusePower).disable();
        return this;
    }

    onTimePassed(deltaTime, projection, view, world){
        this.setShaderPerspective(projection)
            .setShaderNormalMatrix(this.transform.getNormalMatrix())
            .setShaderLightParameters(vec3.fromValues(0,0,0))
            .render(view)
            .animate(deltaTime, world)
    }

    animate(deltaTime, world){

        this.transform.addRotation(
            this.motion.rotation.X(deltaTime),
            this.motion.rotation.Y(deltaTime),
            this.motion.rotation.Z(deltaTime));
        this.transform.setPosition(
            this.motion.translation.X(this.position),
            this.motion.translation.Y(this.position),
            this.motion.translation.Z(this.position));
        this.transform.setWorldMatrix(world);
        this.position += deltaTime * this.motion.speed;
    }
}

class SunModel extends PlanetModel{
    constructor(gl, modelData){
        super(gl, modelData);
    }
    // onTimePassed(deltaTime, projection, view, world) {
    //
    //         this.setShaderPerspective(projection)
    //             .setWorldMatrix(world)
    //             .render(view);
    //
    // }
}