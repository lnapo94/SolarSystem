class Model {

    constructor(gl) {
        this.gl = gl;
        this.noCulling = false;
        this.doBlending = false;

        this.mesh = {};

        // This class actually contains the information about the position in the world of the current model
        this.transform = new Transform();
    }

    loadMeshFromJSON(meshJson) {
        let vertices = meshJson.vertices;
        let indices = [].concat.apply([], meshJson.faces);
        let UVs = meshJson.texturecoords[0];
        let normals = meshJson.normals;
        this.setupBuffers(vertices, indices, normals, UVs);

        return this;
    }

    loadMeshFromOBJ(obj){
        let meshResource = new OBJ.Mesh(obj);
        this.setupBuffers(
            meshResource.vertices,
            meshResource.indices,
            meshResource.vertexNormals,
            meshResource.textures)
    }

    loadShader(vsURL, fsURL, validate = false) {
        this.shader = new Shader(this.gl, vsURL, fsURL, validate);
        return this;
    }

    setupBuffers(vertices, indices, normals, uvs, verticesLength = 3) {
        this.mesh.drawMode = this.gl.TRIANGLES;

        //Create and bind vao
        this.mesh.vao = this.gl.createVertexArray();
        this.gl.bindVertexArray(this.mesh.vao);	//Bind it so all the calls to vertexAttribPointer/enableVertexAttribArray is saved to the vao.

        //.......................................................
        //Set up vertices
        if(vertices !== undefined && vertices !== null){
            this.mesh.bufVertices = this.gl.createBuffer();													//Create buffer...
            this.mesh.vertexComponentLen = verticesLength;																//How many floats make up a vertex
            this.mesh.vertexCount = vertices.length / this.mesh.vertexComponentLen;								//How many vertices in the array

            this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.mesh.bufVertices);
            this.gl.bufferData(this.gl.ARRAY_BUFFER, new Float32Array(vertices), this.gl.STATIC_DRAW);		//then push array into it.
            this.gl.enableVertexAttribArray(Shader.ATTR_POSITION_LOC);										//Enable Attribute location
            this.gl.vertexAttribPointer(Shader.ATTR_POSITION_LOC,this.mesh.vertexComponentLen,this.gl.FLOAT,false,0,0);						//Put buffer at location of the vao
        }

        //.......................................................
        //Setup normals
        if(normals !== undefined && normals !== null){
            this.mesh.bufNormals = this.gl.createBuffer();
            this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.mesh.bufNormals);
            this.gl.bufferData(this.gl.ARRAY_BUFFER, new Float32Array(normals), this.gl.STATIC_DRAW);
            this.gl.enableVertexAttribArray(Shader.ATTR_NORMAL_LOC);
            this.gl.vertexAttribPointer(Shader.ATTR_NORMAL_LOC,3,this.gl.FLOAT,false, 0,0);
        }

        //.......................................................
        //Setup UV
        if(uvs !== undefined && uvs !== null){
            this.mesh.bufUV = this.gl.createBuffer();
            this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.mesh.bufUV);
            this.gl.bufferData(this.gl.ARRAY_BUFFER, new Float32Array(uvs), this.gl.STATIC_DRAW);
            this.gl.enableVertexAttribArray(Shader.ATTR_UV_LOC);
            this.gl.vertexAttribPointer(Shader.ATTR_UV_LOC,2,this.gl.FLOAT,false,0,0);	//UV only has two floats per component
        }

        //.......................................................
        //Setup Index.
        if(indices !== undefined && indices !== null){
            this.mesh.bufIndex = this.gl.createBuffer();
            this.mesh.indexCount = indices.length;
            this.gl.bindBuffer(this.gl.ELEMENT_ARRAY_BUFFER, this.mesh.bufIndex);
            this.gl.bufferData(this.gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(indices), this.gl.STATIC_DRAW);
        }

        //Clean up
        this.gl.bindVertexArray(null);					//Unbind the VAO, very Important. always unbind when your done using one.
        this.gl.bindBuffer(this.gl.ARRAY_BUFFER,null);	//Unbind any buffers that might be set
        if(indices != null)  this.gl.bindBuffer(this.gl.ELEMENT_ARRAY_BUFFER,null);
        return this;
    }

    loadTexture(image, doYFlip = false) {

        // Create a texture
        this.texture = this.gl.createTexture();

        // If you need to flip upside down the texture on the Y axis
        if(doYFlip)
            this.gl.pixelStorei(this.gl.UNPACK_FLIP_Y_WEBGL, true);

        // Bind the texture and send to the gpu the image
        this.gl.bindTexture(this.gl.TEXTURE_2D, this.texture);
        this.gl.texImage2D(this.gl.TEXTURE_2D, 0, this.gl.RGBA, this.gl.RGBA, this.gl.UNSIGNED_BYTE, image);

        // Set the parameters to fill up the texture if needed
        this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_MAG_FILTER, this.gl.LINEAR);
        this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_MIN_FILTER, this.gl.LINEAR_MIPMAP_NEAREST);
        this.gl.generateMipmap(this.gl.TEXTURE_2D);

        // Unbind
        this.gl.bindTexture(this.gl.TEXTURE_2D, null);

        // Restore the y flipping setting
        if(doYFlip)
            this.gl.pixelStorei(this.gl.UNPACK_FLIP_Y_WEBGL, false);

        return this;
    }

    setShaderPerspective(perspectiveMatrix) {
        this.shader.enable().setPerspective(perspectiveMatrix).disable();
        return this;
    }

    render(cameraMatrix, useEulerAngles = false) {

        // Refresh the matrix
        this.transform.updateMatrix(useEulerAngles);

        // Enable the shader
        this.shader.enable();

        // Send the texture
        this.shader.setTexture(this.texture);

        // Set the camera matrix
        this.shader.setCameraMatrix(cameraMatrix);

        // Actual Render
        this.shader.setModelMatrix(this.transform.getViewMatrix());

        // Enable correct VAO
        this.gl.bindVertexArray(this.mesh.vao);

        // If the mesh need some options to be properly drawn
        if(this.noCulling)
            this.gl.disable(this.gl.CULL_FACE);
        if(this.doBlending)
            this.gl.enable(this.gl.BLEND);

        // If the mesh has indices, draw elements, otherwise draw arrays
        if(this.mesh.indexCount)
            this.gl.drawElements(this.mesh.drawMode, this.mesh.indexCount, this.gl.UNSIGNED_SHORT, 0);
        else
            this.gl.drawArrays(this.mesh.drawMode, 0, this.mesh.vertexCount);

        // Disable the option previously enabled
        if(this.noCulling)
            this.gl.enable(this.gl.CULL_FACE);
        if(this.doBlending)
            this.gl.disable(this.gl.BLEND);

        this.gl.bindVertexArray(null);

        this.shader.disable();

        return this;
    }

    setAnimationCallback(callback) {
        this.callback = callback;
    }

    animate(deltaTime) {
        let self = this;
        this.callback(deltaTime, self);
    }

}