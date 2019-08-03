class Model {
    constructor(mesh) {
        this.transform = new Transform();
        this.mesh = mesh;
    }

    setScale(x, y, z) {
        this.transform.scale = vec3.fromValues(x, y, z);
        return this;
    }

    setPosition(x, y, z) {
        this.transform.position = vec3.fromValues(x, y, z);
        return this;
    }

    setRotation(x, y, z) {
        this.transform.rotation = vec3.fromValues(x, y, z);
        return this;
    }

    addScale(x, y, z) {
        let previousX = this.transform.scale[0],
            previousY = this.transform.scale[1],
            previousZ = this.transform.scale[2];

        this.transform.scale = vec3.fromValues(previousX + x,
                                                    previousY + y,
                                                        previousZ + z);
        return this;
    }

    addPosition(x, y, z) {
        let previousX = this.transform.position[0],
            previousY = this.transform.position[1],
            previousZ = this.transform.position[2];

        this.transform.position = vec3.fromValues(previousX + x,
                                                    previousY + y,
                                                        previousZ + z);
        return this;
    }

    addRotation(x, y, z) {
        let previousX = this.transform.rotation[0],
            previousY = this.transform.rotation[1],
            previousZ = this.transform.rotation[2];

        this.transform.rotation = vec3.fromValues(previousX + x,
                                                    previousY + y,
                                                        previousZ + z);
        return this;
    }

    preRender() {
        this.transform.updateMatrix();
        return this;
    }
}