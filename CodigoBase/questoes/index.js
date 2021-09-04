import { Questao } from './questaoClass.js';

import { criaQuestao1 } from './questao1.js';
import { criaQuestao2 } from './questao2.js';
import { criaQuestao3 } from './questao3.js';
import { criaQuestao4 } from './questao4.js';

/**
 * Retorna array com todas as questões construidas
 * 
 * @returns {Array<Questao>}
 */
export function getAllQuestoes(controles, width, height) {
    return [
        criaQuestao1(controles, width, height),
        criaQuestao2(controles, width, height),
        criaQuestao3(controles, width, height),
        criaQuestao4(controles, width, height)
    ];
}