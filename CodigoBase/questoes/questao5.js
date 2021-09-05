import * as Three from '../../resources/threejs/build/three.module.js';
import { GUI } from '../../resources/threejs/examples/jsm/libs/dat.gui.module.js';
import { Questao, SubQuestao } from './questaoClass.js';
import { onFolderChanges, rotate } from '../utils/index.js';
import { generateTriangleMesh, TriangleMeshTypes } from '../utils/triangleMesh.js';
import { questao5FragmentShader, questao5VertexShader } from './questao5Shader.js';

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
 * Constroi a questão 5
 * 
 * @param {GUI} controles 
 * @param {number} width 
 * @param {number} height 
 */
export function criaQuestao5(controles, width, height) {
    const idQuestao = 'questao5';

    const propriedades = {
        malhaSelecionavel: {
            tipo: String(TriangleMeshTypes.RHOMBUS),
            tipoCor: 'Colorido',
            cor: [ 255, 255, 255 ],
            deslocamentoCor: 45,
            distanciaCor: 0.5,
            altura: 1.5,
            largura: 2,
            divisoesAltura: 3,
            divisoesLargura: 4
        }
    };

    const controleq5 = controles.addFolder('q5 - Malha de triângulos + cor');

    const controleq5a = controleq5.addFolder('a - Malha selecionavel cor (use o menu!)');
    controleq5a.add(propriedades.malhaSelecionavel, 'tipo', TiposMalhaTriangulos);
    controleq5a.add(propriedades.malhaSelecionavel, 'tipoCor', ['CorFixa', 'Colorido']);
    controleq5a.addColor(propriedades.malhaSelecionavel, 'cor');
    controleq5a.add(propriedades.malhaSelecionavel, 'deslocamentoCor', 0, 180, 1);
    controleq5a.add(propriedades.malhaSelecionavel, 'distanciaCor', 0, 3, 0.01);
    controleq5a.add(propriedades.malhaSelecionavel, 'altura', 0.1, 3, 0.1);
    controleq5a.add(propriedades.malhaSelecionavel, 'largura', 0.1, 3, 0.1);
    controleq5a.add(propriedades.malhaSelecionavel, 'divisoesAltura', 1, 10, 1);
    controleq5a.add(propriedades.malhaSelecionavel, 'divisoesLargura', 1, 10, 1);

    /**
     * SubQuestão A - Malha triangulos selecionavel com pintura por shader
     */
     const subQuestaoA = new SubQuestao(
        idQuestao, 'a', 'Malha de triângulos selecionavel, com pitura por shader', 
        (scene) => {
            const [vertices, indices] = generateTriangleMesh(
                propriedades.malhaSelecionavel.largura,
                propriedades.malhaSelecionavel.altura,
                propriedades.malhaSelecionavel.divisoesLargura,
                propriedades.malhaSelecionavel.divisoesAltura,
                parseInt(propriedades.malhaSelecionavel.tipo, 10)
            );
    
            const geometry = new Three.BufferGeometry();
            geometry.setAttribute('position', new Three.Float32BufferAttribute(vertices, 3));
            geometry.setIndex(indices);

            const [colorShiftX, colorShiftY] = rotate(1, 0, propriedades.malhaSelecionavel.deslocamentoCor);
            const [fixedColorX, fixedColorY, fixedColorZ] = propriedades.malhaSelecionavel.cor.map(x => x / 255);

            const material = new Three.ShaderMaterial({
                uniforms: {
                    colorType: { 
                        value: propriedades.malhaSelecionavel.tipoCor == 'CorFixa'
                            ? 0
                            : 1
                    },
                    colorDistance: {
                        value: propriedades.malhaSelecionavel.distanciaCor
                    },
                    colorShift: {
                        value: new Three.Vector2(colorShiftX, colorShiftY)
                    },
                    fixedColor: {
                        value: new Three.Vector3(fixedColorX, fixedColorY, fixedColorZ)
                    }
                },
                vertexShader: questao5VertexShader,
                fragmentShader: questao5FragmentShader,
                side: Three.DoubleSide,
                // wireframe: true
            });
            material.needsUpdate = true;
    
            const lines = new Three.Line( geometry, material );
            lines.geometry.attributes.position.needsUpdate = true;
            
            scene.add( lines );
    
            const updateGeometria = () => {
                const [vertices, indices] = generateTriangleMesh(
                    propriedades.malhaSelecionavel.largura,
                    propriedades.malhaSelecionavel.altura,
                    propriedades.malhaSelecionavel.divisoesLargura,
                    propriedades.malhaSelecionavel.divisoesAltura,
                    parseInt(propriedades.malhaSelecionavel.tipo, 10)
                );
    
                geometry.setAttribute('position', new Three.Float32BufferAttribute(vertices, 3));
                geometry.setIndex(indices);

                const [colorShiftX, colorShiftY] = rotate(1, 0, propriedades.malhaSelecionavel.deslocamentoCor);
                const [fixedColorX, fixedColorY, fixedColorZ] = propriedades.malhaSelecionavel.cor.map(x => x / 255);

                material.uniforms.colorType.value = propriedades.malhaSelecionavel.tipoCor == 'CorFixa'
                        ? 0
                        : 1;
                material.uniforms.colorDistance.value = propriedades.malhaSelecionavel.distanciaCor;
                material.uniforms.colorShift.value = new Three.Vector2(colorShiftX, colorShiftY);
                material.uniforms.fixedColor.value = new Three.Vector3(fixedColorX, fixedColorY, fixedColorZ);
            }
    
            onFolderChanges(controleq5a, updateGeometria);
        },
        width, height
    );
    

    /**
     * Constroi a questão com todas suas subquestões
     */
    const questao5 = new Questao(5, 'Malha de triângulos selecionavel com pintura por shader', [
        subQuestaoA
    ]); 

    return questao5;
}