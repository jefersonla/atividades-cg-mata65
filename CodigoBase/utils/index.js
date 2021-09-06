import { GUI } from '../../resources/threejs/examples/jsm/libs/dat.gui.module.js';
/**
 * Tipo tupla para retornos de posições x (0) e y (1)
 * @typedef {[number, number]} ReturnTuple
 */

/**
 * Callback de função de atualização de cena.
 * 
 * @callback callbackUpdateFrame
 */

/**
 * Utilitário para string template formato glsl (vertex and fragment shaders)
 * Para ser utilizado com o complemento 'boyswan.glsl-literal' no Visual Studio Code.
 * 
 * @param {Array<string>} strings Array de strings do template
 * @returns String unida
 */
export const glsl = (strings) => strings.join();

/**
 * Rotaciona um ponto a partir da origem (0,0) ou a partir de um centro
 * qualquer recebido por parametro.
 * @see https://stackoverflow.com/questions/17410809/how-to-calculate-rotation-in-2d-in-javascript
 * 
 * @param {number} x Position x
 * @param {number} y Position y
 * @param {number} angle Angle of rotation
 * @param {number} cx Center of rotation x
 * @param {number} cy Center of rotation y
 * @returns {ReturnTuple} Retorna a nova posição dos pontos x, y após a rotação
 */
export function rotate(x, y, angle, cx = 0, cy = 0) {
    const radians = (Math.PI / 180) * angle;
    
    const cos = Math.cos(radians);
    const sin = Math.sin(radians);
    
    const nx = (cos * (x - cx)) + (sin * (y - cy)) + cx;
    const ny = (cos * (y - cy)) - (sin * (x - cx)) + cy;
    
    return new Float32Array([nx, ny]);
}

// Map de mudanças
var __oldValueChange = {};

/**
 * Detecta se existem mudanças num objeto qualquer se comparado a última
 * instância salva deste.
 * 
 * @param {string} identificador identificador do objeto que será verificado
 * @param {any} obj Objeto que será comparado com o anterior
 */
export function detectChanges(identificador, obj) {
    const receivedObj = JSON.stringify(obj);

    // No casa dessa referência ser nova
    if (__oldValueChange[identificador] == null) {
        // Clona o objeto na memória
        __oldValueChange[identificador] = JSON.parse(receivedObj);
        
        return false;
    }

    const memoryObj = JSON.stringify(__oldValueChange[identificador]);

    // Compara lexicograficamente
    if (receivedObj === memoryObj) {
        return false;
    }

    __oldValueChange[identificador] = JSON.parse(receivedObj);
    return true;
}

/**
 * Função para atualizar os dados periodicamente
 * 
 * @param {callbackUpdateFrame} cb Função a ser chamada a cada frame
 * @param {number} fps Número de frames por segundo 
 */
export function updateSceneInFrame(cb, fps = 30) {
    return setInterval(cb, 1000 / fps);
}

/**
 * Executa uma mesma função de atualização para um agrupamento de controles
 * 
 * @param {GUI} datGuiFolder Agrupamento
 * @param {callbackUpdateFrame} cb Função de atualização
 */
export function onFolderChanges(datGuiFolder, cb) {
    /** @type {Array<any>} */
    const controllers = datGuiFolder.__controllers;

    for (const controller of controllers) {
        controller.onChange(cb);
    }
}

// Lista global de callbacks de um determinado controlador
var __globalListOfCallbacksController = {};

/**
 * Adiciona múltiplos eventos para um controllador global
 * 
 * @param {any} globalController Controlador global
 * @param {callbackUpdateFrame} cb Função de atualização
 */
export function onGlobalControllerChange(globalController, cb) {
    let callbacksController = __globalListOfCallbacksController[globalController.property];

    // Cria lista de callbacks caso não exista
    if (!callbacksController) {
        __globalListOfCallbacksController[globalController.property] = [];
        callbacksController = __globalListOfCallbacksController[globalController.property];
    }

    // Adiciona o callback a lista e registra função que atualiza com todos os callback
    callbacksController.push(cb);
    globalController.onChange(() => {
        callbacksController.forEach(_cb => _cb());
    });
}

/**
 * Converte uma posição num plano cartesiano X, Y, para uma posição em px.
 * O ponto 0,0 do resultado tem é representado pelo ponto (-drawWidth/2, drawHeight/2)
 * ou seja o canto superior esquerdo do nosso plano cartesiano.
 * 
 * @param {number} x posição x
 * @param {number} y posição y
 * @param {number} pxWidth Largura em px do container
 * @param {number} pxHeight Altura em px do container
 * @param {number} drawWidth Tamanho da area desenhavel
 * @param {number} drawHeight Tamanho da area desenhavel
 * @returns {ReturnTuple} Tupla (x,y) com as coordenadas em px
 */
export function posToPx(
    x, 
    y, 
    pxWidth, 
    pxHeight, 
    drawWidth = 3,
    drawHeight = 3
){
    const x0 = drawWidth / 2;
    const y0 = drawHeight / 2;

    return [
        ((x + x0) / drawWidth) * pxWidth,
        (1 - ((y + y0) / drawHeight)) * pxHeight
    ];
};

/**
 * Converte um tamanho do plano cartesiano para px.
 * 
 * @param {number} width Largura no plano
 * @param {number} height Altura no plano
 * @param {number} pxWidth Largura em px do container
 * @param {number} pxHeight Altura em px do container
 * @param {number} drawWidth Largura da area desenhavel
 * @param {number} drawHeight Altura da area desenhavel
 * @returns {ReturnTuple} Tupla(x,y) com o tamanho em px desejado
 */
export function sizeToPx(
    width,
    height,
    pxWidth,
    pxHeight,
    drawWidth = 3,
    drawHeight = 3
) {
    const sizeWidth = (width / drawWidth) * pxWidth;
    const sizeHeight = (height / drawHeight) * pxHeight;

    return [
        sizeWidth,
        sizeHeight
    ];
};