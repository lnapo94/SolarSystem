#version 300 es

in vec3 a_position;
in vec3 a_norm;
in vec2 a_uv;

uniform mat4 uPMatrix;
uniform mat4 uCameraMatrix;
uniform mat4 uMVMatrix;

uniform mat3 uNormalMatrix;

uniform vec3 uCameraPosition;

out highp vec2 fs_uv;
out vec3 fs_pos;
out vec3 fs_norm;
out vec3 fs_cameraPosition;

void main() {
    vec4 worldPosition = uMVMatrix * vec4(a_position, 1.0);

    // Out to fragment shader in WORLD SPACE
    fs_pos = worldPosition.xyz;
    fs_uv = a_uv;
    fs_norm = uNormalMatrix * a_norm;
    fs_cameraPosition = (inverse(uCameraMatrix) * vec4(uCameraPosition, 1.0)).xyz;

    gl_Position = uPMatrix * uCameraMatrix * uMVMatrix * vec4(a_position,1.0);
}
