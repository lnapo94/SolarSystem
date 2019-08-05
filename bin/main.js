function loadModels() {
    let meshArray = [];
    utils.get_json('./assets/models/sun.json', function (sunMesh) {
        meshArray.push(sunMesh);
        utils.get_json('./assets/models/earth.json', function (earthMesh) {
            meshArray.push(earthMesh);
            main(meshArray);
        })
    })
}

function initWebGL() {
    // Create the G_canvas and attach it to the body
    G_canvas = utils.createCanvas();
    G_gl = canvas.getContext('webgl2');

    /**
     *  WEBGL INITIALIZATION
     */
    G_gl.cullFace(G_gl.BACK);
    G_gl.frontFace(G_gl.CCW);
    G_gl.enable(G_gl.DEPTH_TEST);
    G_gl.enable(G_gl.CULL_FACE);
    G_gl.depthFunc(G_gl.LEQUAL);
    G_gl.blendFunc(G_gl.SRC_ALPHA, G_gl.ONE_MINUS_SRC_ALPHA);

    G_gl.clearColor(1.0,1.0,1.0,1.0);

    utils.resizeCanvasToDisplaySize(G_gl.canvas);
    G_gl.viewport(0, 0, G_gl.canvas.width, G_gl.canvas.height);
    /**
     *  END WEBGL INITIALIZATION
     */
}

function main(mesh) {

    initWebGL();

    // Create the Camera
    let camera = new Camera(G_gl, 45);
    camera.transform.position = vec3.fromValues(0, 0, 100);
    camera.transform.rotation = vec3.fromValues(0, 0, 0);
    let cameraController = new CameraController(G_gl, camera);

    // Load Sun Mesh
    let sunVertices = mesh[0].meshes[0].vertices;
    let sunIndices = [].concat.apply([], mesh[0].meshes[0].faces);
    let sunUVs = mesh[0].meshes[0].texturecoords[0];
    let sunNormals = mesh[0].meshes[0].normals;

    // Load Earth Mesh
    let earthVertices = mesh[1].meshes[0].vertices;
    let earthIndices = [].concat.apply([], mesh[1].meshes[0].faces);
    let earthUVs = mesh[1].meshes[0].texturecoords[0];
    let earthNormals = mesh[1].meshes[0].normals;

    // Load Models
    let skyModel = loadSkyBox(camera);
    let sunModel = loadSun(sunVertices, sunIndices, sunNormals, sunUVs);
    let earthModel = loadEarth(earthVertices, earthIndices, earthNormals, earthUVs);

    // Start the render loop
    new RenderLoop(onRender).start();

    // Function which actually does the rendering
    function onRender(deltaTime) {
        cameraController.setDeltaTime(deltaTime);
        camera.updateViewMatrix();
        camera.updateProjectionMatrix();
        G_gl.clear(G_gl.COLOR_BUFFER_BIT | G_gl.DEPTH_BUFFER_BIT);

        skyModel.setShaderPerspective(camera.getProjectionMatrix()).render(camera.getFixedViewMatrix());

        sunModel.setShaderPerspective(camera.getProjectionMatrix()).render(camera.getViewMatrix());
        sunModel.transform.addRotation(0, deltaTime * 10, 0);

        earthModel
            .setShaderPerspective(camera.getProjectionMatrix())
            .setShaderNormalMatrix(earthModel.transform.getNormalMatrix())
            .setShaderLightPosition(vec3.fromValues(0, 0, 0))
            .setShaderCameraPosition(camera.transform.position)
            .render(camera.getViewMatrix(), true);
        earthModel.transform.addRotation(0, deltaTime * 50, 0);
    }
}

function loadSun(vertices, indices, normals, uvs) {
    // Load texture
    let sunTexture = document.getElementById('sun');

    // Create Model
    let sunModel = new Model(G_gl);
    sunModel
        .loadShader(vs_sunURL, fs_sunURL)
        .loadTexture(sunTexture, true)
        .setupBuffers(vertices, indices, normals, uvs);

    // Setup the transform of the Sun
    sunModel.transform.setScale(0.0005, 0.0005, 0.0005);

    return sunModel;
}

function loadEarth(vertices, indices, normals, uvs) {
    // Load Texture
    let earthTexture = document.getElementById('earth');

    // Create Model
    let earthModel = new PlanetModel(G_gl);
    earthModel.noCulling = true;
    earthModel
        .loadShader(vs_planetURL, fs_planetURL, true)
        .loadTexture(earthTexture, true)
        .setupBuffers(vertices, indices, normals, uvs);

    // Setup the transform of the Earth
    earthModel.transform.setScale(200, 200, 200);
    earthModel.transform.setPosition(50, 0, -50);
    earthModel.transform.setRotation(0, 0, -20);

    return earthModel;
}

function loadSkyBox(camera) {
    // Load Texture
    let skyTextureArray = [
        document.getElementById("cubeRight"),
        document.getElementById("cubeLeft"),
        document.getElementById("cubeTop"),
        document.getElementById("cubeBottom"),
        document.getElementById("cubeBack"),
        document.getElementById("cubeFront"),
    ];

    // Create Model
    let skyModel = new NewSkyBox(G_gl);
    skyModel
        .loadShader(vs_skyURL, fs_skyURL)
        .setShaderPerspective(camera.getProjectionMatrix())
        .loadTexture(skyTextureArray)
        .setupBuffers();

    return skyModel;
}

