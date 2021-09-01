import { glsl } from '../utils/index.js';

/** @type {string} Vertex Shader Questão 1 SubQuestão B e C */
export const questao1BCVertexShader = glsl`

varying vec3 rgbColor;

// Ver https://www.laurivan.com/rgb-to-hsv-to-rgb-for-shaders/
vec3 hsv2rgb(vec3 c)
{
    vec4 K = vec4(1.0, 2.0 / 3.0, 1.0 / 3.0, 3.0);
    vec3 p = abs(fract(c.xxx + K.xyz) * 6.0 - K.www);
    return c.z * mix(K.xxx, clamp(p - K.xxx, 0.0, 1.0), c.y);
}

void main() {
    rgbColor = hsv2rgb(vec3(position.x * 0.2, 1, 1));

    gl_Position = vec4(position, 1.5 );
}
`;

/** @type {string} Fragment Shader Questão 1 SubQuestão B e C */
export const questao1BCFragmentShader = glsl`

varying vec3 rgbColor;
 
void main() {
    gl_FragColor.rgb = rgbColor;
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

varying vec3 rgbColor;

void main() {
    rgbColor = vec3(0,0,0);

    if (position.x >= 0.0 && position.y >= 0.0) {
        if (position.y <= (radius / 2.0)) {
            rgbColor = vec3(
                (position.y / (radius / 2.0)),
                0.0,
                0.0
            );
        } else {
            rgbColor = vec3(
                radius,
                (position.y - (radius / 2.0)) / (radius / 2.0),
                0.0
            );
        }
    } else if (position.x < 0.0 && position.y >= 0.0) {
        if (position.y >= (radius / 2.0)) {
            rgbColor = vec3(
                ((position.y - (radius / 2.0)) / (radius / 2.0)),
                radius,
                0.0
            );
        } else {
            rgbColor = vec3(
                0.0,
                radius,
                radius - (position.y / (radius / 2.0))
            );
        }
    } 
    else if (position.x < 0.0 && position.y < 0.0) {
        if (position.y >= -(radius / 2.0)) {
            rgbColor = vec3(
                0.0,
                radius - ((position.y * - radius) / (radius / 2.0)),
                radius
            );
        } else {
            rgbColor = vec3(
                (((position.y * - radius) - (radius / 2.0)) / (radius / 2.0)),
                0.0,
                radius
            );
        }
    } else if (position.x >= 0.0 && position.y < 0.0) {
        if (position.y <= -(radius / 2.0)) {
            rgbColor = vec3(
                radius,
                0.0,
                (((position.y * - radius) - (radius / 2.0)) / (radius / 2.0))
            );
        } else {
            rgbColor = vec3(
                ((position.y * - radius) / (radius / 2.0)),
                0.0,
                0.0
            );
        }
    }

    gl_Position = vec4(position, 1.5 );
}
`;

/** @type {string} Fragment Shader Questão 1 SubQuestão A */
export const questao1AFragmentShader = glsl`
uniform float radius;

varying vec3 rgbColor;
 
void main() {
    gl_FragColor.rgb = rgbColor;
}
`;