import * as Three from '../../resources/threejs/build/three.module.js';
import { GUI } from '../../resources/threejs/examples/jsm/libs/dat.gui.module.js';
import { Questao, SubQuestao } from './questaoClass.js';
import { onFolderChanges } from '../utils/index.js';
import { generateRectangle } from '../utils/rectangleGeometry.js';
import { questao6BgFragmentShader, questao6BgVertexShader, questao6FragmentShader, questao6VertexShader } from './questao6Shader.js';
import { generateCircleGeometry } from '../utils/circleGeometry.js';

/**
 * Constroi a questão 2
 * 
 * @param {GUI} controles 
 * @param {number} width 
 * @param {number} height 
 */
export async function criaQuestao6(controles, width, height) {
    const idQuestao = 'questao6';

    const propriedades = {
        corte: '0',
        altura: 0
    };

    const controleq6 = controles.addFolder('q6 - Cortes no espectro de cores RGB');
    controleq6.add(propriedades, 'corte', { R: 0, G: 1, B: 2 });
    controleq6.add(propriedades, 'altura', 0, 255, 1);

    const textureLoader = new Three.TextureLoader();
    const testTexture = await textureLoader.loadAsync('../../resources/Images/fruits.jpg');

    /** @type {HTMLCanvasElement} */
    const testCanvas = document.createElement('canvas');
    const ctx = testCanvas.getContext('2d');
    
    // Configura o canvas
    ctx.canvas.width = width;
    ctx.canvas.height = height;
    ctx.strokeStyle = '#ffffff';
    ctx.fillStyle = '#ffffff';
    ctx.textAlign = 'center';

    const posToPx = (x, y, width, height) => {
        return [
            x * width,
            y * height
        ];
    };

    const pos1 = posToPx(0.15, 0.15, width, height);
    const pos2 = posToPx(0.70, 0.7, width, height);


    ctx.strokeRect(pos1[0], pos1[1], pos2[0], pos2[1]);

    const pos3 = posToPx(0.14, 0.17, width, height);
    const pos4 = posToPx(0.14, 0.83, width, height);
    const divisionSize = posToPx(0.01, 0.001, width, height);

    ctx.fillRect(pos3[0], pos3[1], divisionSize[0], divisionSize[1]);
    ctx.fillRect(pos4[0], pos4[1], divisionSize[0], divisionSize[1]);

    ctx.fillRect(pos3[1], pos3[0], divisionSize[1], divisionSize[0]);
    ctx.fillRect(pos4[1], pos4[0], divisionSize[1], divisionSize[0]);

    const bgTexture = new Three.CanvasTexture(ctx.canvas);

    /**
     * SubQuestão A - Triângulo
     */
    const subQuestaoA = new SubQuestao(idQuestao, 'a', 'Cortes no espectro de cores RGB', (scene) => {
        const alturaGeometria = 2.0;
        const larguraGeometria = 2.0;
        const vertices = generateRectangle(larguraGeometria, alturaGeometria, true, true);

        const geometry = new Three.BufferGeometry();
        geometry.setAttribute('position', new Three.Float32BufferAttribute(vertices, 3));

        const material = new Three.ShaderMaterial({
            uniforms: {
                cutColor: { value: parseInt(propriedades.corte, 10) },
                cutColorHeight: { value: propriedades.altura / 255 },
                geometryHeight: { value: alturaGeometria },
                geometryWidth: { value: larguraGeometria }
            },
            vertexShader: questao6VertexShader,
            fragmentShader: questao6FragmentShader,
            side: Three.DoubleSide
        });
        material.needsUpdate = true;

        const mesh = new Three.Mesh( geometry, material );
        mesh.geometry.attributes.position.needsUpdate = true;
  
        const geometryBg = new Three.PlaneGeometry(3, 3);

        const materialBg = new Three.ShaderMaterial({
            uniforms: {
                geometryHeight: { value: alturaGeometria },
                geometryWidth: { value: larguraGeometria },
                textureBg: {
                    type: "t", value: bgTexture 
                }
            },
            vertexShader: questao6BgVertexShader,
            fragmentShader: questao6BgFragmentShader,
            side: Three.DoubleSide,
        });
        materialBg.needsUpdate = true;
        materialBg.transparent = true;

        const meshBg = new Three.Mesh( geometryBg, materialBg );
        meshBg.geometry.attributes.position.needsUpdate = true;
        
        scene.add( meshBg );
        scene.add( mesh );

        const updateGeometria = () => {
            material.uniforms.cutColor.value = parseInt(propriedades.corte, 10);
            material.uniforms.cutColorHeight.value = propriedades.altura / 255;
        }

        onFolderChanges(controleq6, updateGeometria);

    }, width, height);

    /**
     * Constroi a questão com todas suas subquestões
     */
    const questao6 = new Questao(6, 'Cortes no espectro de cores RGB', [
        subQuestaoA
    ]); 

    return questao6;
}