import * as Three from '../../resources/threejs/build/three.module.js';
import { GUI } from '../../resources/threejs/examples/jsm/libs/dat.gui.module.js';
import { Questao, SubQuestao } from './questaoClass.js';
import { generateTriangleRectangle } from '../utils/triangleGeometry.js';
import { onFolderChanges } from '../utils/index.js';
import { questao2FragmentShader, questao2VertexShader } from './questao2Shader.js';

/**
 * Constroi a questão 2
 * 
 * @param {GUI} controles 
 * @param {number} width 
 * @param {number} height 
 */
export function criaQuestao2(controles, width, height) {
    const idQuestao = 'questao2';

    const propriedades = {
        triangulo: {
            largura: 1.5,
            altura: 1
        }
    };

    const controleq2 = controles.addFolder('q2 - Triângulo Colorido');
    controleq2.add(propriedades.triangulo, 'largura', 0.1, 3, 0.1);
    controleq2.add(propriedades.triangulo, 'altura', 0.1, 3, 0.1);

    /**
     * SubQuestão A - Triângulo
     */
    const subQuestaoA = new SubQuestao(idQuestao, 'a', 'Triângulo', (scene) => {

        const vertices = generateTriangleRectangle(
            propriedades.triangulo.largura,
            propriedades.triangulo.altura
        );
        
        const geometry = new Three.BufferGeometry();
        geometry.setAttribute('position', new Three.Float32BufferAttribute(vertices, 3));

        const material = new Three.ShaderMaterial({
            uniforms: {
                pointR: { value: new Three.Vector3(vertices[0], vertices[1], vertices[2]) },
                pointG: { value: new Three.Vector3(vertices[3], vertices[4], vertices[5]) },
                pointB: { value: new Three.Vector3(vertices[6], vertices[7], vertices[8]) }
            },
            vertexShader: questao2VertexShader,
            fragmentShader: questao2FragmentShader,
            side: Three.DoubleSide
        });
        material.needsUpdate = true;

        const mesh = new Three.Mesh( geometry, material );
        mesh.geometry.attributes.position.needsUpdate = true;
        
        scene.add( mesh );

        const updateGeometria = () => {
            const vertices = generateTriangleRectangle(
                propriedades.triangulo.largura,
                propriedades.triangulo.altura
            );    

            geometry.setAttribute('position', new Three.Float32BufferAttribute(vertices, 3));
        }

        onFolderChanges(controleq2, updateGeometria);

    }, width, height);

    /**
     * Constroi a questão com todas suas subquestões
     */
    const questao2 = new Questao(2, 'Triângulo Colorido', [
        subQuestaoA
    ]); 

    return questao2;
}