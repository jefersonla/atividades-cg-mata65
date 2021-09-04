import * as Three from '../../resources/threejs/build/three.module.js';
import { GUI } from '../../resources/threejs/examples/jsm/libs/dat.gui.module.js';
import { Questao, SubQuestao } from './questaoClass.js';
import { onFolderChanges } from '../utils/index.js';
import { generateRectangle } from '../utils/rectangleGeometry.js';
import { questao4FragmentShader, questao4VertexShader } from './questao4Shader.js';
import { generateTriangleMesh } from '../utils/triangleMesh.js';

/**
 * Constroi a questão 4
 * 
 * @param {GUI} controles 
 * @param {number} width 
 * @param {number} height 
 */
export function criaQuestao4(controles, width, height) {
    const idQuestao = 'questao4';

    const propriedades = {
        malhaA: {
            lado: 2,
            divisoesLado: 2
        }
    };

    const controleq4 = controles.addFolder('q4 - Malha de triângulos');

    const controleq4a = controleq4.addFolder('a - Malha básica'); 
    controleq4a.add(propriedades.malhaA, 'lado', 0.1, 3, 0.1);
    controleq4a.add(propriedades.malhaA, 'divisoesLado', 1, 10, 1);

    /**
     * SubQuestão A - Malha básica
     */
    const subQuestaoA = new SubQuestao(idQuestao, 'a', 'Malha básica', (scene) => {

        const [vertices, indices] = generateTriangleMesh(
            propriedades.malhaA.lado,
            propriedades.malhaA.lado,
            propriedades.malhaA.divisoesLado,
            propriedades.malhaA.divisoesLado
        );

        const geometry = new Three.BufferGeometry();
        geometry.setAttribute('position', new Three.Float32BufferAttribute(vertices, 3));
        geometry.setIndex(indices);

        const material = new Three.ShaderMaterial({
            uniforms: {},
            vertexShader: questao4VertexShader,
            fragmentShader: questao4FragmentShader,
            side: Three.DoubleSide,
            // wireframe: true
        });
        material.needsUpdate = true;

        const lines = new Three.Line( geometry, material );
        lines.geometry.attributes.position.needsUpdate = true;
        
        scene.add( lines );

        const updateGeometria = () => {
            const [vertices, indices] = generateTriangleMesh(
                propriedades.malhaA.lado,
                propriedades.malhaA.lado,
                propriedades.malhaA.divisoesLado,
                propriedades.malhaA.divisoesLado
            );

            geometry.setAttribute('position', new Three.Float32BufferAttribute(vertices, 3));
            geometry.setIndex(indices);
        }

        onFolderChanges(controleq4a, updateGeometria);

    }, width, height);

    /**
     * Constroi a questão com todas suas subquestões
     */
    const questao4 = new Questao(4, 'Malha de triângulos', [
        subQuestaoA,
    ]); 

    return questao4;
}