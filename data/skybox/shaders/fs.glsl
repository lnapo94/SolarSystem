#version 300 es
precision mediump float;

uniform samplerCube u_skybox;
uniform mat4 u_viewDirectionProjectionInverse;

in vec4 v_position;

// we need to declare an output for the fragment shader
out vec4 outColor;

void main() {
    vec4 t = u_viewDirectionProjectionInverse * v_position;
    outColor = texture(u_skybox, normalize(t.xyz / t.w));
}
