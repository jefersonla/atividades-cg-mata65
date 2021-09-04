import * as Three from '../../resources/threejs/build/three.module.js';
import { GUI } from '../../resources/threejs/examples/jsm/libs/dat.gui.module.js';
import { Questao, SubQuestao } from './questaoClass.js';
import { onFolderChanges, onGlobalControllerChange } from '../utils/index.js';
import { generateCircleGeometry } from '../utils/circleGeometry.js';
import { questao3CFragmentShader, questao3CVertexShader, questao3FragmentShader, questao3VertexShader } from './questao3Shader.js';

/**
 * Constroi a questão 3
 * 
 * @param {GUI} controles 
 * @param {number} width 
 * @param {number} height 
 */
export function criaQuestao3(controles, width, height) {
    const idQuestao = 'questao3';

    const propriedades = {
        circunferencia: {
            raioLinhas: 1,
            raioMesh: 1,
            raioShaderCombinado: 1
        },
        steps: 72
    };

    const controleq3 = controles.addFolder('q3 - Mesh Circunferência');
    const globalStepsController = controleq3.add(propriedades, 'steps', 3, 72, 1);

    const controleq3a = controleq3.addFolder('a - Linhas Circunferência'); 
    controleq3a.add(propriedades.circunferencia, 'raioLinhas', 0.1, 3, 0.1);

    const controleq3b = controleq3.addFolder('b - Mesh Circunferência'); 
    controleq3b.add(propriedades.circunferencia, 'raioMesh', 0.1, 3, 0.1);

    const controleq3c = controleq3.addFolder('c - Shader Combinado'); 
    controleq3c.add(propriedades.circunferencia, 'raioShaderCombinado', 0.1, 3, 0.1);
    
    /**
     * SubQuestão A - Linhas Circunferência
     */
    const subQuestaoA = new SubQuestao(idQuestao, 'a', 'Linhas Circunferência', (scene) => {

        const vertices = generateCircleGeometry(
            propriedades.circunferencia.raioLinhas,
            propriedades.steps,
            true
        );

        const geometry = new Three.BufferGeometry();
        geometry.setAttribute('position', new Three.Float32BufferAttribute(vertices, 3));

        const material = new Three.ShaderMaterial({
            uniforms: {
                radius: { value: propriedades.circunferencia.raioLinhas }
            },
            vertexShader: questao3VertexShader,
            fragmentShader: questao3FragmentShader,
            side: Three.DoubleSide
        });
        material.needsUpdate = true;

        const lines = new Three.Line( geometry, material );
        lines.geometry.attributes.position.needsUpdate = true;
        
        scene.add( lines );

        const updateGeometria = () => {
            const vertices = generateCircleGeometry(
                propriedades.circunferencia.raioLinhas,
                propriedades.steps,
                true
            );

            geometry.setAttribute('position', new Three.Float32BufferAttribute(vertices, 3));
            lines.material.uniforms.radius.value = propriedades.circunferencia.raioLinhas;
        }

        onFolderChanges(controleq3a, updateGeometria);
        onGlobalControllerChange(globalStepsController, updateGeometria);

    }, width, height);

    /**
     * SubQuestão B - Mesh Circunferência
     */
    const subQuestaoB = new SubQuestao(idQuestao, 'b', 'Mesh Circunferência', (scene) => {

        const vertices = generateCircleGeometry(
            propriedades.circunferencia.raioMesh,
            propriedades.steps,
            true
        );

        const geometry = new Three.BufferGeometry();
        geometry.setAttribute('position', new Three.Float32BufferAttribute(vertices, 3));

        const material = new Three.ShaderMaterial({
            uniforms: {
                radius: { value: propriedades.circunferencia.raioMesh }
            },
            vertexShader: questao3VertexShader,
            fragmentShader: questao3FragmentShader,
            side: Three.DoubleSide
        });
        material.needsUpdate = true;

        const mesh = new Three.Mesh( geometry, material );
        mesh.geometry.attributes.position.needsUpdate = true;
        
        scene.add( mesh );

        const updateGeometria = () => {
            const vertices = generateCircleGeometry(
                propriedades.circunferencia.raioMesh,
                propriedades.steps,
                true
            );

            geometry.setAttribute('position', new Three.Float32BufferAttribute(vertices, 3));
            mesh.material.uniforms.radius.value = propriedades.circunferencia.raioMesh;
        }

        onFolderChanges(controleq3b, updateGeometria);
        onGlobalControllerChange(globalStepsController, updateGeometria);

    }, width, height);

    /**
     * SubQuestão C - Mesh Circunferência - Shader Combinado
     */
     const subQuestaoC = new SubQuestao(idQuestao, 'c', 'Mesh Circunferência - Shader Combinado', (scene) => {

        const vertices = generateCircleGeometry(
            propriedades.circunferencia.raioShaderCombinado,
            propriedades.steps,
            true
        );

        const geometry = new Three.BufferGeometry();
        geometry.setAttribute('position', new Three.Float32BufferAttribute(vertices, 3));

        const material1 = new Three.ShaderMaterial({
            uniforms: {
                radius: { value: propriedades.circunferencia.raioShaderCombinado },
                steps: { value: propriedades.steps }
            },
            vertexShader: questao3VertexShader,
            fragmentShader: questao3FragmentShader,
            side: Three.DoubleSide
        });
        material1.needsUpdate = true;

        const material2 = new Three.ShaderMaterial({
            uniforms: {
                radius: { value: propriedades.circunferencia.raioShaderCombinado },
                steps: { value: propriedades.steps / 2 }
            },
            vertexShader: questao3CVertexShader,
            fragmentShader: questao3CFragmentShader,
            side: Three.DoubleSide
        });
        material2.needsUpdate = true;
        material2.transparent = true;

        const mesh1 = new Three.Mesh( geometry, material1 );
        mesh1.geometry.attributes.position.needsUpdate = true;
        
        const mesh2 = new Three.Mesh( geometry, material2 );
        mesh2.geometry.attributes.position.needsUpdate = true;

        scene.add(mesh1);
        scene.add(mesh2);

        const updateGeometria = () => {
            const vertices = generateCircleGeometry(
                propriedades.circunferencia.raioShaderCombinado,
                propriedades.steps,
                true
            );

            geometry.setAttribute('position', new Three.Float32BufferAttribute(vertices, 3));
            
            mesh1.material.uniforms.radius.value = propriedades.circunferencia.raioShaderCombinado;
            mesh1.material.uniforms.steps.value = propriedades.steps;

            mesh2.material.uniforms.radius.value = propriedades.circunferencia.raioShaderCombinado;
            mesh2.material.uniforms.steps.value = propriedades.steps / 2;
        }

        onFolderChanges(controleq3c, updateGeometria);
        onGlobalControllerChange(globalStepsController, updateGeometria);

    }, width, height);

    /**
     * Constroi a questão com todas suas subquestões
     */
    const questao3 = new Questao(3, 'Mesh Circunferência', [
        subQuestaoA,
        subQuestaoB,
        subQuestaoC
    ]); 

    return questao3;
}