import * as Three from '../../resources/threejs/build/three.module.js';
import { generateThreeJsRenderSceneCamera } from '../utils/sceneUtils.js';

/**
 * Callback de construção da cena.
 * 
 * @callback buildSceneCallback
 * @param {Three.Scene} scene
 * @param {Three.WebGLRenderer} renderer
 * @param {Three.OrthographicCamera} camera
 */

/**
 * Define uma subquestão de uma questão principal
 * 
 * @class SubQuestao
 */
export class SubQuestao {
    
    /**
     * Cria cena que representam o resultado de uma questão ou subquestão de uma atividade
     *
     * @param {string} identificadorQuestao Identificador da questão que irá armazenar essa subquestão 
     * @param {string} identificadorSubquestao Identificador da subquestão
     * @param {string} descricao Descrição da subquestão
     * @param {buildSceneCallback} cbBuildScene callback para construção da cena
     * @param {number} width Largura
     * @param {number} height Altura
     */
    constructor(
        identificadorQuestao,
        identificadorSubquestao,
        descricao,
        cbBuildScene,
        width = 250,
        height = 250
    ) {
        /** @type {string} Identificador subquestão */
        this.identificador = identificadorSubquestao;

        /** @type {string} Id da subquestão */
        this.idSubQuestao = `${identificadorQuestao}-subquestao${identificadorSubquestao}`;

        /** @type {string} Descricao da subquestão */
        this.descricao = descricao;

        // Constroi a cena
        const [scene, renderer, camera] = generateThreeJsRenderSceneCamera(width, height);

        /** @type {Three.OrthographicCamera} Camera */
        this.camera = camera;

        /** @type {Three.WebGLRenderer} Renderer */
        this.renderer = renderer;
        
        /** @type {Three.Scene} Cena */
        this.scene = scene;

        /** @type {HTMLDivElement} Dom element da subquestão */
        this.domElement = document.createElement('div');
        this.domElement.id = this.idSubQuestao;
        this.domElement.classList.add('sub-questao');

        // Chama o callback de construção de cena
        cbBuildScene(scene, renderer, camera);

        // Constroi o dom da subquestão
        this.constructDom();
    }

    /**
     * Cria a legenda para uma subquestão
     * 
     * @returns {HTMLParagraphElement} elemento com a legenda da subquestão
     */
    createLegenda() {
        /** @type {HTMLParagraphElement} */
        const legendaDom = document.createElement('p');
        legendaDom.classList.add('legenda');

        const legendaIdentificadorDom = document.createElement('strong');
        const textoLegendaIdentificadorDom = document.createTextNode(`${this.identificador}. `);
        legendaIdentificadorDom.appendChild(textoLegendaIdentificadorDom);
        legendaDom.appendChild(legendaIdentificadorDom);

        const textoLegendaDom = document.createTextNode(this.descricao);
        legendaDom.appendChild(textoLegendaDom);

        return legendaDom;
    }
    
    /**
     * Constroi o dom da subquestão:
     * 
     *    <div class="sub-questao">
     *        <canvas id="questao-1-subquestao-1"></canvas>
     *        <p class="legenda"> <strong>a.</strong> Espiral </p>
     *    </div>
     * 
     */
    constructDom() {

        // Adiciona o canvas gerado pelo renderer
        this.domElement.appendChild(this.renderer.domElement);

        // Adiciona a legenda desta subquestão
        const legenda = this.createLegenda();
        this.domElement.appendChild(legenda);
        
    }

    /**
     * Adiciona o dom da subquestão a cena
     * 
     * @param {HTMLDivElement} subQuestoesDom Dom que irá abrigar as subquestões
     */
    addSubQuestaoDom(subQuestoesDom) {

        // Verifica se o elemento já está no container de subquestões e caso esteja não faz nada
        if (subQuestoesDom.querySelector(`#${this.idSubQuestao}`) != null) {
            return;
        }

        // Caso contrario adiciona este ao container de nome 'questoes'
        subQuestoesDom.appendChild(this.domElement);
    }

