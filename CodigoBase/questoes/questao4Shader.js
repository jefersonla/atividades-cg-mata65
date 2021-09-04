import { glsl } from '../utils/index.js';

/** @type {string} Vertex Shader Questão 4 */
export const questao4VertexShader = glsl`
const float pi = 3.141592653589793;

varying vec3 vPosition;

void main() {
    gl_Position = vec4(position, 1.5);
    vPosition = vec3(position);
}
`;

/** @type {string} Fragment Shader Questão 4 */
export const questao4FragmentShader = glsl`
const float pi = 3.141592653589793;

varying vec3 vPosition;

void main() {
    gl_FragColor.rgb = vec3(1.0, 1.0, 1.0);
}
`;