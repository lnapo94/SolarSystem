#version 300 es

in vec3 a_position;
in vec2 a_uv;

uniform mat4 uPMatrix;
uniform mat4 uCameraMatrix;
uniform mat4 uMVMatrix;

out vec2 uvFS;

void main() {
    uvFS = a_uv;
    gl_Position = uPMatrix * uCameraMatrix * uMVMatrix * vec4(a_position,1.0);
}
