class Camera{
    constructor(gl,fov = 45, near = 0.1, far = 1000.0){
        //Setup the perspective matrix
        this.projectionMatrix = mat4.create();

        this.ratio = gl.canvas.width / gl.canvas.height;
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

    rotate(qx, qy, qz) {
        this.transform.totalRotation = qz.mul(qx.mul(qy.mul(this.transform.totalRotation)));
    }

    updateViewMatrix(){

        mat4.identity(this.transform.matView);
        mat4.translate(this.transform.matView, this.transform.matView, this.transform.position);
        mat4.multiply(this.transform.matView, this.transform.matView, this.transform.totalRotation.toMatrix4());

        this.transform.updateDirection();

        //Cameras work by doing the inverse transformation on all meshes, the camera itself is a lie :)
        mat4.invert(this.viewMatrix, this.transform.matView);
        return this.viewMatrix;
    }

    updateProjectionMatrix() {
        mat4.perspective(this.projectionMatrix, utils.degToRad(this.fov), this.ratio, this.near, this.far);
        return this.projectionMatrix;
    }

    getFixedViewMatrix() {
        let mat = new Float32Array(this.viewMatrix);
        mat[12] = mat[13] = mat[14] = 0.0;
        return mat
    }

    getViewMatrix() {
        return mat4.clone(this.viewMatrix);
    }
}

class CameraController {
    constructor(gl, camera) {
        this.gl = gl;
        this.camera = camera;
        let box = gl.canvas.getBoundingClientRect();
        this.canvas = gl.canvas;

        this.movementSpeed = 100;
        this.rotationSpeed = 30;
        this.deltaTime = 0.016;

        this.offsetX = box.left;						//Help calc global x,y mouse cords.
        this.offsetY = box.top;

        this.initX = 0;									//Starting X,Y position on mouse down
        this.initY = 0;
        this.prevX = 0;									//Previous X,Y position on mouse move
        this.prevY = 0;

        let self = this;

        function keyDownHandler(event) {
            if(event.keyCode === 39) {
                self.camera.moveX(self.deltaTime * self.movementSpeed);
            }
            else if(event.keyCode === 37) {
                self.camera.moveX(-self.deltaTime * self.movementSpeed);
            }
            if(event.keyCode === 40) {
                self.camera.moveY(-self.deltaTime * self.movementSpeed);
            }
            else if(event.keyCode === 38) {
                self.camera.moveY(self.deltaTime * self.movementSpeed);
            }

            if(event.keyCode === 87) {
                self.camera.moveZ(-self.deltaTime * self.movementSpeed)
            }
            else if(event.keyCode === 83) {
                self.camera.moveZ(self.deltaTime * self.movementSpeed);
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

        if(this.camera.fov > 90)
            this.camera.fov = 90;

        if(this.camera.fov < 10)
            this.camera.fov = 10;
    }

    onMouseMove(e){
        let x = e.pageX - this.offsetX,	//Get X,y where the G_canvas's position is origin.
            y = e.pageY - this.offsetY,
            dx = x - this.prevX,		//Difference since last mouse move
            dy = y - this.prevY;

        let qy = Quaternion.fromAxisAngle([0, 1, 0], utils.degToRad(-dx * (this.rotationSpeed / this.canvas.height)));
        let qx = Quaternion.fromAxisAngle([1, 0, 0], utils.degToRad(-dy * (this.rotationSpeed / this.canvas.height)));
        let qz = new Quaternion();

            this.camera.rotate(qx, qy, qz);

        this.prevX = x;
        this.prevY = y;
    }
}