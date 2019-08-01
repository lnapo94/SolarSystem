#version 300 es

in vec4 a_position;
out vec4 v_position;

void main() {
    v_position = a_position;
    gl_Position = a_position;
}