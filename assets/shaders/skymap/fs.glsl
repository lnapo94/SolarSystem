#version 300 es
precision mediump float;

in highp vec3 texCoord;
uniform samplerCube uSkyTex;

out vec4 finalColor;
void main(void){
    finalColor = texture(uSkyTex, texCoord);
}