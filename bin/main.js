let meshArray = [];
let modelCount = 0;

function loadModels() {
    if(modelCount < planetList.length) {
        utils.get_json(planetList[modelCount].mesh, function(loadedMesh) {
            meshArray.push(loadedMesh.meshes[planetList[modelCount].meshIndex]);
            modelCount++;
            loadModels();
        })
    } else
        main(meshArray);
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
    let camera = new Camera(G_gl, 45, 0.1, 2000.0);
    camera.transform.setPosition(300, 0, 450);
    camera.transform.setRotation(0, 0, 0);
    let cameraController = new CameraController(G_gl, camera);

    // Load Models
    let skyModel = loadSkyBox();

    let planets = [];

    for(let i = 0; i < planetList.length; i++) {
        let planet = new PlanetModel(G_gl, planetList[i], mesh[i]);
        planet.setAnimationCallback(planetList[i].motion);
        planets.push(planet)
    }

    // Start the render loop
    new RenderLoop(onRender).start();

    // Function which actually does the rendering
    function onRender(deltaTime) {
        cameraController.setDeltaTime(deltaTime);
        camera.updateViewMatrix();
        camera.updateProjectionMatrix();
        G_gl.clear(G_gl.COLOR_BUFFER_BIT | G_gl.DEPTH_BUFFER_BIT);

        // taking camera matrixes
        let fixedView = camera.getFixedViewMatrix();
        let nonFixedView = camera.getViewMatrix() ;
        let projection = camera.getProjectionMatrix();

        skyModel.setShaderPerspective(projection).render(fixedView);

        for(let i = 0; i < planets.length; i++) {
            if(planets[i].name !== 'SUN') {
                planets[i]
                    .setShaderPerspective(projection)
                    .setShaderNormalMatrix(planets[i].transform.getNormalMatrix())
                    .setShaderLightParameters(vec3.fromValues(0, 0, 0), planetList[i].lightTargetDistance, planetList[i].lightDecay, planetList[i].lightAmbientPower, planetList[i].lightDiffusePower)
                    .setShaderCameraPosition(camera.transform.position)
                    .render(nonFixedView);
            } else {
                planets[i]
                    .setShaderPerspective(projection)
                    .render(nonFixedView);
            }

            planets[i].animate(deltaTime);
        }

    }
}

function loadSun(sunMesh) {

    let sunVertices = sunMesh.meshes[0].vertices;
    let sunIndices = [].concat.apply([], sunMesh.meshes[0].faces);
    let sunUVs = sunMesh.meshes[0].texturecoords[0];
    let sunNormals = sunMesh.meshes[0].normals;

    // Load texture
    let sunTexture = document.getElementById('sun');

    // Create Model
    let sunModel = new Model(G_gl);
    sunModel
        .loadShader(vs_sunURL, fs_sunURL)
        .loadTexture(sunTexture, true)
        .setupBuffers(sunVertices, sunIndices, sunNormals, sunUVs);

    // Setup the transform of the Sun
    sunModel.transform.setScale(0.002, 0.002, 0.002);

    return sunModel;
}

function loadEarth(earthMesh) {

    let earthVertices = earthMesh.meshes[0].vertices;
    let earthIndices = [].concat.apply([], earthMesh.meshes[0].faces);
    let earthUVs = earthMesh.meshes[0].texturecoords[0];
    let earthNormals = earthMesh.meshes[0].normals;

    // Load Texture
    let earthTexture = document.getElementById('earth');

    // Create Model
    let earthModel = new PlanetModel(G_gl);
    earthModel
        .loadShader(vs_planetURL, fs_planetURL, true)
        .loadTexture(earthTexture, true)
        .setupBuffers(earthVertices, earthIndices, earthNormals, earthUVs);

    // Setup the transform of the Earth
    earthModel.transform.setScale(200, 200, 200);
    earthModel.transform.setRotation(0, 0, -20);

    return earthModel;
}

function loadSaturn(saturnMeshes) {

    // Load Saturn Ring
    let saturnRingVertices = saturnMeshes.meshes[1].vertices;
    let saturnRingIndices = [].concat.apply([], saturnMeshes.meshes[1].faces);
    let saturnRingUVs = saturnMeshes.meshes[1].texturecoords[0];
    let saturnRingNormals = saturnMeshes.meshes[1].normals;

    // Load Saturn Gas
    let saturnVertices = saturnMeshes.meshes[0].vertices;
    let saturnIndices = [].concat.apply([], saturnMeshes.meshes[0].faces);
    let saturnUVs = saturnMeshes.meshes[0].texturecoords[0];
    let saturnNormals = saturnMeshes.meshes[0].normals;

    // Load texture
    let saturnTexture = document.getElementById('saturn');
    let saturnRingTexture = document.getElementById('saturn-ring');

    // Create Model
    let saturnModel = new PlanetModel(G_gl);
    saturnModel
        .loadShader(vs_planetURL, fs_planetURL)
        .loadTexture(saturnTexture, false)
        .setupBuffers(saturnVertices, saturnIndices, saturnNormals, saturnUVs);

    let saturnRing = new PlanetModel(G_gl);
    saturnRing
        .loadShader(vs_planetURL, fs_planetURL)
        .loadTexture(saturnRingTexture)
        .setupBuffers(saturnRingVertices, saturnRingIndices, saturnRingNormals, saturnRingUVs);

    saturnRing.transform.setScale(0.1, 0.1, 0.1);
    saturnModel.transform.setScale(0.1, 0.1, 0.1);

    return {saturn: saturnModel, ring: saturnRing};
}

function loadSkyBox() {
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
    let skyModel = new SkyBox(G_gl, 2000, 2000, 2000);
    skyModel
        .loadShader(vs_skyURL, fs_skyURL)
        .loadTexture(skyTextureArray)
        .setupBuffers();

    return skyModel;
}

