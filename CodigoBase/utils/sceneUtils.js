import * as Three from '../../resources/threejs/build/three.module.js';

/**
 * Tupla para o retorno da cena, renderer e camera utilizada
 * @typedef {[ Three.Scene, Three.WebGLRenderer, Three.OrthographicCamera ]} SceneRenderCameraTuple
 */

/**
 * Adiciona a camera padrão a cena.
 * 
 * @param {Three.Scene} scene Cena a qual será adicionada a camera
 * @returns {Three.OrthographicCamera} Retorna a camera adiciona a cena
 */
 export function addDefaultCamera(scene) {
    const camera = new Three.OrthographicCamera(-1.0, 1.0, 1.0, -1.0, -1.0, 1.0);
    scene.add(camera);

    return camera;
}

/**
 * 
 * @param {number} renderWidth Largura do renderer
 * @param {number} renderHeight Altura do renderer
 * @param {Three.Color} backgroundColor Cor de fundo
 * @returns {SceneRenderCameraTuple} Retorna a cena o render e 
 * a camera em uma n-upla
 */
export function generateThreeJsRenderSceneCamera(
    renderWidth,
    renderHeight,
    backgroundColor = new Three.Color(0.0, 0.0, 0.0),
) {
    // Cria renderizador - Quem vai gerar as rasterizações da cena
    const renderer = new Three.WebGLRenderer();

    // Seta a cor de fundo do renderer
    renderer.setClearColor(backgroundColor);

    // Escolhe a dimensão do render
    renderer.setSize(renderWidth, renderHeight);

    // Cria cena - Espaço para colocar elementos 
    const scene = new Three.Scene();

    // Adiciona a camera default
    const camera = addDefaultCamera(scene);

    return [
        scene,
        renderer,
        camera
    ];
}
