let animationParams = {
    mercuryPosition: 0,
    earthPosition: 0,
    saturnPosition: 0,
    saturnRingPosition: 0
};

let planetList = [
    {
        name : "SUN",
        mesh : "./assets/models/sun.json",
        meshIndex: 0,
        vShaderURL : "./assets/shaders/sun/vs.glsl",
        fShaderURL : "./assets/shaders/sun/fs.glsl",
        texture : "sun",
        doYFlip: true,
        noCulling: false,
        doBlending: false,
        position : {
            X : 0,
            Y : 0,
            Z : 0
        },
        rotation: {
            X : 0,
            Y : 0,
            Z : 0
        },
        scale : {
            X : .002,
            Y : .002,
            Z : .002
        },
        lightTargetDistance: null,
        lightDecay: null,
        lightAmbientPower: null,
        lightDiffusePower: null,
        motion : function (deltaTime, model) {
            // model.transform.addRotation(0, deltaTime * 10, 0);
        },
        children : [ ]
    },
    {
        name : "MERCURY",
        mesh : "./assets/models/mercury.json",
        meshIndex: 0,
        vShaderURL : "./assets/shaders/planet/vs.glsl",
        fShaderURL : "./assets/shaders/planet/fs.glsl",
        texture : "mercury",
        doYFlip: true,
        noCulling: true,
        doBlending: false,
        position : {
            X : 100,
            Y : 0,
            Z : 0
        },
        rotation: {
            X : 0,
            Y : 0,
            Z : 0
        },
        scale : {
            X : 70,
            Y : 70,
            Z : 70
        },
        lightTargetDistance: 2700.0,
        lightDecay: 2.0,
        lightAmbientPower: 0.5, //0.15
        lightDiffusePower: 0.25,
        motion : function (deltaTime, model) {
            // model.transform.addRotation(0, deltaTime * 100, 0);
            // model.transform.setPosition(-150 * Math.cos(animationParams.mercuryPosition) + 20, 0, 200 * Math.sin(animationParams.mercuryPosition));
            // animationParams.mercuryPosition += deltaTime * 0.5;
        },
        children : [ ]
    },
    {
        name : "VENUS",
        mesh : "./assets/models/venus.json",
        meshIndex: 0,
        vShaderURL : "./assets/shaders/planet/vs.glsl",
        fShaderURL : "./assets/shaders/planet/fs.glsl",
        texture : "venus",
        doYFlip: true,
        noCulling: true,
        doBlending: false,
        position : {
            X : 150,
            Y : 0,
            Z : 0
        },
        rotation: {
            X : 0,
            Y : 0,
            Z : 0
        },
        scale : {
            X : 27,
            Y : 27,
            Z : 27
        },
        lightTargetDistance: 1800.0,
        lightDecay: 2.0,
        lightAmbientPower: 0.5, //0.15
        lightDiffusePower: 0.25,
        motion : function (deltaTime, model) {
            // model.transform.addRotation(0, deltaTime * 100, 0);
            // model.transform.setPosition(-150 * Math.cos(animationParams.mercuryPosition) + 20, 0, 200 * Math.sin(animationParams.mercuryPosition));
            // animationParams.mercuryPosition += deltaTime * 0.5;
        },
        children : [ ]
    },
    {
        name : "EARTH",
        mesh : "./assets/models/earth.json",
        meshIndex: 0,
        vShaderURL : "./assets/shaders/planet/vs.glsl",
        fShaderURL : "./assets/shaders/planet/fs.glsl",
        texture : "earth",
        doYFlip: true,
        noCulling: false,
        doBlending: false,
        position : {
            X : 200,
            Y : 0,
            Z : 0
        },
        rotation: {
            X : 0,
            Y : 0,
            Z : 0
        },
        scale : {
            X : 220,
            Y : 220,
            Z : 220
        },
        lightTargetDistance: 12000.0,
        lightDecay: 2.0,
        lightAmbientPower: 0.5, //0.15
        lightDiffusePower: 0.25,
        motion : function (deltaTime, model) {
            // model.transform.addRotation(0, deltaTime * 100, 0);
            // model.transform.setPosition(180 * Math.cos(animationParams.earthPosition) + 70, 0, -150 * Math.sin(animationParams.earthPosition));
            // animationParams.earthPosition += deltaTime * 0.5;
        },
        children : [ ]
    },
    {
        name : "MARS",
        mesh : "./assets/models/mars.json",
        meshIndex: 0,
        vShaderURL : "./assets/shaders/planet/vs.glsl",
        fShaderURL : "./assets/shaders/planet/fs.glsl",
        texture : "mars",
        doYFlip: true,
        noCulling: false,
        doBlending: false,
        position : {
            X : 250,
            Y : 0,
            Z : 0
        },
        rotation: {
            X : 0,
            Y : 0,
            Z : 0
        },
        scale : {
            X : 5,
            Y : 5,
            Z : 5
        },
        lightTargetDistance: 1000.0,
        lightDecay: 2.0,
        lightAmbientPower: 0.5, //0.15
        lightDiffusePower: 0.25,
        motion : function (deltaTime, model) {
            // model.transform.addRotation(0, deltaTime * 100, 0);
            // model.transform.setPosition(180 * Math.cos(animationParams.earthPosition) + 70, 0, -150 * Math.sin(animationParams.earthPosition));
            // animationParams.earthPosition += deltaTime * 0.5;
        },
        children : [ ]
    },
    {
        name : "JUPITER",
        mesh : "./assets/models/jupiter.json",
        meshIndex: 0,
        vShaderURL : "./assets/shaders/planet/vs.glsl",
        fShaderURL : "./assets/shaders/planet/fs.glsl",
        texture : "jupiter",
        doYFlip: true,
        noCulling: false,
        doBlending: false,
        position : {
            X : 300,
            Y : 0,
            Z : 0
        },
        rotation: {
            X : 90,
            Y : 0,
            Z : 0
        },
        scale : {
            X : 0.035,
            Y : 0.035,
            Z : 0.035
        },
        lightTargetDistance: 100.0,
        lightDecay: 2.0,
        lightAmbientPower: 0.5, //0.15
        lightDiffusePower: 0.25,
        motion : function (deltaTime, model) {
            // model.transform.addRotation(0, deltaTime * 100, 0);
            // model.transform.setPosition(180 * Math.cos(animationParams.earthPosition) + 70, 0, -150 * Math.sin(animationParams.earthPosition));
            // animationParams.earthPosition += deltaTime * 0.5;
        },
        children : [ ]
    },
    {
        name : "SATURN",
        mesh : "./assets/models/saturn.json",
        meshIndex: 0,
        vShaderURL : "./assets/shaders/planet/vs.glsl",
        fShaderURL : "./assets/shaders/planet/fs.glsl",
        texture : "saturn",
        doYFlip: true,
        noCulling: false,
        doBlending: false,
        position : {
            X : 375,
            Y : 0,
            Z : 0
        },
        rotation: {
            X : 90,
            Y : 0,
            Z : 0
        },
        scale : {
            X : 0.2,
            Y : 0.2,
            Z : 0.2
        },
        lightTargetDistance: 200.0,
        lightDecay: 2.0,
        lightAmbientPower: 0.5, //0.15
        lightDiffusePower: 0.25,
        motion : function (deltaTime, model) {
            // model.transform.setPosition(-180 * Math.cos(animationParams.saturnPosition) + 70, 0, 150 * Math.sin(animationParams.saturnPosition));
            // model.transform.setRotation(60, -60, 0);
            // animationParams.saturnPosition += deltaTime * 0.5;
        },
        children : []
    },
    {
        name : "SATURN-RING",
        mesh : "./assets/models/saturn.json",
        meshIndex: 1,
        vShaderURL : "./assets/shaders/planet/vs.glsl",
        fShaderURL : "./assets/shaders/planet/fs.glsl",
        texture : "saturn-ring",
        doYFlip: true,
        noCulling: false,
        doBlending: false,
        position : {
            X : 375,
            Y : 0,
            Z : 0
        },
        rotation: {
            X : 60,
            Y : 0,
            Z : 0
        },
        scale : {
            X : 0.2,
            Y : 0.2,
            Z : 0.2
        },
        lightTargetDistance: 200.0,
        lightDecay: 2.0,
        lightAmbientPower: 0.5, //0.15
        lightDiffusePower: 0.25,
        motion : function (deltaTime, model) {
            // model.transform.setPosition(-180 * Math.cos(animationParams.saturnRingPosition) + 70, 0, 150 * Math.sin(animationParams.saturnRingPosition));
            // model.transform.setRotation(60, -60, 0);
            // animationParams.saturnRingPosition += deltaTime * 0.5;
        },
        children : []
    },
    {
        name : "URANUS",
        mesh : "./assets/models/uranus.json",
        meshIndex: 1,
        vShaderURL : "./assets/shaders/planet/vs.glsl",
        fShaderURL : "./assets/shaders/planet/fs.glsl",
        texture : "uranus",
        doYFlip: true,
        noCulling: false,
        doBlending: false,
        position : {
            X : 470,
            Y : 0,
            Z : 0
        },
        rotation: {
            X : 0,
            Y : 0,
            Z : 90
        },
        scale : {
            X : 0.07,
            Y : 0.07,
            Z : 0.07
        },
        lightTargetDistance: 200.0,
        lightDecay: 2.0,
        lightAmbientPower: 0.5, //0.15
        lightDiffusePower: 0.25,
        motion : function (deltaTime, model) {
            // model.transform.addRotation(0, deltaTime * 100, 0);
            // model.transform.setPosition(180 * Math.cos(animationParams.earthPosition) + 70, 0, -150 * Math.sin(animationParams.earthPosition));
            // animationParams.earthPosition += deltaTime * 0.5;
        },
        children : [ ]
    },
    {
        name : "URANUS-RING",
        mesh : "./assets/models/uranus.json",
        meshIndex: 0,
        vShaderURL : "./assets/shaders/planet/vs.glsl",
        fShaderURL : "./assets/shaders/planet/fs.glsl",
        texture : "uranus-ring",
        doYFlip: true,
        noCulling: false,
        doBlending: false,
        position : {
            X : 470,
            Y : 0,
            Z : 0
        },
        rotation: {
            X : 0,
            Y : 0,
            Z : 90
        },
        scale : {
            X : 0.07,
            Y : 0.07,
            Z : 0.07
        },
        lightTargetDistance: 200.0,
        lightDecay: 2.0,
        lightAmbientPower: 0.5, //0.15
        lightDiffusePower: 0.25,
        motion : function (deltaTime, model) {
            // model.transform.addRotation(0, deltaTime * 100, 0);
            // model.transform.setPosition(180 * Math.cos(animationParams.earthPosition) + 70, 0, -150 * Math.sin(animationParams.earthPosition));
            // animationParams.earthPosition += deltaTime * 0.5;
        },
        children : [ ]
    },
    {
        name : "NEPTUNE",
        mesh : "./assets/models/neptune.json",
        meshIndex: 0,
        vShaderURL : "./assets/shaders/planet/vs.glsl",
        fShaderURL : "./assets/shaders/planet/fs.glsl",
        texture : "neptune",
        doYFlip: true,
        noCulling: false,
        doBlending: false,
        position : {
            X : 540,
            Y : 0,
            Z : 0
        },
        rotation: {
            X : 0,
            Y : 0,
            Z : 0
        },
        scale : {
            X : 0.004,
            Y : 0.004,
            Z : 0.004
        },
        lightTargetDistance: 90.0,
        lightDecay: 2.0,
        lightAmbientPower: 0.5, //0.15
        lightDiffusePower: 0.25,
        motion : function (deltaTime, model) {
            // model.transform.addRotation(0, deltaTime * 100, 0);
            // model.transform.setPosition(180 * Math.cos(animationParams.earthPosition) + 70, 0, -150 * Math.sin(animationParams.earthPosition));
            // animationParams.earthPosition += deltaTime * 0.5;
        },
        children : [ ]
    },
];