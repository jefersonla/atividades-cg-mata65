/**
 * Tipo tupla para retornos dos indíces (0) e dos vértices (1)
 * @typedef {[Array<number>, Float32Array]} MeshTuple
 */

/**
 * Tipo n-upla para retorno dos índices que formam um triangulo
 * @typedef {[number, number, number]} TriangleIndexes
 */

/**
 * Tipo n-tupla para retorno dos vértices que formam os dois triangulos
 * que criam o retangulo básico
 * @typedef {[number, number, number, number, number, number]} RectangleIndexes
 */

/**
 * Enum dos tipos possíveis de malha de triangulos
 */
export const TriangleMeshTypes = {
    /**
     * Quadrados formados por triângulos da esquerda para direita.
     */
    LEFT_TO_RIGHT: 0,
    
    /**
     * Quadrados formados por triângulos da direita para esquerda.
     */
    RIGHT_TO_LEFT: 1,
    RIGHT_TO_LEFT_OK: 4,

    /**
     * Quadrados formados por triângulos que se sobrepõem em formato de X.
     */
    CROSSED: 2,

    /**
     * Cada quadrado alterna a direção dos triangulos que o formam,
     * as linhas também se alternam formando assim losangos a cada
     * conjunto de 4 quadrados (2x2).
     */
    RHOMBUS: 3
};

/**
 * Enum dos tipos de retangulo formado por triangulos básicos
 */
export const SingleRectagleMeshTypes = {
    LEFT_TO_RIGHT: 0,
    RIGHT_TO_LEFT: 1,
    CROSSED: 2
};

/**
 * Utilitário para converter posição bidimensional (linha e coluna) para um array
 * unidimensional.
 * 
 * @param {number} row Indice da linha (0 indexed)
 * @param {number} col Indice da coluna (0 indexed)
 * @param {number} rowSize Tamanho da linha
 * @returns {number} Indíce do vetor
 */
export function positionToCellIdx(row, col, rowSize) {
    return (row * rowSize) + col;
}

/**
 * 
 * @param {number} rectType Tipo de retangulo
 * @param {number} i Número da linha
 * @param {number} j Número da coluna
 * @param {number} rowSize Tamanho da linha
 * @returns {TriangleIndexes} Retorna 3 indices que formam o 
 */
export function generateSingleRectangleMesh(rectType, i, j, rowSize) {
    const ret = [];

    switch (rectType) {
        case SingleRectagleMeshTypes.LEFT_TO_RIGHT:
        case SingleRectagleMeshTypes.CROSSED:
            // Upper
            ret.push(
                positionToCellIdx(i    , j    , rowSize),
                positionToCellIdx(i + 1, j    , rowSize),
                positionToCellIdx(i + 1, j + 1, rowSize),
            );

            // Bottom
            ret.push(
                positionToCellIdx(i    , j    , rowSize),
                positionToCellIdx(i    , j + 1, rowSize),
                positionToCellIdx(i + 1, j + 1, rowSize),
            );

            if (rectType == SingleRectagleMeshTypes.CROSSED) {
                // Cross
                ret.push(
                    positionToCellIdx(i + 1, j    , rowSize),
                    positionToCellIdx(i    , j + 1, rowSize),
                    positionToCellIdx(i + 1, j + 1, rowSize),
                );
            }

            break;
        case SingleRectagleMeshTypes.RIGHT_TO_LEFT:
            // Desenhamos o triangulo duas vezes para por o cursor
            // no ponto de início e assim evitar problemas com linhas
            // indesejadas cruzando nossa malha
            ret.push(
                positionToCellIdx(i    , j    , rowSize),
                positionToCellIdx(i + 1, j    , rowSize),
                positionToCellIdx(i    , j + 1, rowSize),
            );
        case SingleRectagleMeshTypes.RIGHT_TO_LEFT_OK:
            // Upper    
            ret.push(
                positionToCellIdx(i    , j + 1, rowSize),
                positionToCellIdx(i    , j    , rowSize),
                positionToCellIdx(i + 1, j    , rowSize),
            );
            
            // Bottom
            ret.push(
                positionToCellIdx(i + 1, j + 1, rowSize),
                positionToCellIdx(i    , j + 1, rowSize),
                positionToCellIdx(i + 1, j    , rowSize),
            );

            break;
    }

    return ret;
}

/**
 * Gera os vértices para a malha de triângulos,.
 * 
 * @param {number} width Tamanho da largura do retangulo
 * @param {number} height Tamanho da altura do retangulo
 * @param {number} divisionsWidth Divisões por largura
 * @param {number} divisionsHeight Divisões por altura
 * @param {number} meshType Tipo de malha
 * @returns {MeshTuple} Vértices e indíces do retangulo
 */
 export function generateTriangleMesh(width, height, divisionsWidth, divisionsHeight, meshType = TriangleMeshTypes.RHOMBUS) {
    const vertices = [];
    const indices = [];

    const pontoInicial = [ -width / 2, height / 2 ];

    const verticesLinha = divisionsWidth + 1;
    const verticesColuna = divisionsHeight + 1;
    
    const distanciaSecaoLargura = width / divisionsWidth;
    const distanciaSecaoAltura = height / divisionsHeight;
    
    for (let i = 0; i < verticesColuna; i++) {
        for (let j = 0; j < verticesLinha; j++) {
            // Adiciona os vértices
            vertices.push(
                pontoInicial[0] + (j * distanciaSecaoLargura),
                pontoInicial[1] - (i * distanciaSecaoAltura),
                0
            );

            // Adiciona os indices que formam a malha de triangulos
            if ( 
                (i < (verticesColuna - 1)) && 
                (j < (verticesLinha - 1))
            ) {
                switch (meshType) {
                    case TriangleMeshTypes.RHOMBUS:
                        if (
                            ((i % 2 === 0) && (j % 2 === 0)) || 
                            ((i % 2 === 1) && (j % 2 === 1))
                        ) {
                            indices.push(...generateSingleRectangleMesh(
                                SingleRectagleMeshTypes.LEFT_TO_RIGHT,
                                i, j, verticesLinha
                            ));
                        } else {
                            indices.push(...generateSingleRectangleMesh(
                                SingleRectagleMeshTypes.RIGHT_TO_LEFT_OK,
                                i, j, verticesLinha
                            ));
                        }
                        break;
                    case TriangleMeshTypes.LEFT_TO_RIGHT:
                    case TriangleMeshTypes.RIGHT_TO_LEFT:
                    case TriangleMeshTypes.CROSSED:
                        indices.push(...generateSingleRectangleMesh(
                            meshType, i, j, verticesLinha
                        ));
                        break;
                }
            }
        }
    }

    return [
        new Float32Array(vertices),
        meshType == TriangleMeshTypes.LEFT_TO_RIGHT 
            ? indices.reverse()
            : indices
    ];
}