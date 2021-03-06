/**
 * Gera os vértices para a geometria de um triangulo retangulo.
 * 
 * @param {number} width Tamanho da largura do triangulo
 * @param {number} height Tamanho da altura do triangulo
 * @param {boolean} fromCenter Indica se o triangulo deve ser posicionado a partir do seu centro interno ou a partir da origem.
 * @returns {Float32Array} Vértices do triangulo.
 */
 export function generateTriangleRectangle(width, height, fromCenter = true) {
    return new Float32Array(fromCenter
        ? [
            -width / 2, -height / 2, 0,
            width / 2, height / 2, 0,
            width / 2, -height / 2, 0,
            -width / 2, -height / 2, 0,
        ]
        : [
            0, 0, 0,
            width, height, 0,
            width, 0, 0,
            0, 0, 0
        ]
    );
}