import { glsl } from '../utils/index.js';

/** @type {string} Vertex Shader Questão 7 */
export const questao7VertexShader = glsl`
uniform float lightnessHeight;
uniform float radius;

varying vec3 vPosition;

void main() {
    gl_Position = vec4(position, 1.5);
    vPosition = vec3(position);
}
`;

/** @type {string} Fragment Shader Questão 7 */
export const questao7FragmentShader = glsl`
uniform float lightnessHeight;
uniform float radius;

varying vec3 vPosition;

const float pi = 3.141592653589793;

vec3 hsl2rgb(in vec3 c)
{
    vec3 rgb = clamp(
        abs(
            mod(
                c.x * 6.0 + vec3(0.0,4.0,2.0),
                6.0
            ) - 3.0
        ) - 1.0,
        0.0,
        1.0
    );

    return c.z + c.y * (rgb-0.5)*(1.0-abs(2.0*c.z-1.0));
}

void main() {
    float levelRadius = (1.0 - ((abs(lightnessHeight - 0.5) / 0.5) * radius)) + 0.1;

    float distanceToCenter = distance(vPosition, vec3(0,0,0)) / levelRadius;

    vec3 normalizedPos = normalize(vPosition);
    float angle = (atan(normalizedPos.y, normalizedPos.x) + pi) / (2.0 * pi);

    vec3 hsl = hsl2rgb(vec3(angle, distanceToCenter, lightnessHeight));
    gl_FragColor.rgb = distanceToCenter > levelRadius ? vec3(0,0,0): hsl;
}
`;


/** @type {string} Vertex Shader Questão 7 */
export const questao7BgVertexShader = glsl`
varying vec3 vPosition;
varying vec2 vUv;

uniform float radius;
uniform sampler2D textureBg;

void main() {
    gl_Position = vec4(position, 1.5);
    vPosition = vec3(position);
    vUv = uv;
}
`;

/** @type {string} Fragment Shader Questão 7 */
export const questao7BgFragmentShader = glsl`
varying vec3 vPosition;
varying vec2 vUv;

uniform float radius;
uniform sampler2D textureBg;

void main() {
    gl_FragColor = texture2D(textureBg, vUv);

    gl_FragColor.a = distance(vPosition, vec3(0,0,0)) > radius ? 1.0 : 0.0;
}
`;