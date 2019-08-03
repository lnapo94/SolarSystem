class Camera{
    constructor(gl,fov = 45, near = 0.1, far = 1000.0){
        //Setup the perspective matrix
        this.projectionMatrix = mat4.create();
        let ratio = gl.canvas.width / gl.canvas.height;

        mat4.perspective(this.projectionMatrix, utils.degToRad(fov), ratio, near, far);

        this.transform = new Transform();		//Setup transform to control the position of the camera
        this.viewMatrix = mat4.create();	//Cache the matrix that will hold the inverse of the transform.

        this.mode = Camera.MODE_FREE;			//Set what sort of control mode to use.
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

    rotationY(rotation) {
        this.transform.rotation[1] += rotation * 10;
    }

    rotate(qx, qy, qz) {
        this.transform.totalRotation = qz.mul(qx.mul(qy.mul(this.transform.totalRotation)));
    }

    panX(v){
        if(this.mode === Camera.MODE_ORBIT) return; // Panning on the X Axis is only allowed when in free mode
        this.updateViewMatrix();
        this.transform.position[0] += this.transform.right[0] * v;
        this.transform.position[1] += this.transform.right[1] * v;
        this.transform.position[2] += this.transform.right[2] * v;
    }

    panY(v){
        this.updateViewMatrix();
        this.transform.position[1] += this.transform.up[1] * v;
        if(this.mode === Camera.MODE_ORBIT) return; //Can only move up and down the y axix in orbit mode
        this.transform.position[0] += this.transform.up[0] * v;
        this.transform.position[2] += this.transform.up[2] * v;
    }

    panZ(v){
        this.updateViewMatrix();
        if(this.mode === Camera.MODE_ORBIT){
            this.transform.position[2] += v; //orbit mode does translate after rotate, so only need to set Z, the rotate will handle the rest.
        }else{
            //in freemode to move forward, we need to move based on our forward which is relative to our current rotation
            this.transform.position[0] += this.transform.forward[0] * v;
            this.transform.position[1] += this.transform.forward[1] * v;
            this.transform.position[2] += this.transform.forward[2] * v;
        }
    }

    updateViewMatrix(){
        //Optimize camera transform update, no need for scale nor rotateZ
        if(this.mode === Camera.MODE_FREE){
            mat4.identity(this.transform.matView);
            mat4.translate(this.transform.matView, this.transform.matView, this.transform.position);
            mat4.rotateX(this.transform.matView, this.transform.matView, utils.degToRad(this.transform.rotation[0]));
            mat4.rotateY(this.transform.matView, this.transform.matView, utils.degToRad(this.transform.rotation[1]));

        }else{
            mat4.identity(this.transform.matView);
            mat4.rotateX(this.transform.matView, this.transform.matView, utils.degToRad(this.transform.rotation[0]));
            mat4.rotateY(this.transform.matView, this.transform.matView, utils.degToRad(this.transform.rotation[1]));
            mat4.translate(this.transform.matView, this.transform.matView, this.transform.position);
        }

        this.transform.updateDirection();

        //Cameras work by doing the inverse transformation on all meshes, the camera itself is a lie :)
        mat4.invert(this.viewMatrix, this.transform.matView);
        return this.viewMatrix;
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

Camera.MODE_FREE = 0;	//Allows free movement of position and rotation, basicly first person type of camera
Camera.MODE_ORBIT = 1;	//Movement is locked to rotate around the origin, Great for 3d editors or a single model viewer

class CameraController2 {
    constructor(gl, camera) {
        let self = this;
        this.canvas = gl.canvas;
        this.camera = camera;

        this.maxSpeed = 0.7;
        this.deltaSpeed = 0.01;
        this.actualSpeed = 0;

        this.keyFunctionDown = function (e) {

            if(self.actualSpeed <= self.maxSpeed)
                self.actualSpeed += self.deltaSpeed;
            switch(e.keyCode) {
                case 37:
                    console.log("KeyDown   - Dir LEFT");
                {
                    let qy = Quaternion.fromAxisAngle([0, 1, 0], utils.degToRad(1));
                    let qx = new Quaternion();
                    let qz = new Quaternion();
                    self.camera.rotate(qx, qy, qz);
                    break;
                }
                case 39:
                    console.log("KeyDown   - Dir RIGHT");
                    let qy = Quaternion.fromAxisAngle([0, 1, 0],utils.degToRad(-1));
                    let qx = new Quaternion();
                    let qz = new Quaternion();
                    self.camera.rotate(qx, qy, qz);
                    break;
                case 38:
                    console.log("KeyDown   - Dir UP");
                    self.camera.moveZ(-self.actualSpeed);
                    break;
                case 40:
                    console.log("KeyDown   - Dir DOWN");
                    self.camera.moveZ(self.actualSpeed);
                    break;
                case 87:
                    console.log("KeyDown   - Dir W");
                    self.camera.moveY(self.actualSpeed);
                    break;
                case 83:
                    console.log("KeyDown   - Dir S");
                    self.camera.moveY(-self.actualSpeed);
                    break;
                case 65:
                    console.log("KeyDown   - Dir A");
                    self.camera.moveX(-self.actualSpeed);
                    break;
                case 68:
                    console.log("KeyDown   - Dir D");
                    self.camera.moveX(self.actualSpeed);
                    break;
            }
        };

        this.keyFunctionUp = function(e) {
            self.actualSpeed = 0;
        };

        window.addEventListener("keydown", this.keyFunctionDown, false);
        window.addEventListener("keyup", this.keyFunctionUp, false);
    }
}

class CameraController{
    constructor(gl,camera){
        let self = this;
        let box = gl.canvas.getBoundingClientRect();
        this.canvas = gl.canvas;						//Need access to the canvas html element, main to access events
        this.camera = camera;							//Reference to the camera to control

        this.rotateRate = -300;							//How fast to rotate, degrees per dragging delta
        this.panRate = 5;								//How fast to pan, max unit per dragging delta
        this.zoomRate = 200;							//How fast to zoom or can be viewed as forward/backward movement

        this.offsetX = box.left;						//Help calc global x,y mouse cords.
        this.offsetY = box.top;

        this.initX = 0;									//Starting X,Y position on mouse down
        this.initY = 0;
        this.prevX = 0;									//Previous X,Y position on mouse move
        this.prevY = 0;

        this.onUpHandler = function(e){
            self.onMouseUp(e);
        };

        this.onMoveHandler = function(e){
            self.onMouseMove(e);
        };

        this.canvas.addEventListener("mousedown",function(e){ self.onMouseDown(e); });		//Initializes the up and move events
        this.canvas.addEventListener("mousewheel", function(e){ self.onMouseWheel(e); });	//Handles zoom/forward movement
    }

    //Transform mouse x,y cords to something useable by the canvas.
    getMouseVec2(e){ return {x:e.pageX - this.offsetX, y:e.pageY - this.offsetY}; }

    //Begin listening for dragging movement
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
        let delta = Math.max(-1, Math.min(1, (e.wheelDelta || -e.detail))); //Try to map wheel movement to a number between -1 and 1
        this.camera.panZ(delta * (this.zoomRate / this.canvas.height));		//Keep the movement speed the same, no matter the height diff
    }

    onMouseMove(e){
        let x = e.pageX - this.offsetX,	//Get X,y where the canvas's position is origin.
            y = e.pageY - this.offsetY,
            dx = x - this.prevX,		//Difference since last mouse move
            dy = y - this.prevY;

        //When shift is being helt down, we pan around else we rotate.
        if(!e.shiftKey){
            this.camera.transform.rotation[1] += -dx * (this.rotateRate / this.canvas.height);
            this.camera.transform.rotation[0] += -dy * (this.rotateRate / this.canvas.height);
        }else{
            this.camera.panX( -dx * (this.panRate / this.canvas.width) );
            this.camera.panY( dy * (this.panRate / this.canvas.height) );
        }

        this.prevX = x;
        this.prevY = y;
    }
}