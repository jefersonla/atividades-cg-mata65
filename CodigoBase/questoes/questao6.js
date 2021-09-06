import * as Three from '../../resources/threejs/build/three.module.js';
import { GUI } from '../../resources/threejs/examples/jsm/libs/dat.gui.module.js';
import { Questao, SubQuestao } from './questaoClass.js';
import { onFolderChanges, posToPx, sizeToPx } from '../utils/index.js';
import { generateRectangle } from '../utils/rectangleGeometry.js';
import { questao6BgFragmentShader, questao6BgVertexShader, questao6FragmentShader, questao6VertexShader } from './questao6Shader.js';
import { generateCircleGeometry } from '../utils/circleGeometry.js';

/**
 * Constroi a questão 6
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

    const tiposCorte = { R: 0, G: 1, B: 2 };
    const nomesTiposCorte = {
        [tiposCorte.R]: 'R',
        [tiposCorte.G]: 'G',
        [tiposCorte.B]: 'B'
    };

    const controleq6 = controles.addFolder('q6 - Cortes no espectro de cores RGB');
    controleq6.add(propriedades, 'corte', tiposCorte);
    controleq6.add(propriedades, 'altura', 0, 255, 1);

    // const textureLoader = new Three.TextureLoader();
    // const testTexture = await textureLoader.loadAsync('../../resources/Images/fruits.jpg');

    /** @type {HTMLCanvasElement} */
    const testCanvas = document.createElement('canvas');
    const ctx = testCanvas.getContext('2d', {alpha: false});
    
    // Configura o canvas
    ctx.canvas.width = width;
    ctx.canvas.height = height;
    ctx.strokeStyle = '#ffffff';
    ctx.fillStyle = '#ffffff';
    ctx.textAlign = 'center';

    // Cria retangulo externo
    const [retX, retY] = posToPx(-1.05, 1.05, width, height);
    const [retW, retH] = sizeToPx(2.10, 2.10, width, height);
    ctx.strokeRect(retX, retY, retW, retH);

    // Cria separadores laterais
    const [sepX0, sepY0] = posToPx(-1.08, 0.99, width, height);
    const [sepW, sepH] = sizeToPx(0.03, 0.01, width, height);

    const [, espacoTotalDivisorias] = sizeToPx(0, 1.97, width, height)
    const numSeparadores = 25;
    const espacoDivisoria = espacoTotalDivisorias / numSeparadores;

    const [legendaValorX] = posToPx(-1.18, 0, width, height);

    // Adiciona os separadores
    for (let i = 0; i <= numSeparadores; i++) {
        // Separador Y
        ctx.fillRect(
            i % 5 == 0 ? sepX0 : sepX0 + (sepW / 4),
            sepY0 + (espacoDivisoria * i),
            i % 5 == 0 ? sepW : sepW / 2,
            sepH
        );

        // Separador X
        ctx.fillRect(
            sepY0 + (espacoDivisoria * i),
            (0.989 * height) - (i % 5 == 0 ? sepX0 : sepX0 - (sepW / 4)),
            sepH,
            i % 5 == 0 ? sepW : sepW / 2,
        );

        if (i % 5 == 0) {
            // Legenda Y
            ctx.font = '10px sans-serif';
            ctx.fillStyle = '#fff';
            ctx.fillText(
                250 - (i * 10), 
                legendaValorX, 
                (sepY0 * 1.05 + (espacoDivisoria * i))
            );
            
            // Legenda X
            ctx.font = '10px sans-serif';
            ctx.fillStyle = '#fff';
            ctx.fillText(
                (i * 10),
                (sepY0 * 1.01 + (espacoDivisoria * i)),
                (1 * height) - legendaValorX, 
            );
        }
    }

    // Adiciona a legenda do corte
    const [ corteTextX, corteTextY ] = posToPx(0, 1.1, width, height);
    const [ corteTextAreaX, corteTextAreaY ] = posToPx(-1.0, 1.08, width, height);
    const [ corteTextAreaW, corteTextAreaH ] = sizeToPx(2, -0.22, width, height);

    // Atualiza a legenda valor do corte
    const atualizaValorCorte = () => {
        // Limpa a região
        ctx.fillStyle = '#000';
        ctx.fillRect(corteTextAreaX, corteTextAreaY, corteTextAreaW, corteTextAreaH);
        
        // Escreve o valor
        ctx.font = '20px sans-serif';
        ctx.fillStyle = '#fff';
        ctx.fillText(
            `${nomesTiposCorte[propriedades.corte]} = ${propriedades.altura}`,
            corteTextX, 
            corteTextY
        );
    };
    atualizaValorCorte();

    // Região e posição do texto
    const [ legendaEixoYX, legendaEixoYY ] = posToPx(-1.35, -0.04, width, height);
    const [ legendaEixoYAreaX, legendaEixoYAreaY ] = posToPx(-1.45, 0.1, width, height);
    const [ legendaEixoYAreaW, legendaEixoYAreaH ] = sizeToPx(0.3, 0.2, width, height);

    const [ legendaEixoXX, legendaEixoXY ] = posToPx(0, -1.35, width, height);
    const [ legendaEixoXAreaX, legendaEixoXAreaY ] = posToPx(-0.16, -1.21, width, height);
    const [ legendaEixoXAreaW, legendaEixoXAreaH ] = sizeToPx(0.3, 0.2, width, height);

    // Atualiza as legendas dos eixos X e Y
    const atualizaLegendaXY = () => {
        // Limpa a região da legenda Y
        ctx.fillStyle = '#000';
        ctx.fillRect(legendaEixoYAreaX, legendaEixoYAreaY, legendaEixoYAreaW, legendaEixoYAreaH);
        
        // Limpa a região da legenda Y
        ctx.font = '20px sans-serif';
        ctx.fillStyle = '#fff';
        ctx.fillText(propriedades.corte == tiposCorte.B ? 'G' : 'B', legendaEixoYX, legendaEixoYY);

        // Limpa a região da legenda X
        ctx.fillStyle = '#000';
        ctx.fillRect(legendaEixoXAreaX, legendaEixoXAreaY, legendaEixoXAreaW, legendaEixoXAreaH);

        // Limpa a região da legenda X
        ctx.font = '20px sans-serif';
        ctx.fillStyle = '#fff';
        ctx.fillText(propriedades.corte == tiposCorte.R ? 'G' : 'R', legendaEixoXX, legendaEixoXY);
    };
    atualizaLegendaXY();

    // Cria a textura a partir do canvas
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
            
            atualizaValorCorte();
            atualizaLegendaXY();

            // Marca o refresh da atualização da textura
            bgTexture.needsUpdate = true;
        };

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