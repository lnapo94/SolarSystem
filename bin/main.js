let modelCount = 0;

function loadModels() {
    if(modelCount < planetList.length) {
        utils.get_json(planetList[modelCount].mesh, function(loadedMesh) {
            planetList[modelCount].loadedMesh = loadedMesh.meshes[planetList[modelCount].meshIndex];
            modelCount++;
            loadModels();
        })
    } else
        main();
}

function initWebGL() {
    // Create the G_canvas and attach it to the body
    G_canvas = utils.createCanvas();
    G_gl = G_canvas.getContext('webgl2');

    if(!G_gl) {
        alert("WebGL 2.0 cannot be loaded");
        return -1;
    }

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
    G_gl.viewport(0, 0, G_gl.drawingBufferWidth, G_gl.drawingBufferHeight);
    /**
     *  END WEBGL INITIALIZATION
     */
}

function main() {

    let error = initWebGL();

    if(error === -1)
        return;

    // Create the Camera
    let camera = new Camera(G_gl, 45);
    camera.transform.position = vec3.fromValues(0, 200, 200);
    camera.transform.setRotation(40, 0, 0);

    // Load Models
    let skyModel = loadSkyBox(camera);
    let planets = [];
    for(let planetData of planetList) {
        let planet;
        if (planetData.name === "SUN"){
            planet = new SunModel(G_gl, planetData);
        } else {
            planet = new PlanetModel(G_gl, planetData);
        }
        planets.push({
            model : planet,
            parent : planetData.parent
        });
    }

    let cameraController = new CameraController(G_gl, camera, planets);

    let sceneGraph = buildGraph(planets);
    // Start the render loop
    new RenderLoop((deltaTime) => {
        utils.resizeCanvasToDisplaySize(G_canvas, 1);
        G_gl.viewport(0, 0, G_gl.drawingBufferWidth, G_gl.drawingBufferHeight);
        cameraController.onTimePassed();
        cameraController.setDeltaTime(deltaTime);
        camera.updateViewMatrix();
        camera.updateProjectionMatrix();
        G_gl.clear(G_gl.COLOR_BUFFER_BIT | G_gl.DEPTH_BUFFER_BIT);

        // taking camera matrixes
        let fixedView = camera.getFixedViewMatrix();
        let nonFixedView = camera.getViewMatrix() ;
        let projection = camera.getProjectionMatrix();

        skyModel.setShaderPerspective(projection).render(fixedView);
        sceneGraph.onTimePassed(deltaTime, projection, nonFixedView);
    }).start();

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
    let skyModel = new SkyBox(G_gl);
    skyModel
        .loadShader(vs_skyURL, fs_skyURL)
        .setShaderPerspective(camera.getProjectionMatrix())
        .loadTexture(skyTextureArray)
        .setupBuffers();

    return skyModel;
}


// function loadSun(sunMesh) {
//
//     let sunVertices = sunMesh.meshes[0].vertices;
//     let sunIndices = [].concat.apply([], sunMesh.meshes[0].faces);
//     let sunUVs = sunMesh.meshes[0].texturecoords[0];
//     let sunNormals = sunMesh.meshes[0].normals;
//
//     // Load texture
//     let sunTexture = document.getElementById('sun');
//
//     // Create Model
//     let sunModel = new Model(G_gl);
//     sunModel
//         .loadShader(vs_sunURL, fs_sunURL)
//         .loadTexture(sunTexture, true)
//         .setupBuffers(sunVertices, sunIndices, sunNormals, sunUVs);
//
//     // Setup the transform of the Sun
//     sunModel.transform.setScale(0.002, 0.002, 0.002);
//
//     return sunModel;
// }
//
// function loadEarth(earthMesh) {
//
//     let earthVertices = earthMesh.meshes[0].vertices;
//     let earthIndices = [].concat.apply([], earthMesh.meshes[0].faces);
//     let earthUVs = earthMesh.meshes[0].texturecoords[0];
//     let earthNormals = earthMesh.meshes[0].normals;
//
//     // Load Texture
//     let earthTexture = document.getElementById('earth');
//
//     // Create Model
//     setupBuffers(earthVertices, earthIndices, earthNormals, earthUVs);
//
//     // Setup the transform of the Earth
//     earthModel.transform.setScale(200, 200, 200);
//     earthModel.transform.setRotation(0, 0, -20);
//
//     return earthModel;
// }
//
// function loadSaturn(saturnMeshes) {
//
//     // Load Saturn Ring
//     let saturnRingVertices = saturnMeshes.meshes[1].vertices;
//     let saturnRingIndices = [].concat.apply([], saturnMeshes.meshes[1].faces);
//     let saturnRingUVs = saturnMeshes.meshes[1].texturecoords[0];
//     let saturnRingNormals = saturnMeshes.meshes[1].normals;
//
//     // Load Saturn Gas
//     let saturnVertices = saturnMeshes.meshes[0].vertices;
//     let saturnIndices = [].concat.apply([], saturnMeshes.meshes[0].faces);
//     let saturnUVs = saturnMeshes.meshes[0].texturecoords[0];
//     let saturnNormals = saturnMeshes.meshes[0].normals;
//
//     // Load texture
//     let saturnTexture = document.getElementById('saturn');
//     let saturnRingTexture = document.getElementById('saturn-ring');
//
//     // Create Model
//     let saturnRing = new PlanetModel(G_gl);
//     saturnRing
//         .loadShader(vs_planetURL, fs_planetURL)
//         .loadTexture(saturnRingTexture)
//         .setupBuffers(saturnRingVertices, saturnRingIndices, saturnRingNormals, saturnRingUVs);
//
//     let saturnModel = new PlanetModel(G_gl);
//     saturnModel
//         .loadShader(vs_planetURL, fs_planetURL)
//         .loadTexture(saturnTexture, false)
//         .setupBuffers(saturnVertices, saturnIndices, saturnNormals, saturnUVs);
//
//     saturnRing.transform.setScale(0.1, 0.1, 0.1);
//     saturnModel.transform.setScale(0.1, 0.1, 0.1);
//
//     return {saturn: saturnModel, ring: saturnRing};
// }

