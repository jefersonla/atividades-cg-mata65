import { rotate } from './index.js';

/**
 * Gera os vértices da geometria de uma circunferência
 * 
 * @param {number} radius Raio da circunferencia
 * @param {number} steps Número de passos (componentes) da aproximação
 * @param {number} innerLines Define a circunferência
 * @returns {Float32Array} Array de vertices da geometria gerada
 */
export function generateCircleGeometry(
    radius,
    steps = 32,
    innerLines = false
) {
    // Primeiro vértice é fixo no eixo x
    const vertices = [];
    const stepSize = 360 / steps;

    for (let i = 0; i < steps; i++) {
        const currentAngle = (i * stepSize);
        const p1 = new Float32Array([
            ...rotate(radius, 0, currentAngle),
            0
        ]);
        
        if (innerLines) {
            const nextAngle = ((i * stepSize) + stepSize);
            const p2 = new Float32Array([
                ...rotate(radius, 0, nextAngle),
                0
            ]);

            vertices.push(...[
                0, 0, 0,
                ...p1,
                ...p2
            ]);
        }
        else {
            // O ponto p2 só é necessário para formar os triangulos
            // sem o uso de indices para evitar duplicação de arestas  
            vertices.push(...[
                ...p1
            ]);
        }
    }

    return new Float32Array(vertices);
}