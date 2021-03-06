import { glsl } from '../utils/index.js';

/** @type {string} Vertex Shader Questão 1 SubQuestão B e C */
export const questao1BCVertexShader = glsl`

varying vec3 vPosition;

void main() {
    gl_Position = vec4(position, 1.5 );
    vPosition = vec3(position);
}
`;

/** @type {string} Fragment Shader Questão 1 SubQuestão B e C */
export const questao1BCFragmentShader = glsl`
varying vec3 vPosition;

// Ver https://www.laurivan.com/rgb-to-hsv-to-rgb-for-shaders/
vec3 hsv2rgb(vec3 c)
{
    vec4 K = vec4(1.0, 2.0 / 3.0, 1.0 / 3.0, 3.0);
    vec3 p = abs(fract(c.xxx + K.xyz) * 6.0 - K.www);
    return c.z * mix(K.xxx, clamp(p - K.xxx, 0.0, 1.0), c.y);
}

void main() {
    gl_FragColor.rgb = hsv2rgb(vec3(vPosition.x * 0.2, 1, 1));;
}
`;

//       BEGIN    ---     END
// *   0,   0,   0 - 255,   0,   0 START
// * 255,   0,   0 - 255, 255,   0 
// * 255, 255,   0 -   0, 255,   0
// *   0, 255,   0 -   0, 255, 255
// *   0, 255, 255 -   0,   0, 255
// *   0,   0, 255 - 255,   0, 255
// * 255,   0, 255 - 255,   0,   0
// * 255,   0,   0 -   0,   0,   0 END

/** @type {string} Vertex Shader Questão 1 SubQuestão A */
export const questao1AVertexShader = glsl`
uniform float radius;

varying vec3 vPosition;

void main() {
    gl_Position = vec4(position, 1.5 );
    vPosition = vec3(position);
}
`;

/** @type {string} Fragment Shader Questão 1 SubQuestão A */
export const questao1AFragmentShader = glsl`
uniform float radius;

varying vec3 vPosition;
 
void main() {
    vec3 rgbColor = vec3(0,0,0);

    if (vPosition.x >= 0.0 && vPosition.y >= 0.0) {
        if (vPosition.y <= (radius / 2.0)) {
            rgbColor = vec3(
                (vPosition.y / (radius / 2.0)),
                0.0,
                0.0
            );
        } else {
            rgbColor = vec3(
                radius,
                (vPosition.y - (radius / 2.0)) / (radius / 2.0),
                0.0
            );
        }
    } else if (vPosition.x < 0.0 && vPosition.y >= 0.0) {
        if (vPosition.y >= (radius / 2.0)) {
            rgbColor = vec3(
                ((vPosition.y - (radius / 2.0)) / (radius / 2.0)),
                radius,
                0.0
            );
        } else {
            rgbColor = vec3(
                0.0,
                radius,
                radius - (vPosition.y / (radius / 2.0))
            );
        }
    } 
    else if (vPosition.x < 0.0 && vPosition.y < 0.0) {
        if (vPosition.y >= -(radius / 2.0)) {
            rgbColor = vec3(
                0.0,
                radius - ((vPosition.y * - radius) / (radius / 2.0)),
                radius
            );
        } else {
            rgbColor = vec3(
                (((vPosition.y * - radius) - (radius / 2.0)) / (radius / 2.0)),
                0.0,
                radius
            );
        }
    } else if (vPosition.x >= 0.0 && vPosition.y < 0.0) {
        if (vPosition.y <= -(radius / 2.0)) {
            rgbColor = vec3(
                radius,
                0.0,
                (((vPosition.y * - radius) - (radius / 2.0)) / (radius / 2.0))
            );
        } else {
            rgbColor = vec3(
                ((vPosition.y * - radius) / (radius / 2.0)),
                0.0,
                0.0
            );
        }
    }

    gl_FragColor.rgb = rgbColor;
}
`;