class Mesh {
    constructor(gl) {
        this.gl = gl;
        this.noCulling = false;
        this.doBlending = false;
    }

    createArrayBuffer = function(array, isStatic = true){
        let buffer = this.gl.createBuffer();
        this.bindBuffer(this.gl.ARRAY_BUFFER, buffer);
        this.bufferData(this.gl.ARRAY_BUFFER, array, (isStatic)? this.gl.STATIC_DRAW : this.gl.DYNAMIC_DRAW );
        this.bindBuffer(this.gl.ARRAY_BUFFER,null);
        return buffer;
    };

    createMeshVAO(vertices, indices, normals, uvs, verticesLength = 3) {
        this.drawMode = this.gl.TRIANGLES;

        //Create and bind vao
        this.vao = this.gl.createVertexArray();
        this.gl.bindVertexArray(this.vao);	//Bind it so all the calls to vertexAttribPointer/enableVertexAttribArray is saved to the vao.

        //.......................................................
        //Set up vertices
        if(vertices !== undefined && vertices != null){
            this.bufVertices = this.gl.createBuffer();													//Create buffer...
            this.vertexComponentLen = verticesLength;																//How many floats make up a vertex
            this.vertexCount = vertices.length / this.vertexComponentLen;								//How many vertices in the array

            this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.bufVertices);
            this.gl.bufferData(this.gl.ARRAY_BUFFER, new Float32Array(vertices), this.gl.STATIC_DRAW);		//then push array into it.
            this.gl.enableVertexAttribArray(Shader.ATTR_POSITION_LOC);										//Enable Attribute location
            this.gl.vertexAttribPointer(Shader.ATTR_POSITION_LOC,this.vertexComponentLen,this.gl.FLOAT,false,0,0);						//Put buffer at location of the vao
        }

        //.......................................................
        //Setup normals
        if(normals !== undefined && normals != null){
            this.bufNormals = this.gl.createBuffer();
            this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.bufNormals);
            this.gl.bufferData(this.gl.ARRAY_BUFFER, new Float32Array(normals), this.gl.STATIC_DRAW);
            this.gl.enableVertexAttribArray(Shader.ATTR_NORMAL_LOC);
            this.gl.vertexAttribPointer(Shader.ATTR_NORMAL_LOC,3,this.gl.FLOAT,false, 0,0);
        }

        //.......................................................
        //Setup UV
        if(uvs !== undefined && uvs != null){
            this.bufUV = this.gl.createBuffer();
            this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.bufUV);
            this.gl.bufferData(this.gl.ARRAY_BUFFER, new Float32Array(uvs), this.gl.STATIC_DRAW);
            this.gl.enableVertexAttribArray(Shader.ATTR_UV_LOC);
            this.gl.vertexAttribPointer(Shader.ATTR_UV_LOC,2,this.gl.FLOAT,false,0,0);	//UV only has two floats per component
        }

        //.......................................................
        //Setup Index.
        if(indices !== undefined && indices != null){
            this.bufIndex = this.gl.createBuffer();
            this.indexCount = indices.length;
            this.gl.bindBuffer(this.gl.ELEMENT_ARRAY_BUFFER, this.bufIndex);
            this.gl.bufferData(this.gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(indices), this.gl.STATIC_DRAW);
        }

        //Clean up
        this.gl.bindVertexArray(null);					//Unbind the VAO, very Important. always unbind when your done using one.
        this.gl.bindBuffer(this.gl.ARRAY_BUFFER,null);	//Unbind any buffers that might be set
        if(indices != null)  this.gl.bindBuffer(this.gl.ELEMENT_ARRAY_BUFFER,null);

        return this;
    }

}