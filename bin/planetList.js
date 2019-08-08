let animationParams = {
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
        orientation : {
            X : 0,
            Y : 0,
            Z : 0,
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
        motion : {
            speed : 0,
            translation: {
                X : (position) => { return 0},
                Y : (position) => { return 0},
                Z : (position) => { return 0},
            },
            rotation: {
                X : (dt) => { return 0},
                Y : (dt) => { return 10 * dt},
                Z : (dt) => { return 0},
            }
        },
        parent : 'ROOT'
    },
    {
        name : "MERCURY",
        mesh : "./assets/models/mercury.json",
        meshIndex: 0,
        vShaderURL : "./assets/shaders/planet/vs.glsl",
        fShaderURL : "./assets/shaders/planet/fs.glsl",
        texture : "mercury",
        doYFlip: true,
        noCulling: false,
        doBlending: false,
        position : {
            X : 0,
            Y : 0,
            Z : -20
        },
        orientation : {
            X : 0,
            Y : 0,
            Z : 0,
        },
        scale : {
            X : 20,
            Y : 20,
            Z : 20
        },
        lightTargetDistance: 5000.0,
        lightDecay: 1.0,
        lightAmbientPower: 0.15,
        lightDiffusePower: 0.25,
        motion : {
            speed : 0.1,
            translation: {
                X : (position) => { return (-155 * Math.cos(position))*1},
                Y : (position) => { return 0},
                Z : (position) => { return (-150 * Math.sin(position))*1 },
            },
            rotation: {
                X : (dt) => { return 15 * dt},
                Y : (dt) => { return 7 * dt},
                Z : (dt) => { return 0},
            }
        },
        parent : 'SUN'
    },
    {
        name : "VENUS",
        mesh : "./assets/models/venus.json",
        meshIndex: 0,
        vShaderURL : "./assets/shaders/planet/vs.glsl",
        fShaderURL : "./assets/shaders/planet/fs.glsl",
        texture : "venus",
        doYFlip: true,
        noCulling: false,
        doBlending: false,
        position : {
            X : 0,
            Y : 0,
            Z : -20
        },
        orientation : {
            X : 0,
            Y : 0,
            Z : 0,
        },
        scale : {
            X : 10,
            Y : 10,
            Z : 10
        },
        lightTargetDistance: 3500.0,
        lightDecay: 1.0,
        lightAmbientPower: 0.15,
        lightDiffusePower: 0.25,
        motion : {
            speed : 0.1,
            translation: {
                X : (position) => { return (155 * Math.cos(position))*2},
                Y : (position) => { return 0},
                Z : (position) => { return (-150 * Math.sin(position))*2 },
            },
            rotation: {
                X : (dt) => { return 15 * dt},
                Y : (dt) => { return 7 * dt},
                Z : (dt) => { return 0},
            }
        },
        parent : 'SUN'
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
            X : 0,
            Y : 0,
            Z : -50
        },
        orientation : {
            X : 0,
            Y : 0,
            Z : 0,
        },
        scale : {
            X : 100,
            Y : 100,
            Z : 100
        },
        lightTargetDistance: 6500.0,
        lightDecay: 2.0,
        lightAmbientPower: 0.15,
        lightDiffusePower: 0.35,
        motion : {
            speed : 0,
            translation: {
                X : (position) => { return (-155 * Math.cos(position) )*3},
                Y : (position) => { return 0},
                Z : (position) => { return (-150 * Math.sin(position))*3 },
            },
            rotation: {
                X : (dt) => { return 0},
                Y : (dt) => { return 100 * dt},
                Z : (dt) => { return 0},
            }
        },
            
            // function (deltaTime, model) {
            // model.transform.addRotation(0, deltaTime * 100, 0);
            // model.transform.setPosition(180 * Math.cos(animationParams.earthPosition) + 70, 0, -150 * Math.sin(animationParams.earthPosition));
            // animationParams.earthPosition += deltaTime * 0.5;
        parent : 'SUN'
    },
    {
        name : "MOON",
        mesh : "./assets/models/earth.json",
        meshIndex: 0,
        vShaderURL : "./assets/shaders/planet/vs.glsl",
        fShaderURL : "./assets/shaders/planet/fs.glsl",
        texture : "moon",
        doYFlip: true,
        noCulling: false,
        doBlending: false,
        position : {
            X : 0,
            Y : 0,
            Z : -5
        },
        orientation : {
            X : 0,
            Y : 0,
            Z : 0,
        },
        scale : {
            X : 50,
            Y : 50,
            Z : 50
        },
        lightTargetDistance: 4500.0,
        lightDecay: 2.0,
        lightAmbientPower: 0.15,
        lightDiffusePower: 0.25,
        motion : {
            speed : 1.2,
            translation: {
                X : (position) => { return (150 * Math.cos(position))*0.2},
                Y : (position) => { return 0},
                Z : (position) => { return (-150 * Math.sin(position))*0.2 },
            },
            rotation: {
                X : (dt) => { return 0},
                Y : (dt) => { return 100 * dt},
                Z : (dt) => { return 0},
            }
        },

        // function (deltaTime, model) {
        parent : 'EARTH'
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
            X : 0,
            Y : 0,
            Z : -20
        },
        orientation : {
            X : 0,
            Y : 0,
            Z : 0,
        },
        scale : {
            X : 1,
            Y : 1,
            Z : 1
        },
        lightTargetDistance: 1000.0,
        lightDecay: 1.0,
        lightAmbientPower: 0.15,
        lightDiffusePower: 0.25,
        motion : {
            speed : 0.0825,
            translation: {
                X : (position) => { return (-155 * Math.cos(position))*4},
                Y : (position) => { return 0},
                Z : (position) => { return (-150 * Math.sin(position))*4 },
            },
            rotation: {
                X : (dt) => { return 15 * dt},
                Y : (dt) => { return 7 * dt},
                Z : (dt) => { return 0},
            }
        },
        parent : 'SUN'
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
            X : 0,
            Y : 0,
            Z : -20
        },
        orientation : {
            X : 90,
            Y : 0,
            Z : 0,
        },
        scale : {
            X : 0.08,
            Y : 0.08,
            Z : 0.08
        },
        lightTargetDistance: 300.0,
        lightDecay: 1.0,
        lightAmbientPower: 0.15,
        lightDiffusePower: 0.25,
        motion : {
            speed : 0.075,
            translation: {
                X : (position) => { return (-155 * Math.cos(position))*6},
                Y : (position) => { return 0},
                Z : (position) => { return (-150 * Math.sin(position))*6 },
            },
            rotation: {
                X : (dt) => { return 0},
                Y : (dt) => { return 50 * dt},
                Z : (dt) => { return 0},
            }
        },
        parent : 'SUN'
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
            X : 0,
            Y : 0,
            Z : -20
        },
        orientation : {
            X : 90,
            Y : 0,
            Z : 0,
        },
        scale : {
            X : 0.3,
            Y : 0.3,
            Z : 0.3
        },
        lightTargetDistance: 900.0,
        lightDecay: 2.0,
        lightAmbientPower: 0.15,
        lightDiffusePower: 0.25,
        motion : {
            speed : 0.06,
            translation: {
                X : (position) => { return (-155 * Math.cos(position))*8},
                Y : (position) => { return 0},
                Z : (position) => { return -150 * Math.sin(position)*8 },
            },
            rotation: {
                X : (dt) => { return 0},
                Y : (dt) => { return 100 * dt},
                Z : (dt) => { return 0},
            }
        },
        parent : 'SUN'
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
            X : 0,
            Y : 0,
            Z : -20
        },
        orientation : {
            X : 0,
            Y : 0,
            Z : 0,
        },
        scale : {
            X : 0.3,
            Y : 0.3,
            Z : 0.1
        },
        lightTargetDistance: 700.0,
        lightDecay: 1.0,
        lightAmbientPower: 0.15,
        lightDiffusePower: 0.25,
        motion : {
            speed : 0.06,
            translation: {
                X : (position) => { return (-155 * Math.cos(position))*8},
                Y : (position) => { return 0},
                Z : (position) => { return (-150 * Math.sin(position))*8 },
            },
            rotation: {
                X : (dt) => { return 15 * dt},
                Y : (dt) => { return 7 * dt},
                Z : (dt) => { return 0},
            }
        },
        parent : 'SUN'
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
            X : 0,
            Y : 0,
            Z : -20
        },
        orientation : {
            X : 90,
            Y : 0,
            Z : 0,
        },
        scale : {
            X : 0.1,
            Y : 0.1,
            Z : 0.1
        },
        lightTargetDistance: 300.0,
        lightDecay: 1.0,
        lightAmbientPower: 0.15,
        lightDiffusePower: 0.30,
        motion : {
            speed : 0.04,
            translation: {
                X : (position) => { return (155 * Math.cos(position))*10},
                Y : (position) => { return 0},
                Z : (position) => { return (-150 * Math.sin(position))*10 },
            },
            rotation: {
                X : (dt) => { return 70 * dt},
                Y : (dt) => { return 0},
                Z : (dt) => { return 0},
            }
        },
        parent : 'SUN'
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
            X : 0,
            Y : 0,
            Z : -20
        },
        orientation : {
            X : 0,
            Y : 0,
            Z : 0,
        },
        scale : {
            X : 0.1,
            Y : 0.1,
            Z : 0.1
        },
        lightTargetDistance: 300.0,
        lightDecay: 1.0,
        lightAmbientPower: 0.15,
        lightDiffusePower: 0.30,
        motion : {
            speed : 0.04,
            translation: {
                X : (position) => { return (155 * Math.cos(position))*10},
                Y : (position) => { return 0},
                Z : (position) => { return (-150 * Math.sin(position))*10 },
            },
            rotation: {
                X : (dt) => { return 70 * dt},
                Y : (dt) => { return 0},
                Z : (dt) => { return 0},
            }
        },
        parent : 'SUN'
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
            X : 0,
            Y : 0,
            Z : -20
        },
        orientation : {
            X : 0,
            Y : 0,
            Z : 0,
        },
        scale : {
            X : 0.007,
            Y : 0.007,
            Z : 0.007
        },
        lightTargetDistance: 50.0,
        lightDecay: 1.0,
        lightAmbientPower: 0.15,
        lightDiffusePower: 0.25,
        motion : {
            speed : .02,
            translation: {
                X : (position) => { return (-155 * Math.cos(position))*12},
                Y : (position) => { return 0},
                Z : (position) => { return (-150 * Math.sin(position))*12 },
            },
            rotation: {
                X : (dt) => { return 0},
                Y : (dt) => { return 50 * dt},
                Z : (dt) => { return 0},
            }
        },
        parent : 'SUN'
    },
];