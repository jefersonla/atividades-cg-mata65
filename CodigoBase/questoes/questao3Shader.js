import { glsl } from '../utils/index.js';

/** @type {string} Vertex Shader Questão 3 */
export const questao3VertexShader = glsl`
uniform float radius;

const float pi = 3.141592653589793;

varying vec3 vPosition;

void main() {
    gl_Position = vec4(position, 1.5);
    vPosition = vec3(position);
}
`;

/** @type {string} Fragment Shader Questão 3 */
export const questao3FragmentShader = glsl`
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

vec3 rgb2hsl(in vec3 c){    
    float cMin = min(c.r, min(c.g, c.b));
	float cMax = max(c.r, max(c.g, c.b));
    
    float h = 0.0;
	float s = 0.0;
	float l = (cMax + cMin) / 2.0;

	if (cMax > cMin) {
		float cDelta = cMax - cMin;
        
        s = l < 0.0 
            ? cDelta / (cMax + cMin) 
            : cDelta / ( 2.0 - (cMax + cMin) );
        
		if (c.r == cMax) {
			h = (c.g - c.b) / cDelta;
		} else if (c.g == cMax) {
			h = 2.0 + (c.b - c.r) / cDelta;
		} else {
			h = 4.0 + (c.r - c.g) / cDelta;
		}

		if (h < 0.0) {
			h += 6.0;
		}

		h = h / 6.0;
	}
	
    return vec3(h, s, l);
}

void main() {
    vec3 normalizedPos = normalize(vPosition);
    float angle = (atan(normalizedPos.y, normalizedPos.x) + pi) / (2.0 * pi);
    float distanceToCenter = distance(vPosition, vec3(0.0,0.0,0.0));

    vec3 rgbColor;
    if (vPosition.y > 0.0) {
        rgbColor = vec3(
            0.0,
            (angle/pi) / 2.0,
            1.0 - (angle/pi) / 2.0
        );
    } else {
        rgbColor = vec3(
            0.0,
            1.0 - (angle/pi) / 2.0,
            (angle/pi) / 2.0
        );
    }

    vec3 hslColor = rgb2hsl(rgbColor);
    hslColor.z = 1.0 - (distanceToCenter/radius) / 2.0;
    rgbColor = hsl2rgb(hslColor);

    gl_FragColor.rgb = rgbColor;
}
`;

/** @type {string} Vertex Shader Questão 3 - C */
export const questao3CVertexShader = glsl`
uniform float radius;
uniform float steps;

const float pi = 3.141592653589793;

varying vec3 vPosition;

void main() {
    gl_Position = vec4(position, 1.5);
    vPosition = vec3(position);
}
`;

/** @type {string} Fragment Shader Questão 3 - C */
export const questao3CFragmentShader = glsl`
uniform float radius;
uniform float steps;

varying vec3 vPosition;

const float pi = 3.141592653589793;

void main() {
    vec3 normalizedPos = normalize(vPosition);
    float angle = acos(dot(normalizedPos, vec3(1.0, 0.0, 0.0)));
    float distanceToCenter = distance(vPosition, vec3(0.0,0.0,0.0));

    if (vPosition.y > 0.0) {
        gl_FragColor.rgb = vec3(1.0,1.0,1.0);
        gl_FragColor.a = mod(angle, (pi / steps));
    } else {
        gl_FragColor.rgb = vec3(0.0,0.0,0.0);
        gl_FragColor.a = mod(angle, (pi / steps));
    }
}
`;