import * as THREE 	from '../resources/threejs/build/three.module.js';
import { GUI } 		from '../resources/threejs/examples/jsm/libs/dat.gui.module.js'

const glsl = (strings) => strings.join();

const vertexShader = glsl`
    uniform float radius;

    varying vec3 rgbColor;

    void main() {
        rgbColor = vec3(0,0,0);

        if (position.x >= 0.0 && position.y >= 0.0) {
            if (position.y <= 0.7) {
                rgbColor = vec3(
                    (position.y / 0.7),
                    0.0,
                    0.0
                );
            } else {
                rgbColor = vec3(
                    1.0,
                    (position.y - 0.7) / 0.3,
                    0.0
                );
            }
        } else if (position.x < 0.0 && position.y >= 0.0) {
            if (position.y >= 0.7) {
                rgbColor = vec3(
                    ((position.y - 0.7) / 0.3),
                    1.0,
                    0.0
                );
            } else {
                rgbColor = vec3(
                    0.0,
                    1.0,
                    1.0 - (position.y / 0.7)
                );
            }
        } 
        else if (position.x < 0.0 && position.y < 0.0) {
            if (position.y >= -0.7) {
                rgbColor = vec3(
                    0.0,
                    1.0 - ((position.y * - 1.0) / 0.7),
                    1.0
                );
            } else {
                rgbColor = vec3(
                    (((position.y * - 1.0) - 0.7) / 0.3),
                    0.0,
                    1.0
                );
            }
        } else if (position.x >= 0.0 && position.y < 0.0) {
            if (position.y <= -0.7) {
                rgbColor = vec3(
                    1.0,
                    0.0,
                    (((position.y * - 1.0) - 0.7) / 0.3)
                );
            } else {
                rgbColor = vec3(
                    ((position.y * - 1.0) / 0.7),
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
// * 255, 255, 255

// * 1, 0, 0 -   0,60
// * 1, 1, 0 -  60,120
// * 0, 1, 0 - 120,180
// * 0, 1, 1 - 180,240
// * 0, 0, 1 - 240,300
// * 1, 0, 0 - 300,360

const fragmentShader = glsl`
    uniform float radius;
    
    varying vec3 rgbColor;
     
    void main() {
        gl_FragColor.rgb = rgbColor;
    }
`;

var questoes = {
    questao1: {
        titulo: 'Questao 1'
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
	renderer.setSize(maxWinDim*0.7, maxWinDim*0.7);

    // Inicia controles
	initGUI();

    // Adiciona a camera default
	addDefaultCamera()

    // Adiciona saida
    document.querySelector("#questao1 > .alternativas").appendChild( renderer.domElement );

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

    // const vertices = [
    //     new THREE.Vector3(-1.0, -1.0, 0),
    //     new THREE.Vector3( 1.0, -1.0, 0),
    //     new THREE.Vector3( 1.0,  1.0, 0),

    //     new THREE.Vector3( 1.0,  1.0, 0),
    //     new THREE.Vector3(-1.0,  1.0, 0),
    //     new THREE.Vector3(-1.0, -1.0, 0),
    // ];

    // Cria geometria 
    // const geometry = new THREE.BufferGeometry().setFromPoints(vertices);

    const verticesCircleGeometry = generateCircleGeometry(1, 360);
    // const verticesCircleGeometry = generateRectangle(2, 2);

    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute('position', new THREE.Float32BufferAttribute(verticesCircleGeometry, 3));
    geometry.setAttribute('color', new THREE.Float32BufferAttribute(verticesCircleGeometry, 3));

    const material = new THREE.ShaderMaterial( {
        uniforms: {    
            radius: { value: 0.8 }
        },
        vertexShader: vertexShader,
        fragmentShader: fragmentShader
    } );
    
    const line = new THREE.Line( geometry, material );
    scene.add( line );

	renderer.render(scene, camera);
};

/// ***************************************************************
/// ***                                                          **
/// ***************************************************************

function generateRectangle(width, height, fromCenter = true) {
    return new Float32Array(fromCenter
        ? [
            -width / 2, -height / 2, 0,
            -width / 2,  height / 2, 0,
             width / 2,  height / 2, 0,
             width / 2, -height / 2, 0,
            -width / 2, -height / 2, 0,
        ]
        : [
            0,          0, 0,
            0,     height, 0,
            width, height, 0,
            width,      0, 0,
            0,          0, 0
        ]
    );
}

/// ***************************************************************
/// ***                                                          **
/// ***************************************************************

function generateCircleGeometry(
    radius,
    steps = 32,
    innerLines = false
) {
    const vertices = [];
    const stepSize = 360 / steps;

    for(let i = 0; i < steps; i++) {
        const currentAngle = (i * stepSize);
        const nextAngle = ((i * stepSize) + stepSize);

        const p1 = new Float32Array([
            ...rotate(radius, 0, currentAngle),
            0
        ]);
        const p2 = new Float32Array([
            ...rotate(radius, 0, nextAngle),
            0
        ]);
        
        if (innerLines) {
            vertices.push(...[
                0,0,0,
                ...p1,
                ...p2,
                0,0,0
            ]);
        }
        else {
            vertices.push(...[
                ...p1,
                ...p2
            ]);
        }
    }

    return new Float32Array(vertices);
}

/// ***************************************************************
/// ***                                                          **
/// ***************************************************************

// Adaptado a partir de https://stackoverflow.com/questions/17410809/how-to-calculate-rotation-in-2d-in-javascript
function rotate(x, y, angle, cx = 0, cy = 0) {
    var radians = (Math.PI / 180) * angle,
        cos = Math.cos(radians),
        sin = Math.sin(radians),
        nx = (cos * (x - cx)) + (sin * (y - cy)) + cx,
        ny = (cos * (y - cy)) - (sin * (x - cx)) + cy;
    return new Float32Array([nx, ny]);
}

/// ***************************************************************
/// ***                                                          **
/// ***************************************************************

function addDefaultCamera() {
    camera = new THREE.OrthographicCamera( -1.0, 1.0, 1.0, -1.0, -1.0, 1.0 );
	scene.add( camera );
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