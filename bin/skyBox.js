class SkyBox extends Model{

    constructor(gl,width = 50000 ,height = 50000, depth = 50000, x = 0,y = 0,z = 0) {
        super(gl);

        // Setup the position of the Skybox
        this.transform.setPosition(x, y, z);

        // Skybox needs no culling
        this.noCulling = true;

        // Compute vertices, indeces, normals and uvs
        let w = width*0.5, h = height*0.5, d = depth*0.5;
        let x0 = x-w, x1 = x+w, y0 = y-h, y1 = y+h, z0 = z-d, z1 = z+d;

        //Starting bottom left corner, then working counter clockwise to create the front face.
        //Backface is the first face but in reverse (3,2,1,0)
        //keep each quad face built the same way to make index and uv easier to assign
        this.vertices = [
            x0, y1, z1, 0,	//0 Front
            x0, y0, z1, 0,	//1
            x1, y0, z1, 0,	//2
            x1, y1, z1, 0,	//3

            x1, y1, z0, 1,	//4 Back
            x1, y0, z0, 1,	//5
            x0, y0, z0, 1,	//6
            x0, y1, z0, 1,	//7

            x0, y1, z0, 2,	//7 Left
            x0, y0, z0, 2,	//6
            x0, y0, z1, 2,	//1
            x0, y1, z1, 2,	//0

            x0, y0, z1, 3,	//1 Bottom
            x0, y0, z0, 3,	//6
            x1, y0, z0, 3,	//5
            x1, y0, z1, 3,	//2

            x1, y1, z1, 4,	//3 Right
            x1, y0, z1, 4,	//2
            x1, y0, z0, 4,	//5
            x1, y1, z0, 4,	//4

            x0, y1, z0, 5,	//7 Top
            x0, y1, z1, 5,	//0
            x1, y1, z1, 5,	//3
            x1, y1, z0, 5	//4
        ];

        //Build the index of each quad [0,1,2, 2,3,0]
        this.indices = [];
        for(let i=0; i < this.vertices.length / 4; i+=2) this.indices.push(i+1, i, (Math.floor(i/4)*4)+((i+2)%4));

        //Build UV data for each vertex
        this.uvs = [];
        for(let i=0; i < 6; i++) this.uvs.push(0,0,	0,1,  1,1,  1,0);

        //Build Normal data for each vertex
        this.normals = [
            0, 0, 1,	 0, 0, 1,	 0, 0, 1,	 0, 0, 1,		//Front
            0, 0,-1,	 0, 0,-1,	 0, 0,-1,	 0, 0,-1,		//Back
            -1, 0, 0,	-1, 0, 0,	-1, 0,0 ,	-1, 0, 0,		//Left
            0,-1, 0,	 0,-1, 0,	 0,-1, 0,	 0,-1, 0,		//Bottom
            1, 0, 0,	 1, 0, 0,	 1, 0, 0,	 1, 0, 0,		//Right
            0, 1, 0,	 0, 1, 0,	 0, 1, 0,	 0, 1, 0		//Top
        ];
        
    }

    // SkyBox needs a self defined uniform
    loadShader(vsURL, fsURL, validate = false) {
        super.loadShader(vsURL, fsURL, validate);
        this.shader.uniformLocation.tex = this.gl.getUniformLocation(this.shader.program,"uSkyTex");
        return this;
    }

    // The SkyBox is already loaded in the constructor, so the buffer setup is simpler
    setupBuffers() {
        super.setupBuffers(this.vertices, this.indices, this.normals, this.uvs, 4);
        return this;
    }

    // SkyBox needs a TEXTURE_CUBE_MAP loading, not a normal TEXTURE 2D
    loadTexture(imageArray) {
        /**
         *  Insert in the array the images in the following order:
         *      -   POSITIVE_X
         *      -   NEGATIVE_X
         *      -   POSITIVE_Y
         *      -   NEGATIVE_Y
         *      -   POSITIVE_Z
         *      -   NEGATIVE_Z
         */

        this.texture = this.gl.createTexture();
        this.gl.bindTexture(this.gl.TEXTURE_CUBE_MAP, this.texture);

        for(let i = 0; i < 6; i++)
            this.gl.texImage2D(this.gl.TEXTURE_CUBE_MAP_POSITIVE_X + i, 0, this.gl.RGBA, this.gl.RGBA, this.gl.UNSIGNED_BYTE, imageArray[i]);

        this.gl.texParameteri(this.gl.TEXTURE_CUBE_MAP, this.gl.TEXTURE_MAG_FILTER, this.gl.LINEAR);
        this.gl.texParameteri(this.gl.TEXTURE_CUBE_MAP, this.gl.TEXTURE_MIN_FILTER, this.gl.LINEAR);
        this.gl.texParameteri(this.gl.TEXTURE_CUBE_MAP, this.gl.TEXTURE_WRAP_S, this.gl.CLAMP_TO_EDGE);
        this.gl.texParameteri(this.gl.TEXTURE_CUBE_MAP, this.gl.TEXTURE_WRAP_T, this.gl.CLAMP_TO_EDGE);

        this.gl.bindTexture(this.gl.TEXTURE_CUBE_MAP, null);

        this.shader.setTexture = function (texture) {
            this.gl.activeTexture(this.gl.TEXTURE0);
            this.gl.bindTexture(this.gl.TEXTURE_CUBE_MAP, texture);
            this.gl.uniform1i(this.uniformLocation.tex,0);
            return this;
        };

        return this;
    }

}