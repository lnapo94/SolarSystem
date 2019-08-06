let animationParams = {
    earthPosition: 0,
    saturnPosition: 0,
    saturnRingPosition: 0
};

let planetList = [
    {
        name : "SUN",
        mesh : "./assets/models/sun.json",
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
            model.transform.addRotation(0, deltaTime * 10, 0);
        },
        children : [ ]
    },
    {
        name : "EARTH",
        mesh : "./assets/models/earth.json",
        vShaderURL : "./assets/shaders/planet/vs.glsl",
        fShaderURL : "./assets/shaders/planet/fs.glsl",
        texture : "earth",
        doYFlip: true,
        noCulling: false,
        doBlending: false,
        position : {
            X : 0,
            Y : 0,
            Z : -20
        },
        scale : {
            X : 200,
            Y : 200,
            Z : 200
        },
        lightTargetDistance: 6000.0,
        lightDecay: 2.0,
        lightAmbientPower: 0.15,
        lightDiffusePower: 0.25,
        motion : function (deltaTime, model) {
            model.transform.addRotation(0, deltaTime * 100, 0);
            model.transform.setPosition(180 * Math.cos(animationParams.earthPosition) + 70, 0, -150 * Math.sin(animationParams.earthPosition));
            animationParams.earthPosition += deltaTime * 0.5;
        },
        children : [ ]
    },
    {
        name : "SATURN",
        mesh : "./assets/models/saturn.json",
        vShaderURL : "./assets/shaders/planet/vs.glsl",
        fShaderURL : "./assets/shaders/planet/fs.glsl",
        texture : "saturn",
        doYFlip: true,
        noCulling: false,
        doBlending: false,
        position : {
            X : 0,
            Y : 0,
            Z : -20
        },
        scale : {
            X : 0.1,
            Y : 0.1,
            Z : 0.1
        },
        lightTargetDistance: 100.0,
        lightDecay: 2.0,
        lightAmbientPower: 0.15,
        lightDiffusePower: 0.25,
        motion : function (deltaTime, model) {
            model.transform.setPosition(-180 * Math.cos(animationParams.saturnPosition) + 70, 0, 150 * Math.sin(animationParams.saturnPosition));
            model.transform.setRotation(60, -60, 0);
            animationParams.saturnPosition += deltaTime * 0.5;
        },
        children : []
    },
    {
        name : "SATURN",
        mesh : "./assets/models/saturn.json",
        vShaderURL : "./assets/shaders/planet/vs.glsl",
        fShaderURL : "./assets/shaders/planet/fs.glsl",
        texture : "saturn-ring",
        doYFlip: true,
        noCulling: false,
        doBlending: false,
        position : {
            X : 0,
            Y : 0,
            Z : -20
        },
        scale : {
            X : 0.1,
            Y : 0.1,
            Z : 0.1
        },
        lightTargetDistance: 100.0,
        lightDecay: 2.0,
        lightAmbientPower: 0.15,
        lightDiffusePower: 0.25,
        motion : function (deltaTime, model) {
            model.transform.setPosition(-180 * Math.cos(animationParams.saturnRingPosition) + 70, 0, 150 * Math.sin(animationParams.saturnRingPosition));
            model.transform.setRotation(60, -60, 0);
            animationParams.saturnRingPosition += deltaTime * 0.5;
        },
        children : []
    },
];