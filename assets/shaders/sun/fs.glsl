#version 300 es

precision mediump float;

in vec2 uvFS;
out vec4 outColor;
uniform sampler2D uMainTexture;

void main() {
    outColor = texture(uMainTexture, uvFS) * 1.3;
}