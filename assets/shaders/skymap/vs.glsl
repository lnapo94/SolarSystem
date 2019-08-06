#version 300 es

in vec3 a_position;

uniform mat4 uPMatrix;
uniform mat4 uMVMatrix;
uniform mat4 uCameraMatrix;

out highp vec3 texCoord;  //Interpolate UV values to the fragment shader

void main(void){
    texCoord = a_position;
    gl_Position = uPMatrix * uCameraMatrix * uMVMatrix * vec4(a_position, 1.0);
}