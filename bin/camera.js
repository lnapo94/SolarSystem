class Camera{
    constructor(gl,fov = 45, near = 1, far = 100000.0){
        //Setup the perspective matrix
        this.projectionMatrix = mat4.create();

        this.ratio = gl.canvas.clientWidth / gl.canvas.clientHeight;
        this.fov = fov;
        this.near = near;
        this.far = far;

        mat4.perspective(this.projectionMatrix, utils.degToRad(this.fov), this.ratio, this.near, this.far);

        this.transform = new Transform();		//Setup transform to control the position of the camera
        this.viewMatrix = mat4.create();	//Cache the matrix that will hold the inverse of the transform.
    }

    moveZ(direction) {
        this.transform.position[0] += this.transform.forward[0] * direction;
        this.transform.position[1] += this.transform.forward[1] * direction;
        this.transform.position[2] += this.transform.forward[2] * direction;
    }

    moveX(direction) {
        this.transform.position[0] += this.transform.right[0] * direction;
        this.transform.position[1] += this.transform.right[1] * direction;
        this.transform.position[2] += this.transform.right[2] * direction;
    }

    moveY(direction) {
        this.transform.position[0] += this.transform.up[0] * direction;
        this.transform.position[1] += this.transform.up[1] * direction;
        this.transform.position[2] += this.transform.up[2] * direction;
    }

    updateViewMatrix(){

        // Camera needs a different update on the matrix
        mat4.identity(this.transform.matView);
        mat4.translate(this.transform.matView, this.transform.matView, this.transform.position);
        mat4.multiply(this.transform.matView, this.transform.matView, this.transform.totalRotation.toMatrix4());

        // Update the actual direction of the camera
        this.transform.updateDirection();

        // Camera matrix needs to be inveerted in order to work properly
        mat4.invert(this.viewMatrix, this.transform.matView);
        return this.viewMatrix;
    }

    updateProjectionMatrix() {
        mat4.perspective(this.projectionMatrix, utils.degToRad(this.fov), this.ratio, this.near, this.far);
        return this.projectionMatrix;
    }

    getFixedViewMatrix() {
        // Removes the translation part from the matrix, used with objects should stay fixed in the world
        // i.e. SkyBox
        let mat = new Float32Array(this.viewMatrix);
        mat[12] = mat[13] = mat[14] = 0.0;
        return mat
    }

    getViewMatrix() {
        return mat4.clone(this.viewMatrix);
    }

    getProjectionMatrix() {
        return mat4.clone(this.projectionMatrix);
    }
}

class CameraController {
    constructor(gl, camera, planetList) {
        this.gl = gl;
        this.camera = camera;
        let box = gl.canvas.getBoundingClientRect();
        this.canvas = gl.canvas;

        this.cameraMode = 'FREE';

        // we want to cycle with the camera lock only those objects which are
        // orbiting directly around the sun
        this.planetList = [];
        for (let obj of planetList){
            if(obj.parent === "SUN" || obj.parent === "ROOT"){
                this.planetList.push(obj);
            }
        }
        this.pointedPlanetIdx = -1;
        this.movementSpeed = 1000;
        this.rotationSpeed = 300;
        this.deltaTime = 0.016;

        this.offsetX = box.left;						//Help calc global x,y mouse cords.
        this.offsetY = box.top;

        this.initX = 0;									//Starting X,Y position on mouse down
        this.initY = 0;
        this.prevX = 0;									//Previous X,Y position on mouse move
        this.prevY = 0;

        let self = this;

        function keyDownHandler(event) {
            if(event.keyCode === 39 && self.cameraMode === "FREE") {
                self.camera.moveX(self.deltaTime * self.movementSpeed);
            }
            else if(event.keyCode === 37 && self.cameraMode === "FREE") {
                self.camera.moveX(-self.deltaTime * self.movementSpeed);
            }
            if(event.keyCode === 40 && self.cameraMode === "FREE") {
                self.camera.moveY(-self.deltaTime * self.movementSpeed);
            }
            else if(event.keyCode === 38 && self.cameraMode === "FREE") {
                self.camera.moveY(self.deltaTime * self.movementSpeed);
            }

            if(event.keyCode === 87 && self.cameraMode === "FREE") {
                self.camera.moveZ(-self.deltaTime * self.movementSpeed)
            }
            else if(event.keyCode === 83 && self.cameraMode === "FREE") {
                self.camera.moveZ(self.deltaTime * self.movementSpeed);
            }

            if(event.keyCode === 81) {
                self.camera.transform.addRotation(0, 0, -self.rotationSpeed * self.deltaTime);
            } else if(event.keyCode === 69) {
                self.camera.transform.addRotation(0, 0, self.rotationSpeed * self.deltaTime);
            }

            if(event.keyCode === 32){
                self.pointedPlanetIdx += 1;
                //we also want the planet to be visible
                self.camera.transform.setRotation(
                    22.334392547607422,
                    -44.63939666748047,
                    -0.8242999911308289);
                if (self.pointedPlanetIdx === self.planetList.length){
                    self.pointedPlanetIdx = -1;
                }
                if (self.pointedPlanetIdx !== -1) { self.cameraMode = "LCKD"}
                else {
                    self.cameraMode = "FREE";
                }
            }
            if(event.keyCode === 18){
                self.cameraMode = "FREE";
                self.pointedPlanetIdx = -1;
            }
        }

        this.onUpHandler = function(e){
            self.onMouseUp(e);
        };

        this.onMoveHandler = function(e){
            self.onMouseMove(e);
        };

        window.addEventListener("keydown", keyDownHandler, false);
        this.canvas.addEventListener("mousedown",function(e){ self.onMouseDown(e); });
        this.canvas.addEventListener("mousewheel", function(e){ self.onMouseWheel(e); });

    }

    setDeltaTime(newDeltaTime) {
        this.deltaTime = newDeltaTime;
    }

    onMouseDown(e){
        this.initX = this.prevX = e.pageX - this.offsetX;
        this.initY = this.prevY = e.pageY - this.offsetY;

        this.canvas.addEventListener("mouseup",this.onUpHandler);
        this.canvas.addEventListener("mousemove",this.onMoveHandler);
    }

    //End listening for dragging movement
    onMouseUp(e){
        this.canvas.removeEventListener("mouseup",this.onUpHandler);
        this.canvas.removeEventListener("mousemove",this.onMoveHandler);
    }

    onMouseWheel(e){
        let delta = Math.max(-1, Math.min(1, (e.wheelDelta || -e.detail)));
        this.camera.fov += delta;

        if(this.camera.fov > 70)
            this.camera.fov = 70;

        if(this.camera.fov < 45)
            this.camera.fov = 45;
    }

    onMouseMove(e){
        let x = e.pageX - this.offsetX,	//Get X,y where the G_canvas's position is origin.
            y = e.pageY - this.offsetY,
            dx = x - this.prevX,		//Difference since last mouse move
            dy = y - this.prevY;

        this.camera.transform.addRotation(-dy * (this.rotationSpeed / this.canvas.height), -dx * (this.rotationSpeed / this.canvas.height), 0);

        this.prevX = x;
        this.prevY = y;
    }

    onTimePassed(){
        if (this.cameraMode === "FREE"){
            return 0;
        }
        else {
            let lockedPos = this.planetList[this.pointedPlanetIdx]
                .model.transform.getPosition();
            vec3.copy(this.camera.transform.position, lockedPos);
            this.camera.transform.addPosition(75, 40, 75);
        }
    }
}