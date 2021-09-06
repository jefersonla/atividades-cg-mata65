import * as Three from '../../resources/threejs/build/three.module.js';
import { GUI } from '../../resources/threejs/examples/jsm/libs/dat.gui.module.js';
import { Questao, SubQuestao } from './questaoClass.js';
import { onFolderChanges } from '../utils/index.js';
import { questao4FragmentShader, questao4VertexShader } from './questao4Shader.js';
import { generateTriangleMesh, TriangleMeshTypes } from '../utils/triangleMesh.js';

/**
 * Componentes de interface devem continuar em português para facilitar o uso
 */
const TiposMalhaTriangulos = {
    Losango: TriangleMeshTypes.RHOMBUS,
    EsquerdaParaDireita: TriangleMeshTypes.LEFT_TO_RIGHT,
    DireitaParaEsquerda: TriangleMeshTypes.RIGHT_TO_LEFT,
    Cruzado: TriangleMeshTypes.CROSSED
};

/**
 * Constroi a questão 4
 * 
 * @param {GUI} controles 
 * @param {number} width 
 * @param {number} height 
 */
export async function criaQuestao4(controles, width, height) {
    const idQuestao = 'questao4';

    const propriedades = {
        malhaLosango: {
            lado: 2,
            divisoesLado: 2
        },
        malhaEsquerdaDireita: {
            altura: 1.5,
            largura: 2,
            divisoesAltura: 3,
            divisoesLargura: 4
        },
        malhaDireitaEsquerda: {
            altura: 1.5,
            largura: 2,
            divisoesAltura: 3,
            divisoesLargura: 4
        },
        malhaCruzada: {
            altura: 1.5,
            largura: 2,
            divisoesAltura: 3,
            divisoesLargura: 4
        },
        malhaSelecionavel: {
            tipo: String(TriangleMeshTypes.RHOMBUS),
            altura: 1.5,
            largura: 2,
            divisoesAltura: 3,
            divisoesLargura: 4
        }
    };

    const controleq4 = controles.addFolder('q4 - Malha de triângulos');

    const controleq4a = controleq4.addFolder('a - Malha losango'); 
    controleq4a.add(propriedades.malhaLosango, 'lado', 0.1, 3, 0.1);
    controleq4a.add(propriedades.malhaLosango, 'divisoesLado', 1, 10, 1);

    const controleq4b = controleq4.addFolder('b - Malha esquerda direita');
    controleq4b.add(propriedades.malhaEsquerdaDireita, 'altura', 0.1, 3, 0.1);
    controleq4b.add(propriedades.malhaEsquerdaDireita, 'largura', 0.1, 3, 0.1);
    controleq4b.add(propriedades.malhaEsquerdaDireita, 'divisoesAltura', 1, 10, 1);
    controleq4b.add(propriedades.malhaEsquerdaDireita, 'divisoesLargura', 1, 10, 1);

    const controleq4c = controleq4.addFolder('c - Malha direita esquerda');
    controleq4c.add(propriedades.malhaDireitaEsquerda, 'altura', 0.1, 3, 0.1);
    controleq4c.add(propriedades.malhaDireitaEsquerda, 'largura', 0.1, 3, 0.1);
    controleq4c.add(propriedades.malhaDireitaEsquerda, 'divisoesAltura', 1, 10, 1);
    controleq4c.add(propriedades.malhaDireitaEsquerda, 'divisoesLargura', 1, 10, 1);

    const controleq4d = controleq4.addFolder('d - Malha cruzada');
    controleq4d.add(propriedades.malhaCruzada, 'altura', 0.1, 3, 0.1);
    controleq4d.add(propriedades.malhaCruzada, 'largura', 0.1, 3, 0.1);
    controleq4d.add(propriedades.malhaCruzada, 'divisoesAltura', 1, 10, 1);
    controleq4d.add(propriedades.malhaCruzada, 'divisoesLargura', 1, 10, 1);

    const controleq4e = controleq4.addFolder('e - Malha selecionavel (use o menu!)');
    controleq4e.add(propriedades.malhaSelecionavel, 'tipo', TiposMalhaTriangulos);
    controleq4e.add(propriedades.malhaSelecionavel, 'altura', 0.1, 3, 0.1);
    controleq4e.add(propriedades.malhaSelecionavel, 'largura', 0.1, 3, 0.1);
    controleq4e.add(propriedades.malhaSelecionavel, 'divisoesAltura', 1, 10, 1);
    controleq4e.add(propriedades.malhaSelecionavel, 'divisoesLargura', 1, 10, 1);

    /**
     * SubQuestão A - Malha losango quadrada
     */
    const subQuestaoA = new SubQuestao(idQuestao, 'a', 'Malha losango', (scene) => {

        const [vertices, indices] = generateTriangleMesh(
            propriedades.malhaLosango.lado,
            propriedades.malhaLosango.lado,
            propriedades.malhaLosango.divisoesLado * 2,
            propriedades.malhaLosango.divisoesLado * 2,
            TriangleMeshTypes.RHOMBUS
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
                propriedades.malhaLosango.lado,
                propriedades.malhaLosango.lado,
                propriedades.malhaLosango.divisoesLado * 2,
                propriedades.malhaLosango.divisoesLado * 2,
                TriangleMeshTypes.RHOMBUS
            );

            geometry.setAttribute('position', new Three.Float32BufferAttribute(vertices, 3));
            geometry.setIndex(indices);
        }

        onFolderChanges(controleq4a, updateGeometria);

    }, width, height);

    const criaMalhasBasicas = (tipo, configuracao, controleFolder) => {
        return (scene) => {
            const [vertices, indices] = generateTriangleMesh(
                configuracao.largura,
                configuracao.altura,
                configuracao.divisoesLargura,
                configuracao.divisoesAltura,
                tipo !== null
                    ? tipo
                    : parseInt(configuracao.tipo, 10)
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
                    configuracao.largura,
                    configuracao.altura,
                    configuracao.divisoesLargura,
                    configuracao.divisoesAltura,
                    tipo !== null
                        ? tipo
                        : parseInt(configuracao.tipo, 10)
                );
    
                geometry.setAttribute('position', new Three.Float32BufferAttribute(vertices, 3));
                geometry.setIndex(indices);
            }
    
            onFolderChanges(controleFolder, updateGeometria);
        };
    };

    /**
     * SubQuestão B - Malha esquerda para direita
     */
     const subQuestaoB = new SubQuestao(
        idQuestao, 'b', 'Malha esquerda para direita', 
        criaMalhasBasicas(
            TriangleMeshTypes.LEFT_TO_RIGHT,
            propriedades.malhaEsquerdaDireita,
            controleq4b
        ),
        width, height
    );

    /**
     * SubQuestão C - Malha direita para esquerda
     */
        const subQuestaoC = new SubQuestao(
        idQuestao, 'c', 'Malha direita para esquerda', 
        criaMalhasBasicas(
            TriangleMeshTypes.RIGHT_TO_LEFT,
            propriedades.malhaDireitaEsquerda,
            controleq4c
        ),
        width, height
    );

    /**
     * SubQuestão D - Malha cruzada
     */
    const subQuestaoD = new SubQuestao(
        idQuestao, 'd', 'Malha cruzada', 
        criaMalhasBasicas(
            TriangleMeshTypes.CROSSED,
            propriedades.malhaCruzada,
            controleq4d
        ),
        width, height
    );

    /**
     * SubQuestão E - Malha selecionavel
     */
    const subQuestaoE = new SubQuestao(
        idQuestao, 'e', 'Malha selecionavel (use o menu!)', 
        criaMalhasBasicas(
            null,
            propriedades.malhaSelecionavel,
            controleq4e
        ),
        width, height
    );
    

    /**
     * Constroi a questão com todas suas subquestões
     */
    const questao4 = new Questao(4, 'Malha de triângulos', [
        subQuestaoA,
        subQuestaoB,
        subQuestaoC,
        subQuestaoD,
        subQuestaoE
    ]); 

    return questao4;
}