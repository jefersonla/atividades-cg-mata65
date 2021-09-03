import * as Three from '../../resources/threejs/build/three.module.js';
import { GUI } from '../../resources/threejs/examples/jsm/libs/dat.gui.module.js';
import { Questao, SubQuestao } from './questaoClass.js';
import { questao1AVertexShader, questao1AFragmentShader, questao1BCFragmentShader, questao1BCVertexShader } from './questao1Shaders.js';
import {generateCircleGeometry} from '../utils/circleGeometry.js';
import {generateGoldenReasonSpiralGeometry} from '../utils/goldenReasonSpiralGeometry.js';
import {generateTwoPointSpiralGeometry} from '../utils/twoPointSpiralGeometry.js';
import { onFolderChanges, onGlobalControllerChange } from '../utils/index.js';

/**
 * Constroi a questão 1 e todas as suas subquestões
 * 
 * @param {GUI} controles 
 * @param {number} width 
 * @param {number} height 
 */
export function criaQuestao1(controles, width, height) {
    const idQuestao = 'questao1';

    const propriedades = {
        steps: 360,
        circunferencia: {
            raioCircunferencia: 1
        },
        espiral1Volta: {
            raioInicio: 0.2,
            nVoltas: 1
        },
        espiralNVoltas: {
            raioInicio: 0.2,
            nVoltas: 3
        }
    };
    
    const controleq1 = controles.addFolder('q1 - Formas Básicas');
    const globalStepsController = controleq1.add(propriedades, 'steps', 3, 36, 1);
    
    const controleq1a = controleq1.addFolder('a - Circunferência');
    controleq1a.add(propriedades.circunferencia, 'raioCircunferencia', 0, 3, 0.1);
    
    const controleq1b = controleq1.addFolder('b - Espiral 1 Volta');
    controleq1b.add(propriedades.espiral1Volta, 'raioInicio', 0.01, 0.40, 0.01)
    controleq1b.add(propriedades.espiral1Volta, 'nVoltas', 1, 4, 1);
    
    const controleq1c = controleq1.addFolder('c - Espiral N Voltas');
    controleq1c.add(propriedades.espiralNVoltas, 'raioInicio', 0.01, 0.5, 0.01)
    controleq1c.add(propriedades.espiralNVoltas, 'nVoltas', 1, 10, 1);

    /**
     * SubQuestão A - Circunferência
     */
    const subQuestaoA = new SubQuestao(idQuestao, 'a', 'Circunferência', (scene) => {
        
        const axis = new Three.AxesHelper();
        scene.add(axis);

        const vertices = generateCircleGeometry(
            propriedades.circunferencia.raioCircunferencia,
            propriedades.steps
        );
        
        const geometry = new Three.BufferGeometry();
        geometry.setAttribute('position', new Three.Float32BufferAttribute(vertices, 3));

        const material = new Three.ShaderMaterial({
            uniforms: {
                radius: { value: propriedades.circunferencia.raioCircunferencia }
            },
            vertexShader: questao1AVertexShader,
            fragmentShader: questao1AFragmentShader
        });
        material.needsUpdate = true

        const line = new Three.Line(geometry, material);
        line.geometry.attributes.position.needsUpdate = true;

        scene.add(line);

        const updateGeometria = () => {
            const vertices = generateCircleGeometry(
                propriedades.circunferencia.raioCircunferencia,
                propriedades.steps
            );

            geometry.setAttribute('position', new Three.Float32BufferAttribute(vertices, 3));
            material.uniforms.radius.value = propriedades.circunferencia.raioCircunferencia;
        }

        onFolderChanges(controleq1a, updateGeometria);
        onGlobalControllerChange(globalStepsController, updateGeometria);

        // ! Old Basic method
        // setInterval(() => {
        //     if (detectChanges('q1a', propriedades)) {
        //         const vertices = generateCircleGeometry(
        //             propriedades.circunferencia.raioCircunferencia,
        //             propriedades.steps
        //         );

        //         geometry.setAttribute('position', new Three.Float32BufferAttribute(vertices, 3));
        //         material.uniforms.radius.value = propriedades.circunferencia.raioCircunferencia;
        //     }
        // }, 1000 / 30);

    }, width, height);

    /**
     * SubQuestaõ B - Espiral 1 Volta
     */
    const subQuestaoB = new SubQuestao(idQuestao, 'b', 'Espiral 1 Volta - Razão de Ouro', (scene) => {
        
        const axis = new Three.AxesHelper();
        scene.add(axis);

        const vertices = generateGoldenReasonSpiralGeometry(
            propriedades.espiral1Volta.raioInicio, 
            propriedades.espiral1Volta.nVoltas + 1, 
            4,
            propriedades.steps
        );

        const geometry = new Three.BufferGeometry();
        geometry.setAttribute('position', new Three.Float32BufferAttribute(vertices, 3));

        const material = new Three.ShaderMaterial({
            uniforms: {},
            vertexShader: questao1BCVertexShader,
            fragmentShader: questao1BCFragmentShader
        });
        material.needsUpdate = true

        const line = new Three.Line(geometry, material);
        line.geometry.attributes.position.needsUpdate = true;

        scene.add(line);

        const updateGeometria = () => {
            const vertices = generateGoldenReasonSpiralGeometry(
                propriedades.espiral1Volta.raioInicio, 
                propriedades.espiral1Volta.nVoltas + 1, 
                4,
                propriedades.steps
            );

            geometry.setAttribute('position', new Three.Float32BufferAttribute(vertices, 3));
        }

        onFolderChanges(controleq1b, updateGeometria);
        onGlobalControllerChange(globalStepsController, updateGeometria);

    }, width, height);

    /**
     * Subquestão C - Espiral n-Voltas
     */
    const subQuestaoC = new SubQuestao(idQuestao, 'c', 'Espiral n-Voltas - Espiral de 2 pontos', (scene) => {
        
        const axis = new Three.AxesHelper();
        scene.add(axis);

        const radius = 1;
        const vertices = generateTwoPointSpiralGeometry(
            propriedades.espiralNVoltas.raioInicio,
            propriedades.espiralNVoltas.nVoltas,
            propriedades.steps
        );

        const geometry = new Three.BufferGeometry();
        geometry.setAttribute('position', new Three.Float32BufferAttribute(vertices, 3));

        const material = new Three.ShaderMaterial({
            uniforms: {
                radius: { value: radius }
            },
            vertexShader: questao1BCVertexShader,
            fragmentShader: questao1BCFragmentShader
        });
        material.needsUpdate = true;

        const line = new Three.Line(geometry, material);
        line.geometry.attributes.position.needsUpdate = true;

        scene.add(line);

        const updateGeometria = () => {
            const vertices = generateTwoPointSpiralGeometry(
                propriedades.espiralNVoltas.raioInicio,
                propriedades.espiralNVoltas.nVoltas,
                propriedades.steps
            );

            geometry.setAttribute('position', new Three.Float32BufferAttribute(vertices, 3));
        }

        onFolderChanges(controleq1c, updateGeometria);
        onGlobalControllerChange(globalStepsController, updateGeometria);

    }, width, height);

    /**
     * Constroi a questão com todas suas subquestões
     */
    const questao1 = new Questao(1, 'Construção de formas geométricas simples', [
        subQuestaoA,
        subQuestaoB,
        subQuestaoC
    ]); 

    return questao1;
}