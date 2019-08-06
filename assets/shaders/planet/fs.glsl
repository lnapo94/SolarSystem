#version 300 es

precision mediump float;

in highp vec2 fs_uv;
in vec3 fs_pos;
in vec3 fs_norm;
in vec3 fs_cameraPosition;

uniform sampler2D uMainTexture;
uniform vec3 uLightPosition;

out vec4 outColor;


void main() {

    vec4 baseColor = texture(uMainTexture, fs_uv);
    vec3 lightColor = vec3(1.0, 1.0, 1.0);

    vec3 pointLightColor = lightColor * pow(250.0 / length(uLightPosition - fs_pos), 2.0);

    // Ambient Light
    float ambientPower = 0.25;
    vec3 ambient = ambientPower * lightColor;

    // Diffuse Light
    vec3 lightDir = normalize(uLightPosition - fs_pos);
    float diffuseAngle = max(dot(fs_norm, lightDir), 0.0);
    float diffusePower = 200.0;
    vec3 diffuse = diffuseAngle * pointLightColor * diffusePower;

    vec3 finalColor = (ambient + diffuse) * baseColor.rgb;

    outColor = vec4(finalColor, 1.0);
}