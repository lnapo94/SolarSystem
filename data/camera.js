class Camera{
    constructor(gl,fov = 45, near = 0.1, far = 100.0 ){
        //Setup the perspective matrix
        this.projectionMatrix = mat4.create();
        let ratio = gl.canvas.clientWidth / gl.canvas.clientHeight;

        mat4.perspective(this.projectionMatrix, fov * Math.PI / 180, ratio, near, far);

        this.transform = new Transform();
        this.viewMatrix = mat4.create();

        this.mode = Camera.MODE_FREE;
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

    panX(v){
        if(this.mode === Camera.MODE_ORBIT) return;
        this.updateViewMatrix();
        this.transform.position[0] += this.transform.right[0] * v;
        this.transform.position[1] += this.transform.right[1] * v;
        this.transform.position[2] += this.transform.right[2] * v;
    }

    panY(v){
        this.updateViewMatrix();
        this.transform.position[1] += this.transform.up[1] * v;
        if(this.mode === Camera.MODE_ORBIT) return;
        this.transform.position[0] += this.transform.up[0] * v;
        this.transform.position[2] += this.transform.up[2] * v;
    }

    panZ(v){
        this.updateViewMatrix();
        if(this.mode === Camera.MODE_ORBIT){
            this.transform.position[2] += v;
        }else{
            this.transform.position[0] += this.transform.forward[0] * v;
            this.transform.position[1] += this.transform.forward[1] * v;
            this.transform.position[2] += this.transform.forward[2] * v;
        }
    }

    //To have different modes of movements, this function handles the view matrix update for the transform object.
    updateViewMatrix(){
        if(this.mode === Camera.MODE_FREE){

            mat4.identity(this.transform.matView);
            mat4.translate(this.transform.matView, this.transform.matView, this.transform.position);
            mat4.rotateX(this.transform.matView, this.transform.matView, this.transform.rotation[0] * Math.PI / 180);
            mat4.rotateY(this.transform.matView, this.transform.matView, this.transform.rotation[1] * Math.PI / 180);

        }else{
            mat4.identity(this.transform.matView);
            mat4.rotateX(this.transform.matView, this.transform.matView, this.transform.rotation[0] * Math.PI / 180);
            mat4.rotateY(this.transform.matView, this.transform.matView, this.transform.rotation[1] * Math.PI / 180);
            mat4.translate(this.transform.matView, this.transform.matView, this.transform.position);
        }

        this.transform.updateDirection();

        mat4.invert(this.viewMatrix, this.transform.matView);
        return this.viewMatrix;
    }
}

class CameraController {
    constructor(gl, camera) {
        let self = this;
        this.canvas = gl.canvas;
        this.camera = camera;

        this.maxSpeed = 20;
        this.deltaSpeed = 0.01;
        this.actualSpeed = 0;

        this.keyFunctionDown = function (e) {

            if(self.actualSpeed <= self.maxSpeed)
                self.actualSpeed += self.deltaSpeed;
            switch(e.keyCode) {
                case 37:
                    console.log("KeyDown   - Dir LEFT");
                    self.camera.rotationY(self.actualSpeed);
                    break;
                case 39:
                    console.log("KeyDown   - Dir RIGHT");
                    self.camera.rotationY(-self.actualSpeed);
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