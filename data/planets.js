export class Object {
    constructor(mesh, textureSrc) {

        this.vArray = mesh.vertices;
        this.vtArray = mesh.textures;
        this.vnArray = mesh.vertexNormals;
        this.idxArray = mesh.indices;
        this.textureSrc = textureSrc;
        this.modelViewMatrix = mat4.create();

    }

    setModelViewMatrix(mvm){
        this.modelViewMatrix = mvm;
    }

    getModelViewMatrix(mvm){
        return this.modelViewMatrix.copy()
    }

    _bindTexture(){
            // Now that the image has loaded make copy it to the texture.
            G_gl.activeTexture(G_gl.TEXTURE0);
            G_gl.bindTexture(G_gl.TEXTURE_2D, this.texture);
            G_gl.texParameteri(G_gl.TEXTURE_2D, G_gl.TEXTURE_MAG_FILTER, G_gl.LINEAR);
            G_gl.texParameteri(G_gl.TEXTURE_2D, G_gl.TEXTURE_MIN_FILTER, G_gl.LINEAR);
            G_gl.texParameteri(G_gl.TEXTURE_2D, G_gl.TEXTURE_WRAP_S, G_gl.CLAMP_TO_EDGE);
            G_gl.texParameteri(G_gl.TEXTURE_2D, G_gl.TEXTURE_WRAP_T, G_gl.CLAMP_TO_EDGE);
            G_gl.texImage2D(G_gl.TEXTURE_2D, 0, G_gl.RGBA, G_gl.RGBA,G_gl.UNSIGNED_BYTE, this.textureImage);
            //G_gl.generateMipmap(G_gl.TEXTURE_2D);
            console.log("texture loaded")
        }

    _prepareTexture(){

        // preparing uvmap for a fallback texture
        this._setTextureCoords();

        // Create a texture.
        G_gl.bindTexture(G_gl.TEXTURE_2D, this.texture);
        // Fill the texture with a 1x1 blue pixel.
        G_gl.texImage2D(G_gl.TEXTURE_2D, 0, G_gl.RGBA, 1, 1, 0, G_gl.RGBA, G_gl.UNSIGNED_BYTE,
            new Uint8Array([0, 0, 255, 255]));

        // bind the real texture
        this.textureImage = new Image();
        this.textureImage.src = this.textureSrc;
        this.textureImage.addEventListener('load', this._bindTexture());
    }

    _setGeometry(){
        G_gl.bindBuffer(G_gl.ARRAY_BUFFER, this.positionBuffer);
        G_gl.bufferData(G_gl.ARRAY_BUFFER, new Float32Array(this.vArray), G_gl.STATIC_DRAW);
    }

    _setTextureCoords(){
        G_gl.bindBuffer(G_gl.ARRAY_BUFFER, this.textcoordBuffer);
        G_gl.bufferData(G_gl.ARRAY_BUFFER, new Float32Array(this.vtArray), G_gl.STATIC_DRAW);
    }

    _setElements(){
        G_gl.bindBuffer(G_gl.ELEMENT_ARRAY_BUFFER, this.elementBuffer);
        G_gl.bufferData(G_gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(this.idxArray), G_gl.STATIC_DRAW);

    }
    lookup(){
        // TODO NEED TO MOVE THIS STUFF ON A NEW 'PROGRAM' CLASS
        this.positionLocation = G_gl.getAttribLocation(G_program, "a_position");
        this.textureLocation =  G_gl.getAttribLocation(G_program, "a_texcoord");
        this.modelViewMatrixLocation = G_gl.getUniformLocation(G_program, 'uModelViewMatrix');
        this.projectionMatrixLocation = G_gl.getUniformLocation(G_program, 'uProjectionMatrix');
        this.samplerLocation = G_gl.getUniformLocation(G_program, "u_texture");
        // TODO END OF STUFF NEEDED TO BE MOVED

        this.positionBuffer = G_gl.createBuffer();
        this.textcoordBuffer = G_gl.createBuffer();
        this.elementBuffer = G_gl.createBuffer();
        this.texture = G_gl.createTexture();

        this._prepareTexture();
    }


    render(projectionMatrix){
        G_gl.useProgram(G_program);

        // read vertexes.
        this._setGeometry();
        this._setTextureCoords();
        this._setElements();

        G_gl.enableVertexAttribArray(this.positionLocation)
        G_gl.bindBuffer(G_gl.ARRAY_BUFFER, this.positionBuffer);
        G_gl.vertexAttribPointer(
            this.positionLocation, 3, G_gl.FLOAT, false, 0, 0);

        // read texture
        G_gl.enableVertexAttribArray(this.textureLocation);
        G_gl.bindBuffer(G_gl.ARRAY_BUFFER, this.textcoordBuffer);
        G_gl.vertexAttribPointer(
           this.textureLocation, 2, G_gl.FLOAT, false, 0, 0);


        //bind elements
        G_gl.bindBuffer(G_gl.ELEMENT_ARRAY_BUFFER, this.elementBuffer);
        //draw object

        G_gl.uniformMatrix4fv(
            this.projectionMatrixLocation,
            false,
            projectionMatrix);

        console.log('sending uniform');
        console.log(this.modelViewMatrix);
        G_gl.uniformMatrix4fv(
            this.modelViewMatrixLocation,
            false,
            this.modelViewMatrix);


        G_gl.activeTexture(G_gl.TEXTURE0);
        G_gl.bindTexture(G_gl.TEXTURE_2D, this.texture);
        G_gl.uniform1i(this.samplerLocation, 0);

        G_gl.drawElements(G_gl.TRIANGLES, this.idxArray.length, G_gl.UNSIGNED_SHORT, 0);

    }
}