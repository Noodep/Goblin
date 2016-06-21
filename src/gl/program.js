/**
 * @fileOverview Class representing an OpenGL ES program
 * @author Noodep
 * @version 0.14
 */
'use strict';

import {dl, l, el} from '../log.js';

export default class Program {

	/**
	 * @constructor
	 * @memberOf module:gl
	 * @alias Program
	 *
	 * Creates a shader program with the specified name.
	 * If no path is specified, the function will look for shaders
	 * in the folder {@code DEFAULT_SHADER_PATH/name/name.{vert|frag}}
	 * 
	 * @param {WebGLRenderingContext} context - The context with which this program will be associated.
	 * @param {string} name - Name of this program.
	 * @param {string} [path=DEFAULT_SHADER_PATH] - Location of the shaders directory.
	 * @return {module:gl.Program} - The newly created Program.
	 */
	constructor({context, name, path = Program.DEFAULT_SHADER_PATH} = {}) {
		this._context = context;
		if(!name)
			throw new Error('Name required in order to create a program.');

		this._name = name;
		this._shaders = new Map();
		this._program = undefined;
		this._parameters = new Map();
		this._parameters.set(WebGLRenderingContext.ACTIVE_UNIFORMS, new Map());
		this._parameters.set(WebGLRenderingContext.ACTIVE_ATTRIBUTES, new Map());

		if(!path.endsWith('/'))
			path += '/';
		this._path = `${path}${name}/`;
	}

	/**
	 * Return a promise that succeed when the program is loaded and ready to be used.
	 *
	 * @return {Promise} a promise that succeed when this program is ready.
	 */
	ready() {
		const shaders = [
			this.createShader(WebGLRenderingContext.VERTEX_SHADER),
			this.createShader(WebGLRenderingContext.FRAGMENT_SHADER)
		];

		return Promise.all(shaders)
			.then(this.compileProgram.bind(this))
			.then(this.qualifyAll.bind(this));
	}

	/**
	 * Creates a shader of the specified type.
	 * This function tries to retreive a shader file at the URL _path/_name/_name.type-ext
	 * If successful, it then proceed to compile the shader.
	 *
	 * @param {Number} type - Must be WebGLRenderingContext.VERTEX_SHADER or WebGLRenderingContext.FRAGMENT_SHADER.
	 * @return {Promise} - A promise that resolves when the shader is loaded and compiled.
	 */ 
	createShader(type) {
		const file = this._path + this._name + Program.SHADER_EXTENSIONS.get(type);
		const c = this._context;
		dl(`Loading : ${file}`);
		return fetch(file)
			.then(response => response.text())
			.then((body) => {
				dl(`Creating ${type==WebGLRenderingContext.VERTEX_SHADER?'vertex':'fragment'} shader for program "${this._name}".`);
				const shader = c.createShader(type);
				c.shaderSource(shader, body);
				c.compileShader(shader);
				if(!c.getShaderParameter(shader, WebGLRenderingContext.COMPILE_STATUS))
					throw new Error("Error compiling shader: " + c.getShaderInfoLog(shader));
				this._shaders.set(type, shader);
				return shader;
			});
	}

	compileProgram(shaders) {
		dl(`Compiling program ${this._name}.`);
		const c = this._context;
		this._program = c.createProgram();
		shaders.forEach(shader => c.attachShader(this._program, shader));

		c.linkProgram(this._program);
		if(!c.getProgramParameter(this._program, WebGLRenderingContext.LINK_STATUS))
			throw new Error(`Unable to ling program "${this._name}"`);

		c.validateProgram(this._program);
		if(!c.getProgramParameter(this._program, WebGLRenderingContext.VALIDATE_STATUS))
			throw new Error(`Unable to validate program "${this._name}"`);
	}

	qualifyAll() {
		const params = [
			this.qualify(WebGLRenderingContext.ACTIVE_UNIFORMS),
			this.qualify(WebGLRenderingContext.ACTIVE_ATTRIBUTES)
		];

		return Promise.all(params);
	}

	qualify(parameter) {
		dl(`Initializing shader ${parameter==WebGLRenderingContext.ACTIVE_ATTRIBUTES?'attributes':'uniforms'}.`);
		const c = this._context;
		const num = c.getProgramParameter(this._program, parameter);
		const p_func = Program.QUALIFYING_FUNCTION.get(parameter);
		const a_func = `getActive${p_func}`;
		const l_func = `get${p_func}Location`;

		for(let idx = 0 ; idx < num ; idx++) {
			const info = c[a_func](this._program, idx);
			const location = c[l_func](this._program, info.name);
			this._parameters.get(parameter).set(info.name, location);
			dl(`Found ${p_func} : ${info.name} with index ${location}`);
		}
	}
}

Program.DEFAULT_SHADER_PATH = '/shaders/';

Program.SHADER_EXTENSIONS = new Map();
	Program.SHADER_EXTENSIONS.set(WebGLRenderingContext.VERTEX_SHADER, '.vert');
	Program.SHADER_EXTENSIONS.set(WebGLRenderingContext.FRAGMENT_SHADER, '.frag');

Program.QUALIFYING_FUNCTION = new Map();
	Program.QUALIFYING_FUNCTION.set(WebGLRenderingContext.ACTIVE_UNIFORMS, 'Uniform');
	Program.QUALIFYING_FUNCTION.set(WebGLRenderingContext.ACTIVE_ATTRIBUTES, 'Attrib');

