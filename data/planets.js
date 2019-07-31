export class Object {
    constructor(vArray, vtArray, vnArray, idxArray, textureSrc) {

        this.vArray = vArray;
        this.vtArray = vtArray;
        this.vnArray = vnArray;
        this.idxArray = idxArray;
        this.textureSrc = textureSrc;

    }

    _bindTexture(){
        var image = new Image();
        image.src = this.textureSrc;
        image.addEventListener('load', function() {
            // Now that the image has loaded make copy it to the texture.
            G_gl.bindTexture(G_gl.TEXTURE_2D, texture);
            G_gl.texImage2D(G_gl.TEXTURE_2D, 0, G_gl.RGBA, G_gl.RGBA,G_gl.UNSIGNED_BYTE, image);
            G_gl.generateMipmap(G_gl.TEXTURE_2D);
        });
    }

    _prepareTexture(){
        // Create a texture.
        var texture = G_gl.createTexture();
        G_gl.bindTexture(G_gl.TEXTURE_2D, texture);
        // Fill the texture with a 1x1 blue pixel.
        G_gl.texImage2D(G_gl.TEXTURE_2D, 0, G_gl.RGBA, 1, 1, 0, G_gl.RGBA, G_gl.UNSIGNED_BYTE,
            new Uint8Array([0, 0, 255, 255]));
        // bind the real texture
        this._bindTexture()
    }

    _setGeometry(){
        G_gl.bufferData(G_gl.ARRAY_BUFFER, new Float32Array(this.vArray), G_gl.STATIC_DRAW);
    }

    _setTextureCoords(){
        G_gl.bufferData(G_gl.ARRAY_BUFFER, new Float32Array(this.vtArray), G_gl.STATIC_DRAW);
    }

    _setElements(){
        G_gl.bufferData(G_gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(this.idxArray), G_gl.STATIC_DRAW);

    }
    lookup(){
        this.positionLocation = G_gl.getAttribLocation(G_program, "a_position");
        this.textureLocation =  G_gl.getAttribLocation(G_program, "a_texcoords");

        this.positionBuffer = G_gl.createBuffer();
        // Bind it to ARRAY_BUFFER (think of it as ARRAY_BUFFER = positionBuffer)
        G_gl.bindBuffer(G_gl.ARRAY_BUFFER, this.positionBuffer);
        // Put the positions in the buffer
        this._setGeometry();

        // provide texture coordinates for the rectangle.
        this.textcoordBuffer = G_gl.createBuffer();
        G_gl.bindBuffer(G_gl.ARRAY_BUFFER, this.textcoordBuffer);
        this._setTextureCoords();

        this.elementBuffer = G_gl.createBuffer();
        G_gl.bindBuffer(G_gl.ELEMENT_ARRAY_BUFFER, this.elementBuffer);


        this._prepareTexture();
    }


    render(){
        // read vertexes.
        G_gl.bindBuffer(G_gl.ARRAY_BUFFER, this.positionBuffer);
        G_gl.enableVertexAttribArray(this.positionLocation);
        G_gl.vertexAttribPointer(
            this.positionLocation, 3, G_gl.FLOAT, false, 0, 0);

        // read texture
        G_gl.bindBuffer(G_gl.ARRAY_BUFFER, this.textcoordBuffer);
        G_gl.enableVertexAttribArray(this.textureLocation);
        G_gl.vertexAttribPointer(
            this.textureLocation, 2, G_gl.FLOAT, false, 0, 0);

        //bind elements
        G_gl.bindBuffer(G_gl.ELEMENT_ARRAY_BUFFER, this.elementBuffer);


        //draw object
        const vertexCount = this.vArray.length;
        const type = G_gl.UNSIGNED_SHORT;
        const offset = 0;
        G_gl.drawElements(G_gl.TRIANGLES, vertexCount, type, offset);

    }
}