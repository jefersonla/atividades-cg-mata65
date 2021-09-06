import { glsl } from '../utils/index.js';

/** @type {string} Vertex Shader Questão 6 */
export const questao6VertexShader = glsl`
uniform int cutColor;
uniform float cutColorHeight;

uniform float geometryHeight;
uniform float geometryWidth;

varying vec2 cPosition;

void main() {
    gl_Position = vec4(position, 1.5);
    cPosition = vec2(
        1.0 - distance(position, vec3(geometryWidth / 2.0, position.y, 0)) / geometryWidth,
        1.0 - distance(position, vec3(position.x, geometryHeight / 2.0, 0)) / geometryHeight
    );
}
`;

/** @type {string} Fragment Shader Questão 6 */
export const questao6FragmentShader = glsl`
uniform int cutColor;
uniform float cutColorHeight;

uniform float geometryHeight;
uniform float geometryWidth;

varying vec2 cPosition;

void main() {
    gl_FragColor.rgb = vec3(
        cutColor != 0
            ? cPosition.x
            : cutColorHeight,
        cutColor != 1
            ? ( 
                cutColor == 0 
                    ? cPosition.x
                    : cPosition.y
            )
            : cutColorHeight,
        cutColor != 2
            ? cPosition.y
            : cutColorHeight
    );
}
`;


/** @type {string} Vertex Shader Questão 6 */
export const questao6BgVertexShader = glsl`
varying vec3 vPosition;
varying vec2 vUv;

uniform float geometryHeight;
uniform float geometryWidth;

uniform sampler2D textureBg;

uniform vec2 uResolution;

void main() {
    gl_Position = vec4(position, 1.5);
    vPosition = vec3(position);
    vUv = uv;
}
`;

/** @type {string} Fragment Shader Questão 6 */
export const questao6BgFragmentShader = glsl`
varying vec3 vPosition;
varying vec2 vUv;

uniform float geometryHeight;
uniform float geometryWidth;

uniform sampler2D textureBg;

void main() {
    gl_FragColor = texture2D(textureBg, vUv);

    gl_FragColor.a = 
        (
            (vPosition.x > -(geometryWidth / 2.0) - 0.05) &&
            (vPosition.x < (geometryWidth / 2.0) + 0.05)
        ) &&
        (
            (vPosition.y > -(geometryHeight / 2.0) - 0.05) &&
            (vPosition.y < (geometryHeight / 2.0) + 0.05)
        ) ? 0.0 : 1.0;
}
`;