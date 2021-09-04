/**
 * Tipo tupla para retornos de posições x (0) e y (1)
 * @typedef {[Array<number>, Float32Array]} MeshTuple
 */

/**
 * Gera os vértices para a malha de triângulos,.
 * 
 * @param {number} width Tamanho da largura do retangulo
 * @param {number} height Tamanho da altura do retangulo
 * @param {number} divisionsWidth Divisões por largura
 * @param {number} divisionsHeight Divisões por altura
 * @returns {MeshTuple} Vértices e indíces do retangulo
 */
 export function generateTriangleMesh(width, height, divisionsWidth, divisionsHeight) {
    const vertices = [];
    const indices = [];

    const pontoInicial = [ -width / 2, height / 2 ];

    const quadradosLinha = (divisionsWidth * 2);
    const quadradosColuna = (divisionsHeight * 2);  

    const verticesLinha = quadradosLinha + 1;
    const verticesColuna = quadradosColuna + 1;
    
    const distanciaSecaoLargura = width / (divisionsWidth * 2);
    const distanciaSecaoAltura = height / (divisionsHeight * 2);
    
    for (let i = 0; i < verticesColuna; i++) {
        for (let j = 0; j < verticesLinha; j++) {
            vertices.push(
                pontoInicial[0] + (j * distanciaSecaoLargura),
                pontoInicial[1] - (i * distanciaSecaoAltura),
                0
            );

            if ( 
                (i < (verticesColuna - 1)) && 
                (j < (verticesLinha - 1))
            ) {
                const idxCell = (i * verticesLinha) + j;

                if (
                    ((i % 2 === 0) && (j % 2 === 0)) || 
                    ((i % 2 === 1) && (j % 2 === 1))
                ) {
                    indices.push(
                        idxCell,
                        idxCell + verticesLinha,
                        idxCell + verticesLinha + 1,
                    );
                    indices.push(
                        idxCell,
                        idxCell + 1,
                        idxCell + verticesLinha + 1,
                    );
                } else {
                    indices.push(
                        idxCell,
                        idxCell + verticesLinha,
                        idxCell + 1,
                    );
                    indices.push(
                        idxCell + 1,
                        idxCell + verticesLinha + 1,
                        idxCell + verticesLinha,
                    );
                }
            }
        }
    }

    indices.push(
        0,
        verticesLinha - 1,
        verticesColuna - 1
    );
    indices.push(
        verticesLinha - 1,
        verticesColuna - 1,
        verticesLinha + verticesColuna - 2
    );
    
    return [
        new Float32Array(vertices),
        indices
    ];
}