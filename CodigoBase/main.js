import { GUI } from '../resources/threejs/examples/jsm/libs/dat.gui.module.js';
import { getAllQuestoes } from './questoes/index.js';
import { Questao } from './questoes/questaoClass.js';
import { updateSceneInFrame } from './utils/index.js';

// Utilizar 'var' nesse caso particular facilita o acesso global
// já que no ambiente em que estas estão sendo adicionadas
// tais variaveis irão fazer parte do objeto global window.

/** @type {GUI} Controles da página */
var controles;

/** @type {Array<Questao>} Todas questões desta atividade */
var questoes;

// Tamanho desejado da janela será de 70% da dimensão minima (altura ou largura)
const winDim = Math.min(window.innerWidth, window.innerHeight) * 0.7;

/**
 * Inicializa a interface gráfica utilizando a biblioteca dat.gui
 */
function initControles() {
    controles = new GUI();

    // Iniciar os controles
    controles.open();
};

/**
 * Atualiza todas as cenas para a lista de atividades
 */
function buildAllScenes() {
    for (const questao of questoes) {
        questao.updateRender();
    }
};

/**
 * Entrypoint da aplicação
 */
function main() {

    console.log('Inicializando ambiente!');

    // Inicia controles
    initControles();

    // Inicializa todas as questões permitindo que estas ofereçam controles adicionais
    questoes = getAllQuestoes(controles, winDim, winDim);

    // Adiciona dom das questões a página
    for (const questao of questoes) {
        questao.updatePageDom();
    }

    // Renderiza a página em 30fps
    const fps = 30;
    updateSceneInFrame(() => {
        requestAnimationFrame(buildAllScenes);
    }, fps);
    
    console.log('Ambiente inicializado com sucesso! :D');
};

main();