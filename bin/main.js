function loadModels() {
    utils.get_json('./assets/models/sun.json', function (mesh) {
        main(mesh)
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

    // Load Sphere Mesh
    let vertices = mesh.meshes[0].vertices;
    let indices = [].concat.apply([], mesh.meshes[0].faces);
    let UVs = mesh.meshes[0].texturecoords[0];

    // Load Models
    let skyModel = loadSkyBox(camera);
    let sunModel = loadSun(vertices, indices, null, UVs, camera);
    let earthModel = loadEarth(vertices, indices, null, UVs, camera);

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
        earthModel.transform.addRotation(0, deltaTime * 50, 0);

        earthModel.setShaderPerspective(camera.getProjectionMatrix()).render(camera.getViewMatrix());
    }
}

function loadSun(vertices, indices, normals, uvs, camera) {
    // Load texture
    let sunTexture = document.getElementById('sun');

    // Create Model
    let sunModel = new Model(G_gl);
    sunModel
        .loadShader(vs_sunURL, fs_sunURL)
        .setShaderPerspective(camera.getProjectionMatrix())
        .loadTexture(sunTexture, true)
        .setupBuffers(vertices, indices, normals, uvs);

    // Setup the transform of the Sun
    sunModel.transform.setScale(0.0005, 0.0005, 0.0005);

    return sunModel;
}

function loadEarth(vertices, indices, normals, uvs, camera) {
    // Load Texture
    let earthTexture = document.getElementById('earth');

    // Create Model
    let earthModel = new Model(G_gl);
    earthModel
        .loadShader(vs_sunURL, fs_sunURL)
        .setShaderPerspective(camera.getProjectionMatrix())
        .loadTexture(earthTexture, true)
        .setupBuffers(vertices, indices, normals, uvs);

    // Setup the transform of the Earth
    earthModel.transform.setScale(0.0005, 0.0005, 0.0005);
    earthModel.transform.setPosition(30, 0, -50);

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

