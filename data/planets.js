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
            gl.bindTexture(gl.TEXTURE_2D, texture);
            gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA,gl.UNSIGNED_BYTE, image);
            gl.generateMipmap(gl.TEXTURE_2D);
        });
    }

    _prepareTexture(){
        // Create a texture.
        var texture = gl.createTexture();
        gl.bindTexture(gl.TEXTURE_2D, texture);
        // Fill the texture with a 1x1 blue pixel.
        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, 1, 1, 0, gl.RGBA, gl.UNSIGNED_BYTE,
            new Uint8Array([0, 0, 255, 255]));
        // bind the real texture
        this._bindTexture()
    }

    _setGeometry(){
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(this.vArray), gl.STATIC_DRAW);
    }

    _setTextureCoords(){
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(this.vtArray), gl.STATIC_DRAW);
    }

    _setElements(){
        gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(this.idxArray), gl.STATIC_DRAW);

    }
    lookup(){
        this.positionLocation = gl.getAttribLocation(program, "a_position");
        this.textureLocation =  gl.getAttribLocation(program, "a_texcoords");

        this.positionBuffer = gl.createBuffer();
        // Bind it to ARRAY_BUFFER (think of it as ARRAY_BUFFER = positionBuffer)
        gl.bindBuffer(gl.ARRAY_BUFFER, this.positionBuffer);
        // Put the positions in the buffer
        this._setGeometry();

        // provide texture coordinates for the rectangle.
        this.textcoordBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, this.textcoordBuffer);
        this._setTextureCoords();

        this.elementBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.elementBuffer);


        this._prepareTexture();
    }


    render(){
        // read vertexes.
        gl.bindBuffer(gl.ARRAY_BUFFER, this.positionBuffer);
        gl.enableVertexAttribArray(this.positionLocation);
        gl.vertexAttribPointer(
            this.positionLocation, 3, gl.FLOAT, false, 0, 0);

        // read texture
        gl.bindBuffer(gl.ARRAY_BUFFER, this.textcoordBuffer);
        gl.enableVertexAttribArray(this.textureLocation);
        gl.vertexAttribPointer(
            this.textureLocation, 2, gl.FLOAT, false, 0, 0);

        //bind elements
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.elementBuffer);


        //draw object
        const vertexCount = this.vArray.length;
        const type = gl.UNSIGNED_SHORT;
        const offset = 0;
        gl.drawElements(gl.TRIANGLES, vertexCount, type, offset);

    }
}