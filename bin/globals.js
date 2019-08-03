// here to put variables that need to be shared among different files

// URLs

let baseURL = '.';

let sunShader = baseURL + '/assets/shaders/sun';
let vs_sunURL = sunShader + '/vs.glsl';
let fs_sunURL = sunShader + '/fs.glsl';

let skyShader = baseURL + '/assets/shaders/skymap';
let vs_skyURL = skyShader + '/vs.glsl';
let fs_skyURL = skyShader + '/fs.glsl';

let canvas = null;
let gl = null;
