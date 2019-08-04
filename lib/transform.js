class Transform {
    constructor() {

        this.position = vec3.fromValues(0, 0, 0);
        this.scale = vec3.fromValues(1, 1, 1);
        this.rotation = vec3.fromValues(0, 0, 0);
        this.matView = mat4.create();
        this.matNormal = mat3.create();

        this.forward = vec4.fromValues(0, 0, 0, 1);
        this.up = vec4.fromValues(0, 0, 0, 1);
        this.right = vec4.fromValues(0, 0, 0, 1);
    }

    setPosition(x, y, z) {
        this.position = vec3.fromValues(x, y, z);
        return this;
    }

    setScale(x, y, z) {
        this.scale = vec3.fromValues(x, y, z);
        return this;
    }

    setRotation(x, y, z) {
        this.position = vec3.fromValues(x, y, z);
        return this;
    }

    addPosition(x, y, z) {
        vec3.add(this.position, this.position, vec3.fromValues(x, y, z));
        return this;
    }

    addScale(x, y, z) {
        vec3.add(this.scale, this.scale, vec3.fromValues(x, y, z));
        return this;
    }

    addRotation(x, y, z) {
        vec3.add(this.rotation, this.rotation, vec3.fromValues(x, y, z));
        return this;
    }

    updateMatrix() {
        mat4.identity(this.matView);
        mat4.translate(this.matView, this.matView, this.position);
        mat4.rotateX(this.matView, this.matView, utils.degToRad(this.rotation[0]));
        mat4.rotateZ(this.matView, this.matView, utils.degToRad(this.rotation[2]));
        mat4.rotateY(this.matView, this.matView, utils.degToRad(this.rotation[1]));
        mat4.scale(this.matView, this.matView, this.scale);

        mat3.normalFromMat4(this.matNormal, this.matView);

        this.updateDirection();
    }

    updateDirection(){
        vec4.transformMat4(this.forward, vec4.fromValues(0, 0, 1, 0), this.matView);
        vec4.transformMat4(this.up, vec4.fromValues(0, 1, 0, 0), this.matView);
        vec4.transformMat4(this.right, vec4.fromValues(1, 0, 0, 0), this.matView);
        return this;
    }

    setViewMatrix(viewMatrix) {
        this.matView = viewMatrix;
    }

    getViewMatrix(){
        return this.matView;
    }

    getNormalMatrix(){
        return this.matNormal
    }

    reset() {
        this.position = vec3.fromValues(0, 0, 0);
        this.rotation = vec3.fromValues(0, 0, 0);
        this.scale = vec3.fromValues(1, 1, 1);
    }

}