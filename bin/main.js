function loadModels() {
    utils.get_json('./assets/models/sun.json', function (mesh) {
        main(mesh)
    })
}

function main(mesh) {

    // Create the canvas and attach it to the body
    canvas = utils.createCanvas();
    gl = canvas.getContext('webgl2');

    gl.cullFace(gl.BACK);
    gl.frontFace(gl.CCW);
    gl.enable(gl.DEPTH_TEST);
    gl.enable(gl.CULL_FACE);
    gl.depthFunc(gl.LEQUAL);
    gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);

    gl.clearColor(1.0,1.0,1.0,1.0);

    utils.resizeCanvasToDisplaySize(gl.canvas);
    gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);

    let camera = new Camera(gl, 45);
    camera.transform.position = vec3.fromValues(0, 100, 10);
    camera.transform.rotation = vec3.fromValues(-90, 0, 0);

    let cameraController = new CameraController(gl, camera);

    // Load Sun
    let sunTexture = Texture.loadTexture(gl, document.getElementById('sun'));

    let sunMesh = new Mesh(gl);
    let sunVertices = mesh.meshes[0].vertices;
    let sunIndices = [].concat.apply([], mesh.meshes[0].faces);
    let sunUV = mesh.meshes[0].texturecoords[0];
    sunMesh.createMeshVAO(sunVertices, sunIndices, null, sunUV);
    let sunModel = new Model(sunMesh);
    sunModel.setScale(0.0005, 0.0005, 0.0005);

    let sunShader = new SunShader(gl);
    sunShader.enable().setPerspective(camera.projectionMatrix).disable();

    // Load Earth
    let earthTexture = Texture.loadTexture(gl, document.getElementById('earth'), true);
    let earthModel = new Model(sunMesh);
    earthModel.setPosition(30, 0, -50);
    earthModel.setRotation(5, 50, 0);
    earthModel.setScale(0.0002, 0.0002, 0.0002);

    // Load Sky
    let skyTexture = Texture.loadCubeMap(gl, [
        document.getElementById("cubeRight"),
        document.getElementById("cubeLeft"),
        document.getElementById("cubeTop"),
        document.getElementById("cubeBottom"),
        document.getElementById("cubeBack"),
        document.getElementById("cubeFront"),
    ]);
    let skyShader = new SkyMapShader(gl, camera.projectionMatrix, skyTexture);
    let sky = new Model(Primitives.Cube.createMesh(gl, 1000, 1000, 1000, 0, 0, 0));

    new RenderLoop(onRender).start();

    let prova = 0;

    function onRender(deltaTime) {

        earthModel.addRotation(0, deltaTime * 30, 0);
        earthModel.setPosition(30 * Math.cos(prova), 0, -50 * Math.sin(prova));
        sunModel.addRotation(0, deltaTime * 10, 0);
        prova += 0.01;
        camera.updateViewMatrix();
        gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

        skyShader.enable()
            .preRender()
            .setCameraMatrix(camera.getFixedViewMatrix())
            .renderModel(sky.preRender())
            .disable();

        sunShader
            .enable()
            .setTexture(sunTexture)
            .preRender()
            .setCameraMatrix(camera.getViewMatrix())
            .renderModel(sunModel.preRender())
            .disable();

        // Load the earth texture with sun shader

        sunShader
            .enable()
            .setTexture(earthTexture)
            .preRender()
            .setCameraMatrix(camera.getViewMatrix())
            .renderModel(earthModel.preRender())
            .disable();
    }
}

