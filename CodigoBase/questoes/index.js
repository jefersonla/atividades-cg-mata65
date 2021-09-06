import { Questao } from './questaoClass.js';

import { criaQuestao1 } from './questao1.js';
import { criaQuestao2 } from './questao2.js';
import { criaQuestao3 } from './questao3.js';
import { criaQuestao4 } from './questao4.js';
import { criaQuestao5 } from './questao5.js';
import { criaQuestao6 } from './questao6.js';
import { criaQuestao7 } from './questao7.js';

/**
 * Retorna array com todas as questões construidas
 * 
 * @returns {Promise<Array<Questao>>}
 */
export async function getAllQuestoes(controles, width, height) {
    return await Promise.all([
        // criaQuestao1(controles, width, height),
        // criaQuestao2(controles, width, height),
        // criaQuestao3(controles, width, height),
        // criaQuestao4(controles, width, height),
        // criaQuestao5(controles, width, height),
        criaQuestao6(controles, width, height),
        criaQuestao7(controles, width, height)
    ]);
}