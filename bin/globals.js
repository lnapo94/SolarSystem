// here to put variables that need to be shared among different files

/**
 *  LIST OF USEFUL URLs
 */
let baseURL = '.';

let sunShader = baseURL + '/assets/shaders/sun';
let vs_sunURL = sunShader + '/vs.glsl';
let fs_sunURL = sunShader + '/fs.glsl';

let skyShader = baseURL + '/assets/shaders/skymap';
let vs_skyURL = skyShader + '/vs.glsl';
let fs_skyURL = skyShader + '/fs.glsl';

let planetShader = baseURL + '/assets/shaders/planet';
let vs_planetURL = planetShader + '/vs.glsl';
let fs_planetURL = planetShader + '/fs.glsl';
// END OF URLs

// GLOBAL VARIABLES
let G_canvas = null;
let G_gl = null;
