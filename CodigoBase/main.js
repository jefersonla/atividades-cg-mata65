import * as THREE from '../resources/threejs/build/three.module.js';
import { GUI } from '../resources/threejs/examples/jsm/libs/dat.gui.module.js'

import {glsl} from './utils'

const vertexShader = glsl`
    uniform float radius;

    varying vec3 rgbColor;

    void main() {
        rgbColor = vec3(0,0,0);

        if (position.x >= 0.0 && position.y >= 0.0) {
            if (position.y <= (radius / 2.0)) {
                rgbColor = vec3(
                    (position.y / (radius / 2.0)),
                    0.0,
                    0.0
                );
            } else {
                rgbColor = vec3(
                    radius,
                    (position.y - (radius / 2.0)) / (radius / 2.0),
                    0.0
                );
            }
        } else if (position.x < 0.0 && position.y >= 0.0) {
            if (position.y >= (radius / 2.0)) {
                rgbColor = vec3(
                    ((position.y - (radius / 2.0)) / (radius / 2.0)),
                    radius,
                    0.0
                );
            } else {
                rgbColor = vec3(
                    0.0,
                    radius,
                    radius - (position.y / (radius / 2.0))
                );
            }
        } 
        else if (position.x < 0.0 && position.y < 0.0) {
            if (position.y >= -(radius / 2.0)) {
                rgbColor = vec3(
                    0.0,
                    radius - ((position.y * - radius) / (radius / 2.0)),
                    radius
                );
            } else {
                rgbColor = vec3(
                    (((position.y * - radius) - (radius / 2.0)) / (radius / 2.0)),
                    0.0,
                    radius
                );
            }
        } else if (position.x >= 0.0 && position.y < 0.0) {
            if (position.y <= -(radius / 2.0)) {
                rgbColor = vec3(
                    radius,
                    0.0,
                    (((position.y * - radius) - (radius / 2.0)) / (radius / 2.0))
                );
            } else {
                rgbColor = vec3(
                    ((position.y * - radius) / (radius / 2.0)),
                    0.0,
                    0.0
                );
            }
        }

        gl_Position = vec4(position, 1.5 );
    }
`;

// *   0,   0,   0
// * 255,   0,   0
// * 255, 255,   0
// *   0, 255,   0
// *   0, 255, 255
// *   0,   0, 255
// * 255,   0, 255
// * 255,   0,   0

const fragmentShader = glsl`
    uniform float radius;
    
    varying vec3 rgbColor;
     
    void main() {
        // gl_FragColor.rgb = rgbColor;
        gl_FragColor.rgb = vec3(0, 1.0, 1.0);
    }
`;

var questoes = {
    questao1: {
        titulo: 'Questao 1 - ',

    }
};

var scene;
var renderer;
var camera;

var gui = new GUI();

const maxWinDim = Math.min(window.innerWidth, window.innerHeight)

/// ***************************************************************
/// ***                                                          **
/// ***************************************************************

function main() {

    // Cria cena - Espaço para colocar elementos 
    scene = new THREE.Scene();

    // Cria renderizador - Quem vai gerar as rasterizações da cena
    renderer = new THREE.WebGLRenderer();

    // Seta a cor de fundo como preto
    const corPreta = new THREE.Color(0.0, 0.0, 0.0);
    renderer.setClearColor(corPreta);

    // Escolhe a dimensão do render
    renderer.setSize(maxWinDim * 0.7, maxWinDim * 0.7);

    // Inicia controles
    initGUI();

    // Adiciona a camera default
    addDefaultCamera()

    // Adiciona saida
    document.querySelector("#questao1 > .alternativas").appendChild(renderer.domElement);

    // Renderiza a página na velocidade de refresh do browser
    requestAnimationFrame(buildScene);

    console.log("Renderer executado com sucesso! :D");
};

/// ***************************************************************
/// ***                                                          **
/// ***************************************************************

function buildScene() {

    const axis = new THREE.AxesHelper();
    scene.add(axis);

    // Cria geometria 
    // const geometry = new THREE.BufferGeometry().setFromPoints(vertices);

    const circleRadius = 2;
    const vertices = generateTwoPointSpiralGeometry(0.01, 5, 360);
    // const vertices = generateGoldenReasonGeometry(0.0001, 10, circleRadius, 360);
    // const vertices = generateCircleGeometry(circleRadius, 360);
    // const vertices = generateRectangle(2, 2);

    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute('position', new THREE.Float32BufferAttribute(vertices, 3));

    const material = new THREE.ShaderMaterial({
        uniforms: {
            radius: { value: circleRadius }
        },
        vertexShader: vertexShader,
        fragmentShader: fragmentShader
    });

    const line = new THREE.Line(geometry, material);
    scene.add(line);

    renderer.render(scene, camera);
};

/// ***************************************************************
/// ***                                                          **
/// ***************************************************************

function addDefaultCamera() {
    camera = new THREE.OrthographicCamera(-1.0, 1.0, 1.0, -1.0, -1.0, 1.0);
    scene.add(camera);
}

/// ***************************************************************
/// ***                                                          **
/// ***************************************************************

function initGUI() {

    // Iniciar os controles
    gui.open();

};

/// ***************************************************************
/// ***************************************************************
/// ***************************************************************

main();