    /**
     * Renderiza a subquestão
     */
    updateRender() {
        this.renderer.render(this.scene, this.camera);
    }

}

/**
 * Define uma questão
 * 
 * @class Questao
 */
export class Questao {
    
    /**
     * Constroi uma questão da atividade
     * 
     * @param {number} numero Numero da questão
     * @param {string} descricao Descrição da questão
     * @param {Array<SubQuestao>} subQuestoes Array com as subquestoes
     */
    constructor(numero, descricao, subQuestoes = []) {
        /** @type {number} Número da questão */
        this.numero = numero;

        /** @type {string} Id da questão */
        this.idQuestao = `questao${this.numero}`;

        /** @type {HTMLDivElement} */
        this.domElement = document.createElement('div');
        this.domElement.id = this.idQuestao;

        /** @type {string} Descrição da questão */
        this.descricao = descricao;

        /** @type {Array<SubQuestao>} SubQuestões */
        this.subQuestoes = subQuestoes;

        /** @type {HTMLDivElement} */
        this.subQuestoesDom = document.createElement('div');
        this.subQuestoesDom.classList.add('sub-questoes');

        // Inicializa o dom da questão
        this.constructDom();
    }

    /**
     * Adiciona uma subquestão a questão
     */
    addSubQuestao(subQuestao) {
        this.subQuestoes.push(subQuestao);
        
        return this;
    }

    /**
     * Cria titulo da questão
     * 
     * @returns {HTMLHeadingElement} elemento dom do titulo
     */
    createTitulo() {
        /** @type {HTMLHeadingElement} */
        const tituloQuestao = document.createElement('h3');

        const tituloQuestaoDestaque = document.createElement('strong');
        const textoTituloQuestaoDestaque = document.createTextNode(`Questão ${this.numero} - `);
        tituloQuestaoDestaque.appendChild(textoTituloQuestaoDestaque);

        tituloQuestao.appendChild(tituloQuestaoDestaque);

        const textoTituloQuestao = document.createTextNode(this.descricao);
        tituloQuestao.appendChild(textoTituloQuestao);

        return tituloQuestao;
    }

    /**
     * Constroi o dom da questão:
     * 
     *   <!-- Questao -->
     *   <div id="questao1">
     *
     *       <!-- TituloQuestao -->
     *       <h3>Questão 1 - Criação de formas básicas</h3>
     *       <!-- ./TituloQuestao -->
     *
     *       <!-- SubQuestoes -->
     *       <div class="sub-questoes">
     *           <!-- Espaço sub-questões -->
     *       </div>
     *       <!-- ./SubQuestoes -->
     *
     *   </div>
     *   <!-- ./Questao -->
     * 
     */
    constructDom() {
        // Adiciona o titulo
        const titulo = this.createTitulo();
        this.domElement.appendChild(titulo);

        // Adiciona espaço para sub-questões
        this.domElement.appendChild(this.subQuestoesDom);        
    }

    /**
     * Adiciona o dom da questão a página principal se este ainda não existir
     */
    addQuestaoDom() {

        // Verifica se o elemento já está na página e caso esteja não faz nada
        if (document.querySelector(`#${this.idQuestao}`) != null) {
            return;
        }

        // Caso contrario adiciona este ao container de nome 'questoes'
        document.querySelector('#questoes')
            .appendChild(this.domElement);
    }

    /**
     * Atualiza o dom da página com a questão e todas as subquestões
     */
    updatePageDom() {
        this.addQuestaoDom();
        
        for (const subQuestao of this.subQuestoes) {
            subQuestao.addSubQuestaoDom(this.subQuestoesDom);
        }
    }

    /**
     * Atualiza todos os renders
     */
    updateRender() {
        for (const subQuestao of this.subQuestoes) {
            subQuestao.updateRender();
        }
    }

}
