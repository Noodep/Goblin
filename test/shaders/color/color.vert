#version 300 es
precision mediump float;

in vec3 position;
in vec3 color;

uniform mat4 model;
uniform mat4 view_projection;

out vec3 v_color;

void main(void) {
	gl_Position = view_projection * model * vec4(position, 1.0);
	v_color = color;
}

