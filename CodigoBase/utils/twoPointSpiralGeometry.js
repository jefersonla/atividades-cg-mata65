import { rotate } from './index.js';

/**
 * Gera os vértices de uma espiral definidas por dois pontos no eixo x.
 * A ideia dessa espiral é a de trocar o centro a cada interação e aumentar o raio
 * na parte superior e depois na parte inferior.
 * 
 * @param {number} startRadius Raio da primeira seção
 * @param {number} numberOfRevolutions Número de voltas
 * @param {number} steps Precisão das seções da aproximação
 * @returns {Float32Array} Vértices de uma espiral definida por dois pontos
 */
export function generateTwoPointSpiralGeometry(
    startRadius,
    numberOfRevolutions = 1,
    steps = 32
) {
    const vertices = [];
    const stepSize = 360 / steps;

    let radius = startRadius;

    const center1 = { x: 0, y: 0 };
    const center2 = { x: startRadius, y: 0 };

    for (let revolutions = 0; revolutions < numberOfRevolutions; revolutions++) {        
        for (let i = 0; i < (steps / 2); i++) {
            const currentAngle = (i * stepSize);

            const p1 = new Float32Array([
                ...rotate(radius, 0, currentAngle, center1.x, center1.y),
                0
            ]);

            vertices.push(...p1);
        }

        radius += startRadius;

        for (let i = (steps / 2); i <= steps; i++) {
            const currentAngle = (i * stepSize);

            const p1 = new Float32Array([
                ...rotate(radius + center2.x, 0, currentAngle, center2.x, center2.y),
                0
            ]);

            vertices.push(...p1);
        }

        radius += startRadius;
    }

    return new Float32Array(vertices);
}
