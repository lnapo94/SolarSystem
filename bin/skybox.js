class Skybox {
    constructor(vsURL, fsURL, textureURL) {
        let self = this;

        // The program for the skybox
        this.program = null;

        // Setup the position of the skybox vertices
        this.positions = [
            -1, -1,
            1, -1,
            -1,  1,
            -1,  1,
            1, -1,
            1,  1,
        ];

        // Load the shaders and create the program for the skybox
        utils.loadFiles([vsURL, fsURL], function (shaders) {
            let vs = utils.createShader(gl, gl.VERTEX_SHADER, shaders[0]);
            let fs = utils.createShader(gl, gl.FRAGMENT_SHADER, shaders[1]);
            self.program = utils.createProgram(gl, vs, fs);
        });

        this.faceInfos = [
            {
                target: gl.TEXTURE_CUBE_MAP_POSITIVE_X,
                url: textureURL + '/px.png'
            },
            {
                target: gl.TEXTURE_CUBE_MAP_NEGATIVE_X,
                url: textureURL + '/nx.png'
            },
            {
                target: gl.TEXTURE_CUBE_MAP_POSITIVE_Y,
                url: textureURL + '/py.png'
            },
            {
                target: gl.TEXTURE_CUBE_MAP_NEGATIVE_Y,
                url: textureURL + '/ny.png'
            },
            {
                target: gl.TEXTURE_CUBE_MAP_POSITIVE_Z,
                url: textureURL + '/nz.png'
            },
            {
                target: gl.TEXTURE_CUBE_MAP_NEGATIVE_Z,
                url: textureURL + '/pz.png'
            }
        ];

        // Create vao for the skybox
        this.vao = gl.createVertexArray();
    }

    setupBuffer() {

        this.positionLocation = gl.getAttribLocation(this.program, 'a_position');
        this.skyboxLocation = gl.getUniformLocation(this.program, 'u_skybox');
        this.viewDirectionProjectionInverseLocation = gl.getUniformLocation(this.program, 'u_viewDirectionProjectionInverse');

        let positionBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(this.positions), gl.STATIC_DRAW);
        gl.enableVertexAttribArray(this.positionLocation);
        gl.vertexAttribPointer(positionLocation, 2, gl.FLOAT, false, 0, 0);

        let texture = gl.createTexture();
        gl.bindTexture(gl.TEXTURE_CUBE_MAP, texture);

        this.faceInfos.forEach((face) => {
            const {target, url} = face;

            gl.texImage2D(target, 0, gl.RGBA, 2048, 2048, 0, gl.RGBA, gl.UNSIGNED_BYTE, null);

            const image = new Image();
            image.src = url;
            image.onload = function () {
                gl.bindTexture(gl.TEXTURE_CUBE_MAP, texture);
                gl.texImage2D(target, 0, gl.RGBA, 2048, 2048, 0, gl.RGBA, gl.UNSIGNED_BYTE, image);
                gl.generateMipmap(gl.TEXTURE_CUBE_MAP);
            }
        });
        gl.generateMipmap(gl.TEXTURE_CUBE_MAP);
        gl.texParameteri(gl.TEXTURE_CUBE_MAP, gl.TEXTURE_MIN_FILTER, gl.LINEAR_MIPMAP_LINEAR);


    }

    draw() {
        gl.useProgram(this.program);

        gl.bindVertexArray(this.vao);

        let aspect = gl.canvas.clientWidth / gl.canvas.clientHeight;

        let projectionMatrix = utils.MakePerspective(60, aspect, 1, 2000.0);

        let cameraPosition = [0, 0, 0];
        let target = [0, 0, 0];
        let up = [0, 1, 0];

        let cameraMatrix = m4.lookAt(cameraPosition, target, up);

        let viewMatrix = m4.inverse(cameraMatrix);

        viewMatrix[12] = 0;
        viewMatrix[13] = 0;
        viewMatrix[14] = 0;

        var viewDirectionProjectionMatrix =
            m4.multiply(projectionMatrix, viewMatrix);
        var viewDirectionProjectionInverseMatrix =
            m4.inverse(viewDirectionProjectionMatrix);

        gl.uniformMatrix4fv(this.viewDirectionProjectionInverseLocation, false, viewDirectionProjectionInverseMatrix);
        gl.uniform1i(this.skyboxLocation, 0);

        gl.drawArrays(gl.TRIANGLES, 0, 6);
    }
}