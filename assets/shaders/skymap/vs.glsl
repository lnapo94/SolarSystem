#version 300 es

in vec4 a_position;
in vec2 a_uv;

uniform mat4 uPMatrix;
uniform mat4 uMVMatrix;
uniform mat4 uCameraMatrix;

out highp vec3 texCoord;  //Interpolate UV values to the fragment shader

void main(void){
    texCoord = a_position.xyz;
    gl_Position = uPMatrix * uCameraMatrix * vec4(a_position.xyz, 1.0);
}