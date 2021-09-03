import { glsl } from '../utils/index.js';

/** @type {string} Vertex Shader Questão 2 */
export const questao2VertexShader = glsl`
uniform vec3 pointR;
uniform vec3 pointG;
uniform vec3 pointB;

varying vec3 vPosition;
varying float maxRadius;

void main() {
    maxRadius = max(
        distance(pointR, pointG),
        distance(pointR, pointB)
    );

    gl_Position = vec4(position, 1.5);
    vPosition = vec3(position);
}
`;

/** @type {string} Fragment Shader Questão 2 */
export const questao2FragmentShader = glsl`
uniform vec3 pointR;
uniform vec3 pointG;
uniform vec3 pointB;

varying vec3 vPosition;
varying float maxRadius;

void main() {
    gl_FragColor.rgb = vec3(
        distance(vPosition, pointR) / maxRadius,
        distance(vPosition, pointG) / maxRadius,
        distance(vPosition, pointB) / maxRadius
    );
}
`;