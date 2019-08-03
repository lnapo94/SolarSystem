class Shader {
    // Shaders Constant
    static ATTR_POSITION_NAME	= "a_position";
    static ATTR_POSITION_LOC	= 0;
    static ATTR_NORMAL_NAME	    = "a_norm";
    static ATTR_NORMAL_LOC		= 1;
    static ATTR_UV_NAME		    = "a_uv";
    static ATTR_UV_LOC			= 2;

    constructor(gl, vsURL, fsURL, validate = false) {
        this.gl = gl;
        let self = this;
        ShaderUtil.loadFiles([vsURL, fsURL], function (shaders) {
            let vs = ShaderUtil.createShader(gl, gl.VERTEX_SHADER, shaders[0]);
            let fs = ShaderUtil.createShader(gl, gl.FRAGMENT_SHADER, shaders[1]);
            self.program = ShaderUtil.createProgram(gl, vs, fs, validate);
        });

        gl.useProgram(this.program);

        this.attributeLocation = {
            position: gl.getAttribLocation(this.program, Shader.ATTR_POSITION_NAME),
            normals: gl.getAttribLocation(this.program, Shader.ATTR_NORMAL_NAME),
            uvs: gl.getAttribLocation(this.program, Shader.ATTR_UV_NAME)
        };

        this.uniformLocation = {
            perspectiveMatrix: gl.getUniformLocation(this.program, 'uPMatrix'),
            modelMatrix: gl.getUniformLocation(this.program,"uMVMatrix"),
            cameraMatrix: gl.getUniformLocation(this.program,"uCameraMatrix"),
            mainTexture: gl.getUniformLocation(this.program,"uMainTex")
        }
    }

    setPerspective(matData){
        this.gl.uniformMatrix4fv(this.uniformLocation.perspectiveMatrix, false, matData);
        return this;
    }

    setModelMatrix(matData){
        this.gl.uniformMatrix4fv(this.uniformLocation.modelMatrix, false, matData);
        return this;
    }
    setCameraMatrix(matData){
        this.gl.uniformMatrix4fv(this.uniformLocation.cameraMatrix, false, matData);
        return this;
    }

    enable() {
        this.gl.useProgram(this.program);
        return this;
    }

    disable() {
        this.gl.useProgram(null);
        return this;
    }

    renderModel(model) {
        this.setModelMatrix(model.transform.getViewMatrix());

        this.gl.bindVertexArray(model.mesh.vao);

        if(model.mesh.noCulling)
            this.gl.disable(this.gl.CULL_FACE);
        if(model.mesh.doBlending)
            this.gl.enable(this.gl.BLEND);

        if(model.mesh.indexCount)
            this.gl.drawElements(model.mesh.drawMode, model.mesh.indexCount, this.gl.UNSIGNED_SHORT, 0);
        else
            this.gl.drawArrays(model.mesh.drawMode, 0, model.mesh.vertexCount);

        if(model.mesh.noCulling)
            this.gl.enable(this.gl.CULL_FACE);
        if(model.mesh.doBlending)
            this.gl.disable(this.gl.BLEND);

        this.gl.bindVertexArray(null);
        return this;
    }
}

class ShaderUtil {

    static loadFile(url, data, callback) {
        // Set up an synchronous request! Important!
        let request = new XMLHttpRequest();
        request.open('GET', url, false);

        // Hook the event that gets called as the request progresses
        request.onreadystatechange = function () {
            // If the request is "DONE" (completed or failed) and if we got HTTP status 200 (OK)
            if (request.readyState === 4 && request.status === 200) {
                callback(request.responseText, data);
            }
        };
        request.send(null);
    }

    static loadFiles(urls, callback) {
        let numUrls = urls.length;
        let numComplete = 0;
        let result = [];

        // Callback for a single file
        function partialCallback(text, urlIndex) {
            result[urlIndex] = text;
            numComplete++;

            // When all files have downloaded
            if (numComplete === numUrls) {
                callback(result);
            }
        }

        for (let i = 0; i < numUrls; i++) {
            this.loadFile(urls[i], i, partialCallback);
        }
    }

    static createShader(gl, type, source) {
        let shader = gl.createShader(type);
        gl.shaderSource(shader, source);
        gl.compileShader(shader);

        if(gl.getShaderParameter(shader, gl.COMPILE_STATUS))
            return shader;
        else {
            console.log(gl.getShaderInfoLog(shader));
            gl.deleteShader(shader);
            throw ("Program failed to Compile:" + gl.getShaderInfoLog(shader));
        }
    }

    static createProgram(gl, vertexShader, fragmentShader, validate=false) {
        let program = gl.createProgram();
        gl.attachShader(program, vertexShader);
        gl.attachShader(program, fragmentShader);

        gl.bindAttribLocation(program, Shader.ATTR_POSITION_LOC, Shader.ATTR_POSITION_NAME);
        gl.bindAttribLocation(program, Shader.ATTR_NORMAL_LOC, Shader.ATTR_NORMAL_NAME);
        gl.bindAttribLocation(program, Shader.ATTR_UV_LOC, Shader.ATTR_UV_NAME);

        gl.linkProgram(program);

        if(!gl.getProgramParameter(program, gl.LINK_STATUS)) {
            console.log(gl.getProgramInfoLog(program));  // eslint-disable-line
            gl.deleteProgram(program);
            throw ("Program failed to Link:" + gl.getProgramInfoLog (program));
        }

        if(validate && gl.getProgramParameter(program, gl.LINK_STATUS)) {
            gl.validateProgram(program);
            if(!gl.getProgramParameter(program ,gl.VALIDATE_STATUS)){
                console.error("Error validating program", gl.getProgramInfoLog(program));
            }
        }
        return program;
    }
}