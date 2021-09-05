import { glsl } from '../utils/index.js';

/** @type {string} Vertex Shader Questão 5 */
export const questao5VertexShader = glsl`
uniform int colorType;
uniform float colorDistance;
uniform vec2 colorShift;
uniform vec3 fixedColor;

varying vec3 vPosition;

void main() {
    gl_Position = vec4(position, 1.5 );
    vPosition = vec3(position);
}
`;

/** @type {string} Fragment Shader Questão 5 */
export const questao5FragmentShader = glsl`
uniform int colorType;
uniform float colorDistance;
uniform vec2 colorShift;
uniform vec3 fixedColor;

varying vec3 vPosition;

// Ver https://www.laurivan.com/rgb-to-hsv-to-rgb-for-shaders/
vec3 hsv2rgb(vec3 c)
{
    vec4 K = vec4(1.0, 2.0 / 3.0, 1.0 / 3.0, 3.0);
    vec3 p = abs(fract(c.xxx + K.xyz) * 6.0 - K.www);
    return c.z * mix(K.xxx, clamp(p - K.xxx, 0.0, 1.0), c.y);
}

void main() {
    if (colorType == 1) {
        gl_FragColor.rgb = hsv2rgb(vec3(((vPosition.x * colorShift.x) + (vPosition.y * colorShift.y)) * colorDistance, 1, 1));
    } else {
        gl_FragColor.rgb = fixedColor;
    }
}
`;