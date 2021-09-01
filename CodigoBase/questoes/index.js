import { Questao } from './questaoClass.js';

import { criaQuestao1 } from './questao1.js';

/**
 * Retorna array com todas as questões construidas
 * 
 * @returns {Array<Questao>}
 */
export function getAllQuestoes(controles, width, height) {
    return [
        criaQuestao1(controles, width, height)
    ];
}