import * as Three from '../../resources/threejs/build/three.module.js';
import { GUI } from '../../resources/threejs/examples/jsm/libs/dat.gui.module.js';
import { Questao, SubQuestao } from './questaoClass.js';
import { onFolderChanges, posToPx, sizeToPx } from '../utils/index.js';
import { generateCircleGeometry } from '../utils/circleGeometry.js';
import { questao7BgFragmentShader, questao7BgVertexShader, questao7FragmentShader, questao7VertexShader } from './questao7Shader.js';

/**
 * Constroi a questão 7
 * 
 * @param {GUI} controles 
 * @param {number} width 
 * @param {number} height 
 */
export async function criaQuestao7(controles, width, height) {
    const idQuestao = 'questao7';

    const propriedades = {
        altura: 128
    };

    const controleq6 = controles.addFolder('q7 - Cortes no cone duplo HSL');
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

    // Cria Circulo externo
    const [arcX, arcY] = posToPx(0, 0, width, height);
    const [arcW] = sizeToPx(1.04, 1.05, width, height);
    ctx.beginPath();
    ctx.arc(arcX, arcY, arcW, 0, 2 * Math.PI);
    ctx.stroke();
    ctx.closePath();

    // Cria marcação do Hue
    const [arcExtW] = sizeToPx(1.15, 1.05, width, height);
    ctx.beginPath();
    ctx.arc(arcX, arcY, arcExtW, 315 * ((2 * Math.PI) / 360), 45 * ((2 * Math.PI) / 360));
    ctx.stroke();
    ctx.closePath();

    // Escreve o valor
    const [ hueLegendaX, hueLegendaY ] = posToPx(1.35, -0.04, width, height);
    ctx.font = '20px sans-serif';
    ctx.fillStyle = '#fff';
    ctx.fillText(`H`, hueLegendaX, hueLegendaY);

    // Escreve helpers
    // const [ hueLegendaX, hueLegendaY ] = posToPx(1.35, -0.04, width, height);
    ctx.font = '10px sans-serif';
    ctx.fillStyle = '#fff';
    ctx.fillText(`0º`, hueLegendaX * 0.95, hueLegendaY * 0.985);
    ctx.fillText(`45º`, hueLegendaX * 0.85, hueLegendaY * 0.45);
    ctx.fillText(`215º`, hueLegendaX * 0.85, hueLegendaY * 1.53);

    // Cria separadores laterais
    const [sepX0, sepY0] = posToPx(-1.08, 0.99, width, height);
    const [sepW, sepH] = sizeToPx(0.03, 0.01, width, height);

    const [, espacoTotalDivisorias] = sizeToPx(0, 1.97, width, height)
    const numSeparadores = 20;
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
                Math.ceil((Math.abs(100 - (i * 10)) / 100) * 255), 
                legendaValorX, 
                (sepY0 * 1.05 + (espacoDivisoria * i))
            );
            
            // Legenda X
            ctx.font = '10px sans-serif';
            ctx.fillStyle = '#fff';
            ctx.fillText(
                Math.ceil((Math.abs(100 - (i * 10)) / 100) * 255),
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
            `L = ${propriedades.altura}`,
            corteTextX, 
            corteTextY
        );
    };
    atualizaValorCorte();

    // Região e posição do texto
    const [ legendaEixoYX, legendaEixoYY ] = posToPx(-1.35, -0.04, width, height);
    const [ legendaEixoYAreaX, legendaEixoYAreaY ] = posToPx(-1.45, 0.1, width, height);
    const [ legendaEixoYAreaW, legendaEixoYAreaH ] = sizeToPx(0.2, 0.2, width, height);

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
        ctx.fillText('S', legendaEixoYX, legendaEixoYY);

        // Limpa a região da legenda X
        ctx.fillStyle = '#000';
        ctx.fillRect(legendaEixoXAreaX, legendaEixoXAreaY, legendaEixoXAreaW, legendaEixoXAreaH);

        // Limpa a região da legenda X
        ctx.font = '20px sans-serif';
        ctx.fillStyle = '#fff';
        ctx.fillText('S', legendaEixoXX, legendaEixoXY);
    };
    atualizaLegendaXY();

    // Cria a textura a partir do canvas
    const bgTexture = new Three.CanvasTexture(ctx.canvas);

    /**
     * SubQuestão A - Triângulo
     */
    const subQuestaoA = new SubQuestao(idQuestao, 'a', 'Cortes no espectro de cores RGB', (scene) => {
        const raio = 1.0;
        const vertices = generateCircleGeometry(raio, 360, true);

        const geometry = new Three.BufferGeometry();
        geometry.setAttribute('position', new Three.Float32BufferAttribute(vertices, 3));

        const material = new Three.ShaderMaterial({
            uniforms: {
                lightnessHeight: { value: propriedades.altura / 255 },
                radius: { value: raio }
            },
            vertexShader: questao7VertexShader,
            fragmentShader: questao7FragmentShader,
            side: Three.DoubleSide
        });
        material.needsUpdate = true;

        const mesh = new Three.Mesh( geometry, material );
        mesh.geometry.attributes.position.needsUpdate = true;
  
        const geometryBg = new Three.PlaneGeometry(3, 3);

        const materialBg = new Three.ShaderMaterial({
            uniforms: {
                radius: { value: raio },
                textureBg: {
                    type: "t", value: bgTexture 
                }
            },
            vertexShader: questao7BgVertexShader,
            fragmentShader: questao7BgFragmentShader,
            side: Three.DoubleSide,
        });
        materialBg.needsUpdate = true;
        materialBg.transparent = true;

        const meshBg = new Three.Mesh( geometryBg, materialBg );
        meshBg.geometry.attributes.position.needsUpdate = true;
        
        scene.add( meshBg );
        scene.add( mesh );

        const updateGeometria = () => {
            material.uniforms.lightnessHeight.value = propriedades.altura / 255;
            
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
    const questao7 = new Questao(7, 'Cortes no cone invertido de cores HSL', [
        subQuestaoA
    ]);

    return questao7;
}