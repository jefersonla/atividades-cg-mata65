/**
 * Gera os vértices para a geometria de um retangulo.
 * 
 * @param {number} width Tamanho da largura do retangulo
 * @param {number} height Tamanho da altura do retangulo
 * @param {boolean} fromCenter Indica se o retangulo deve ser posicionado a 
 * partir do seu centro interno ou a partir da origem.
 * @param {boolean} innerLine Constroi o objeto com o uso de triangulos
 * @returns {Float32Array} Vértices do retangulo.
 */
export function generateRectangle(width, height, fromCenter = true, innerLine = false) {
    return new Float32Array(fromCenter
        ? (
            innerLine
                ? [
                    -width / 2, -height / 2, 0,
                    -width / 2, height / 2, 0,
                    width / 2, height / 2, 0,
                    -width / 2, -height / 2, 0,
                    width / 2, -height / 2, 0,
                    width / 2, height / 2, 0,
                ]
                : [
                    -width / 2, -height / 2, 0,
                    -width / 2, height / 2, 0,
                    width / 2, height / 2, 0,
                    width / 2, -height / 2, 0,
                    -width / 2, -height / 2, 0,
                ]
        )
        : (
            innerLine
                ? [
                    0, 0, 0,
                    0, height, 0,
                    width, height, 0,
                    0, 0, 0,
                    width, 0, 0,
                    width, height, 0,
                ]
                : [
                    0, 0, 0,
                    0, height, 0,
                    width, height, 0,
                    width, 0, 0,
                    0, 0, 0
                ]
        )
    );
}