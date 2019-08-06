"use strict";

let utils = {

    // GENERIC FUNCTIONS TO RUN A PROGRAM
    createCanvas: function () {
        let canvas = document.createElement('canvas');
        canvas.setAttribute('id', 'canvas');
        document.querySelector('body').appendChild(canvas);
        return canvas;
    },

    resizeCanvasToDisplaySize: function (canvas, multiplier) {
        multiplier = multiplier || 1;
        const width  = canvas.clientWidth  * multiplier | 0;
        const height = canvas.clientHeight * multiplier | 0;
        if (canvas.width !== width || canvas.height !== height) {
            canvas.width  = width;
            canvas.height = height;
            return true;
        }
        return false;
    },

    createShader: function (gl, type, source) {
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
    },

    createProgram: function (gl, vertexShader, fragmentShader) {
        let program = gl.createProgram();
        gl.attachShader(program, vertexShader);
        gl.attachShader(program, fragmentShader);
        gl.linkProgram(program);

        if(gl.getProgramParameter(program, gl.LINK_STATUS))
            return program;
        else {
            console.log(gl.getProgramInfoLog(program));  // eslint-disable-line
            gl.deleteProgram(program);
            throw ("Program failed to Link:" + gl.getProgramInfoLog (program));
        }
    },

    get_json: function(url, func) {
        let xmlHttp = new XMLHttpRequest();
        xmlHttp.open("GET", url, false); // if true == asynchronous...
        xmlHttp.onreadystatechange = function() {
            if (xmlHttp.readyState == 4 && xmlHttp.status==200) {
                //the file is loaded. Parse it as JSON and launch function
                func(JSON.parse(xmlHttp.responseText));
            }
        };
        //send the request
        xmlHttp.send();
    },

    textureLoaderCallback: function() {
        let textureId = this.gl.createTexture();
        this.gl.activeTexture(this.gl.TEXTURE0 + this.txNum);
        this.gl.bindTexture(this.gl.TEXTURE_2D, textureId);
        this.gl.texImage2D(this.gl.TEXTURE_2D, 0, this.gl.RGBA, this.gl.RGBA, this.gl.UNSIGNED_BYTE, this);

        // set the filtering so we don't need mips
        this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_MIN_FILTER, this.gl.NEAREST);
        this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_MAG_FILTER, this.gl.NEAREST);
        this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_WRAP_S, this.gl.REPEAT);
        this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_WRAP_T, this.gl.REPEAT);
    },

    loadFile: function (url, data, callback, errorCallback) {
        // Set up an synchronous request! Important!
        let request = new XMLHttpRequest();
        request.open('GET', url, false);

        // Hook the event that gets called as the request progresses
        request.onreadystatechange = function () {
            // If the request is "DONE" (completed or failed) and if we got HTTP status 200 (OK)


            if (request.readyState == 4 && request.status == 200) {
                callback(request.responseText, data);
            }

        };

        request.send(null);
    },

    loadFiles: function (urls, callback, errorCallback) {
        let numUrls = urls.length;
        let numComplete = 0;
        let result = [];

        // Callback for a single file
        function partialCallback(text, urlIndex) {
            result[urlIndex] = text;
            numComplete++;

            // When all files have downloaded
            if (numComplete == numUrls) {
                callback(result);
            }
        }

        for (let i = 0; i < numUrls; i++) {
            this.loadFile(urls[i], i, partialCallback, errorCallback);
        }
    },

    requestCORSIfNotSameOrigin: function (img, url) {
        if ((new URL(url)).origin !== window.location.origin) {
            img.crossOrigin = "";
        }
    },

    createSphere: function (latitudeBands = 10, longitudeBands = 10, radius = 5.0) {

        let vertexPositionData = [];
        let normalData = [];
        let indexData = [];


        // Calculate sphere vertex positions and normals.
        for (let latNumber = 0; latNumber <= latitudeBands; ++latNumber) {
            let theta = latNumber * Math.PI / latitudeBands;
            let sinTheta = Math.sin(theta);
            let cosTheta = Math.cos(theta);

            for (let longNumber = 0; longNumber <= longitudeBands; ++longNumber) {
                let phi = longNumber * 2 * Math.PI / longitudeBands;
                let sinPhi = Math.sin(phi);
                let cosPhi = Math.cos(phi);

                let x = cosPhi * sinTheta;
                let y = cosTheta;
                let z = sinPhi * sinTheta;

                vertexPositionData.push(radius * x);
                vertexPositionData.push(radius * y);
                vertexPositionData.push(radius * z);

                normalData.push(x);
                normalData.push(y);
                normalData.push(z);
            }
        }

        // Calculate sphere indices.
        for (let latNumber = 0; latNumber < latitudeBands; ++latNumber) {
            for (let longNumber = 0; longNumber < longitudeBands; ++longNumber) {
                let first = (latNumber * (longitudeBands + 1)) + longNumber;
                let second = first + longitudeBands + 1;

                indexData.push(first);
                indexData.push(second);
                indexData.push(first + 1);

                indexData.push(second);
                indexData.push(second + 1);
                indexData.push(first + 1);
            }
        }

        return {
            vertices: vertexPositionData,
            indices: indexData,
            normals: normalData
        }
    },


    // MATH FUNCTIONS

    subtractVectors:function(a, b, dst) {
        dst = dst || new Float32Array(3);
        dst[0] = a[0] - b[0];
        dst[1] = a[1] - b[1];
        dst[2] = a[2] - b[2];
        return dst;
    },

    cross:function(a, b, dst) {
        dst = dst || new Float32Array(3);
        dst[0] = a[1] * b[2] - a[2] * b[1];
        dst[1] = a[2] * b[0] - a[0] * b[2];
        dst[2] = a[0] * b[1] - a[1] * b[0];
        return dst;
    },

    normalize: function(v, dst) {
        dst = dst || new Float32Array(3);
        let length = Math.sqrt(v[0] * v[0] + v[1] * v[1] + v[2] * v[2]);
        // make sure we don't divide by 0.
        if (length > 0.00001) {
            dst[0] = v[0] / length;
            dst[1] = v[1] / length;
            dst[2] = v[2] / length;
        }
        return dst;
    },

    degToRad: function(angle){
        return(angle*Math.PI/180);
    },

    printMatrix: function(matrix, degree) {
        let string = "";
        for(let i = 0; i < degree; i++) {

            for(let j = 0; j < degree; j++)
                string += matrix[degree * i + j] + ' ';

            console.log(string);
            string = "";
        }
    },

    identityMatrix: function(degree=4) {
        let matrix = []
        for(let i = 0; i < degree; i++)
            for(let j = 0; j < degree; j++)
                if(i == j)
                    matrix.push(1);
                else
                    matrix.push(0);
        return matrix;
    },

    // returns the 3x3 submatrix from a Matrix4x4
    sub3x3from4x4: function(m){
        out = [];
        out[0] = m[0]; out[1] = m[1]; out[2] = m[2];
        out[3] = m[4]; out[4] = m[5]; out[5] = m[6];
        out[6] = m[8]; out[7] = m[9]; out[8] = m[10];
        return out;
    },

    // Multiply the mat3 with a vec3.
    multiplyMatrix3Vector3: function(m, a) {

        out = [];
        let x = a[0], y = a[1], z = a[2];
        out[0] = x * m[0] + y * m[1] + z * m[2];
        out[1] = x * m[3] + y * m[4] + z * m[5];
        out[2] = x * m[6] + y * m[7] + z * m[8];
        return out;
    },

    //Transpose the values of a mat3

    transposeMatrix3 : function(a) {

        out = [];

        out[0] = a[0];
        out[1] = a[3];
        out[2] = a[6];
        out[3] = a[1];
        out[4] = a[4];
        out[5] = a[7];
        out[6] = a[2];
        out[7] = a[5];
        out[8] = a[8];


        return out;
    },

    transposeMatrix: function(m){
        let out = [];

        let row, column, row_offset;

        row_offset=0;
        for (row = 0; row < 4; ++row) {
            row_offset = row * 4;
            for (column = 0; column < 4; ++column){
                out[row_offset + column] = m[row + column * 4];
            }
        }
        return out;
    },

    invertMatrix3: function(m){
        out = [];

        let a00 = m[0], a01 = m[1], a02 = m[2],
            a10 = m[3], a11 = m[4], a12 = m[5],
            a20 = m[6], a21 = m[7], a22 = m[8],

            b01 = a22 * a11 - a12 * a21,
            b11 = -a22 * a10 + a12 * a20,
            b21 = a21 * a10 - a11 * a20,

            // Calculate the determinant
            det = a00 * b01 + a01 * b11 + a02 * b21;

        if (!det) {
            return null;
        }
        det = 1.0 / det;

        out[0] = b01 * det;
        out[1] = (-a22 * a01 + a02 * a21) * det;
        out[2] = (a12 * a01 - a02 * a11) * det;
        out[3] = b11 * det;
        out[4] = (a22 * a00 - a02 * a20) * det;
        out[5] = (-a12 * a00 + a02 * a10) * det;
        out[6] = b21 * det;
        out[7] = (-a21 * a00 + a01 * a20) * det;
        out[8] = (a11 * a00 - a01 * a10) * det;

        return out;
    },

    //Requires as a parameter a 4x4 matrix (array of 16 values)
    invertMatrix: function(m){

        let out = [];
        let inv = [];
        let det, i;

        inv[0] = m[5]  * m[10] * m[15] - m[5]  * m[11] * m[14] - m[9]  * m[6]  * m[15] +
            m[9]  * m[7]  * m[14] + m[13] * m[6]  * m[11] - m[13] * m[7]  * m[10];

        inv[4] = -m[4]  * m[10] * m[15] + m[4]  * m[11] * m[14] + m[8]  * m[6]  * m[15] -
            m[8]  * m[7]  * m[14] - m[12] * m[6]  * m[11] + m[12] * m[7]  * m[10];

        inv[8] = m[4]  * m[9] * m[15] - m[4]  * m[11] * m[13] - m[8]  * m[5] * m[15] +
            m[8]  * m[7] * m[13] + m[12] * m[5] * m[11] - m[12] * m[7] * m[9];

        inv[12] = -m[4]  * m[9] * m[14] + m[4]  * m[10] * m[13] + m[8]  * m[5] * m[14] -
            m[8]  * m[6] * m[13] - m[12] * m[5] * m[10] + m[12] * m[6] * m[9];

        inv[1] = -m[1]  * m[10] * m[15] + m[1]  * m[11] * m[14] + m[9]  * m[2] * m[15] -
            m[9]  * m[3] * m[14] - m[13] * m[2] * m[11] +  m[13] * m[3] * m[10];

        inv[5] = m[0]  * m[10] * m[15] - m[0]  * m[11] * m[14] - m[8]  * m[2] * m[15] +
            m[8]  * m[3] * m[14] + m[12] * m[2] * m[11] - m[12] * m[3] * m[10];

        inv[9] = -m[0]  * m[9] * m[15] + m[0]  * m[11] * m[13] + m[8]  * m[1] * m[15] -
            m[8]  * m[3] * m[13] - m[12] * m[1] * m[11] + m[12] * m[3] * m[9];

        inv[13] = m[0]  * m[9] * m[14] - m[0]  * m[10] * m[13] - m[8]  * m[1] * m[14] +
            m[8]  * m[2] * m[13] + m[12] * m[1] * m[10] - m[12] * m[2] * m[9];

        inv[2] = m[1]  * m[6] * m[15] - m[1]  * m[7] * m[14] - m[5]  * m[2] * m[15] +
            m[5]  * m[3] * m[14] + m[13] * m[2] * m[7] - m[13] * m[3] * m[6];

        inv[6] = -m[0]  * m[6] * m[15] + m[0]  * m[7] * m[14] + m[4]  * m[2] * m[15] -
            m[4]  * m[3] * m[14] - m[12] * m[2] * m[7] +  m[12] * m[3] * m[6];

        inv[10] = m[0]  * m[5] * m[15] - m[0]  * m[7] * m[13] - m[4]  * m[1] * m[15] +
            m[4]  * m[3] * m[13] + m[12] * m[1] * m[7] - m[12] * m[3] * m[5];

        inv[14] = -m[0]  * m[5] * m[14] + m[0]  * m[6] * m[13] + m[4]  * m[1] * m[14] -
            m[4]  * m[2] * m[13] - m[12] * m[1] * m[6] + m[12] * m[2] * m[5];

        inv[3] = -m[1] * m[6] * m[11] + m[1] * m[7] * m[10] + m[5] * m[2] * m[11] -
            m[5] * m[3] * m[10] - m[9] * m[2] * m[7] + m[9] * m[3] * m[6];

        inv[7] = m[0] * m[6] * m[11] - m[0] * m[7] * m[10] - m[4] * m[2] * m[11] +
            m[4] * m[3] * m[10] + m[8] * m[2] * m[7] - m[8] * m[3] * m[6];

        inv[11] = -m[0] * m[5] * m[11] + m[0] * m[7] * m[9] + m[4] * m[1] * m[11] -
            m[4] * m[3] * m[9] - m[8] * m[1] * m[7] + m[8] * m[3] * m[5];

        inv[15] = m[0] * m[5] * m[10] - m[0] * m[6] * m[9] - m[4] * m[1] * m[10] +
            m[4] * m[2] * m[9] + m[8] * m[1] * m[6] - m[8] * m[2] * m[5];

        det = m[0] * inv[0] + m[1] * inv[4] + m[2] * inv[8] + m[3] * inv[12];

        if (det == 0)
            return out = this.identityMatrix();

        det = 1.0 / det;

        for (i = 0; i < 16; i++){
            out[i] = inv[i] * det;
        }

        return out;
    },

    multiplyMatrices: function(m1, m2){
        // Perform matrix product  { out = m1 * m2;}
        let out = [];

        let row, column, row_offset;

        row_offset=0;
        for (row = 0; row < 4; ++row) {
            row_offset = row * 4;
            for (column = 0; column < 4; ++column){
                out[row_offset + column] =
                    (m1[row_offset + 0] * m2[column + 0]) +
                    (m1[row_offset + 1] * m2[column + 4]) +
                    (m1[row_offset + 2] * m2[column + 8]) +
                    (m1[row_offset + 3] * m2[column + 12]);
            }
        }
        return out;
    },

    multiplyMatrixVector: function(m, v){
        /* Mutiplies a matrix [m] by a vector [v] */

        let out = [];

        let row, row_offset;

        row_offset=0;
        for (row = 0; row < 4; ++row) {
            row_offset = row * 4;

            out[row] =
                (m[row_offset + 0] * v[0]) +
                (m[row_offset + 1] * v[1]) +
                (m[row_offset + 2] * v[2]) +
                (m[row_offset + 3] * v[3]);

        }
        return out;
    },



    // MODEL MATRIX FUNCTIONS

    MakeTranslateMatrix: function(dx, dy, dz) {
        // Create a transform matrix for a translation of ({dx}, {dy}, {dz}).

        let out = this.identityMatrix();

        out[3]  = dx;
        out[7]  = dy;
        out[11] = dz;
        return out;
    },

    MakeRotateXMatrix: function(a) {
        // Create a transform matrix for a rotation of {a} along the X axis.

        let out = this.identityMatrix();

        let adeg = this.degToRad(a);
        let c = Math.cos(adeg);
        let s = Math.sin(adeg);

        out[5] = out[10] = c;
        out[6] = -s;
        out[9] = s;

        return out;
    },

    MakeRotateYMatrix: function(a) {
        // Create a transform matrix for a rotation of {a} along the Y axis.

        let out = this.identityMatrix();

        let adeg = this.degToRad(a);

        let c = Math.cos(adeg);
        let s = Math.sin(adeg);

        out[0] = out[10] = c;
        out[2] = -s;
        out[8] = s;

        return out;
    },

    MakeRotateZMatrix: function(a) {
        // Create a transform matrix for a rotation of {a} along the Z axis.

        let out = this.identityMatrix();

        let adeg = this.degToRad(a);
        let c = Math.cos(adeg);
        let s = Math.sin(adeg);

        out[0] = out[5] = c;
        out[4] = -s;
        out[1] = s;

        return out;
    },

    MakeScaleMatrix: function(s) {
        // Create a transform matrix for proportional scale

        let out = this.identityMatrix();

        out[0] = out[5] = out[10] = s;

        return out;
    },

    // PROJECTION MATRICES

    MakeWorld: function(tx, ty, tz, rx, ry, rz, s){
        //Creates a world matrix for an object.

        let Rx = this.MakeRotateXMatrix(ry);
        let Ry = this.MakeRotateYMatrix(rx);
        let Rz = this.MakeRotateZMatrix(rz);
        let S  = this.MakeScaleMatrix(s);
        let T =  this.MakeTranslateMatrix(tx, ty, tz);

        let out = this.multiplyMatrices(Rz, S);
        out = this.multiplyMatrices(Ry, out);
        out = this.multiplyMatrices(Rx, out);
        out = this.multiplyMatrices(T, out);

        return out;
    },

    LookAt: function(cameraPosition, target, up, dst) {
        dst = dst || new Float32Array(16);
        let zAxis = this.normalize(
            this.subtractVectors(cameraPosition, target));
        let xAxis = this.normalize(this.cross(up, zAxis));
        let yAxis = this.normalize(this.cross(zAxis, xAxis));

        dst[ 0] = xAxis[0];
        dst[ 1] = xAxis[1];
        dst[ 2] = xAxis[2];
        dst[ 3] = 0;
        dst[ 4] = yAxis[0];
        dst[ 5] = yAxis[1];
        dst[ 6] = yAxis[2];
        dst[ 7] = 0;
        dst[ 8] = zAxis[0];
        dst[ 9] = zAxis[1];
        dst[10] = zAxis[2];
        dst[11] = 0;
        dst[12] = cameraPosition[0];
        dst[13] = cameraPosition[1];
        dst[14] = cameraPosition[2];
        dst[15] = 1;

        return dst;
    },

    MakeView: function(cx, cy, cz, elev, ang) {
        // Creates in {out} a view matrix. The camera is centerd in ({cx}, {cy}, {cz}).
        // It looks {ang} degrees on y axis, and {elev} degrees on the x axis.

        let T = [];
        let Rx = [];
        let Ry = [];
        let tmp = [];
        let out = [];

        T =  this.MakeTranslateMatrix(-cx, -cy, -cz);
        Rx = this.MakeRotateXMatrix(-elev);
        Ry = this.MakeRotateYMatrix(-ang);

        tmp = this.multiplyMatrices(Ry, T);
        out = this.multiplyMatrices(Rx, tmp);

        return out;
    },

    MakePerspective:function(fovy, a, n, f) {
        // Creates the perspective projection matrix. The matrix is returned.
        // {fovy} contains the vertical field-of-view in degrees. {a} is the aspect ratio.
        // {n} is the distance of the near plane, and {f} is the far plane.

        let perspective = this.identityMatrix();

        let halfFovyRad = this.degToRad(fovy/2);	// stores {fovy/2} in radiants
        let ct = 1.0 / Math.tan(halfFovyRad);			// cotangent of {fov/2}

        perspective[0] = ct / a;
        perspective[5] = ct;
        perspective[10] = (f + n) / (n - f);
        perspective[11] = 2.0 * f * n / (n - f);
        perspective[14] = -1.0;
        perspective[15] = 0.0;

        return perspective;
    }


};