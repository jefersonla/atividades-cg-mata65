import { rotate } from './index.js';

/**
 * Tipo tupla para retornos de posições x (0) e y (1)
 * @typedef {[number, number]} ReturnTuple
 */

/**
 * Enum das direções da aproximação da espiral formato razão de ouro 
 */
export const Directions = {
    RIGHT: 0,
    DOWN: 1,
    LEFT: 2,
    UP: 3
};

/**
 * Retorna o centro de rotação do novo quadrante alcançado para rotação da
 * espiral. Basicamente o ponto está mais ao centro em relação ao primeiro ponto.
 * 
 * @param {number} x Primeiro ponto x da aproximação
 * @param {number} y Primeiro ponto y da aproximação
 * @param {number} quadrantDirection Direção do novo centro a partir do ponto
 * @param {number} newRadius Novo raio da aproximação
 * @returns {ReturnTuple} Novo centro de rotação da aproximação
 */
export function getGoldenReasonCenterFromLastPoint(
    x, y, quadrantDirection, newRadius
) {
    switch (quadrantDirection) {
        case Directions.RIGHT:
            return [x - newRadius, y];
        case Directions.DOWN:
            return [x, y + newRadius];
        case Directions.LEFT:
            return [x + newRadius, y];
        case Directions.UP:
            return [x, y - newRadius];
    }

    return [0, 0];
}

/**
 * Gera os vértices para geometria Espiral Razão de Ouro.
 * A produção dessa espiral se baseia numa aproximação bastante
 * conhecida @see https://www.intmath.com/blog/mathematics/golden-spiral-6512
 * que consiste em criar seções com uma determinada proporção e desenhar arcos
 * de 90 graus variando o tamanho de cada raio, sempre somando o atual com o anterior
 * similar a sequência de fibonnaci.
 * 
 * @param {number} startRadius Primeiro raio
 * @param {number} numberOfRevolutions Número de voltas 
 * @param {number} maxRadius Raio máximo da espiral 
 * @param {number} steps Número de divisões da aproximação 
 * @returns {Float32Array} Vértices da geometria espiral número de ouro
 */
export function generateGoldenReasonSpiralGeometry(
    startRadius,
    numberOfRevolutions = 1,
    maxRadius = 2,
    steps = 32
) {
    const vertices = [];
    const stepSize = 90 / steps;

    let prevRadius = startRadius;
    let actualRadius = startRadius;
    let quadrantOffset = 0;
    let actualNumberOfRevolutions = 0;

    let p2Vertices;

    while (
        actualRadius <= maxRadius &&
        actualNumberOfRevolutions < numberOfRevolutions
    ) {
        const quadrantOffsetNormalized = quadrantOffset % 4;
        
        if (quadrantOffsetNormalized == Directions.RIGHT) {
            actualNumberOfRevolutions++;
        }

        const [cx, cy] = getGoldenReasonCenterFromLastPoint(
            p2Vertices != null ? p2Vertices[0] : startRadius,
            p2Vertices != null ? p2Vertices[1] : 0,
            quadrantOffsetNormalized,
            actualRadius
        );

        for (let i = 0; i <= steps; i++) {
            const baseCurrentAngle = (i * stepSize);
            const baseNextAngle = (i * stepSize) + stepSize;

            const currentAngle = ((baseCurrentAngle + (90 * quadrantOffset)) % 360);
            const nextAngle = ((baseNextAngle + (90 * quadrantOffset)) % 360);

            let p1Vertices = [0, 0];
            p2Vertices = [0, 0];

            switch (quadrantOffsetNormalized) {
                case Directions.RIGHT:
                    p1Vertices = rotate(cx + actualRadius, cy, currentAngle, cx, cy);
                    p2Vertices = rotate(cx + actualRadius, cy, nextAngle, cx, cy);
                    break;
                case Directions.DOWN:
                    p1Vertices = rotate(cx + actualRadius, cy, currentAngle, cx, cy);
                    p2Vertices = rotate(cx + actualRadius, cy, nextAngle, cx, cy);
                    break;
                case Directions.LEFT:
                    p1Vertices = rotate(cx + actualRadius, cy, currentAngle, cx, cy);
                    p2Vertices = rotate(cx + actualRadius, cy, nextAngle, cx, cy);
                    break;
                case Directions.UP:
                    p1Vertices = rotate(cx + actualRadius, cy, currentAngle, cx, cy);
                    p2Vertices = rotate(cx + actualRadius, cy, nextAngle, cx, cy);
                    
                    if (
                        actualNumberOfRevolutions == numberOfRevolutions &&
                        p2Vertices[1] < 0
                    ) {
                        continue;
                    }

                    break;
            }

            const p1 = new Float32Array([
                ...p1Vertices,
                0
            ]);
            const p2 = new Float32Array([
                ...p2Vertices,
                0
            ]);

            vertices.push(...p1, ...p2);
        }

        quadrantOffset++;
        actualRadius += prevRadius;
        prevRadius = actualRadius - prevRadius;
    }

    return new Float32Array(vertices);
}