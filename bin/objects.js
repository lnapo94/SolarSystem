
let objectData = [
    {
        name : "SUN",
        mesh : "",
        vShaderURL : "./assets/shaders/sun//vs.glsl",
        fShaderURL : "./assets/shaders/sun//fs.glsl",
        texture : "sun",
        position : {
            X : 0,
            Y : 0,
            Z : 0
        },
        scale : {
            X : .00002,
            Y : .00002,
            Z : .00002
        },
        motion : {
            rotation : {
                X : 0,
                Y : 10,
                Z : 0
            },
            translation : {
                X : function (ap) {
                    return 0;
                },
                Y : function (ap) {
                    return 0;
                },
                Z : function (ap) {
                    return 0;
                }
            }
        },
        childs : [ ]
    },
    {
        name : "MERCURY",
        mesh : "",
        vShaderURL : "./assets/shaders/planet/vs.glsl",
        fShaderURL : "./assets/shaders/planet/fs.glsl",
        texture : "",
        position : {
            X : 0,
            Y : 0,
            Z : 0
        },
        scale : {
            X : .00002,
            Y : .00002,
            Z : .00002
        },
        childs : [
        ]
    },

    {
        name : "EARTH",
        mesh : "",
        vShaderURL : "./assets/shaders/planet/vs.glsl",
        fShaderURL : "./assets/shaders/planet/fs.glsl",
        texture : "earth",
        position : {
            X : 0,
            Y : 0,
            Z : 0
        },
        scale : {
            X : .00002,
            Y : .00002,
            Z : .00002
        },
        motion : {
            rotation : {
                X : 0,
                Y : 10,
                Z : 0
            },
            translation : {
                X : function (ap) {
                    return 180 * Math.cos(ap);
                },
                Y : function (ap) {
                    return 0;
                },
                Z : function (ap) {
                    return -100 * Math.sin(ap);
                }
            }
        },
        childOf : []
    },
    {
        name : "MOON",
        mesh : "",
        texture : "",
        position : {
            X : 0,
            Y : 0,
            Z : 0
        },
        scale : {
            X : .00002,
            Y : .00002,
            Z : .00002
        },
        motion : {
            rotation : {
                X : 0,
                Y : 10,
                Z : 0
            },
            translation : {
                X : 0,
                Y : 0,
                Z : 0
            }
        },
        childs : []
    }

]