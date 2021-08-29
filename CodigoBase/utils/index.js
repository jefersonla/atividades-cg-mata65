/**
 * Tipo tupla para retornos de posições x (0) e y (1)
 * @typedef {[number, number]} ReturnTuple
 */

/**
 * Utilitário para string template formato glsl (vertex and fragment shaders)
 * Para ser utilizado com o complemento 'boyswan.glsl-literal' no Visual Studio Code.
 * 
 * @param {Array<string>} strings Array de strings do template
 * @returns String unida
 */
const glsl = (strings) => strings.join();

/**
 * Rotaciona um ponto a partir da origem (0,0) ou a partir de um centro
 * qualquer recebido por parametro.
 * @see https://stackoverflow.com/questions/17410809/how-to-calculate-rotation-in-2d-in-javascript
 * 
 * @param {number} x Position x
 * @param {number} y Position y
 * @param {number} angle Angle of rotation
 * @param {number} cx Center of rotation x
 * @param {number} cy Center of rotation y
 * @returns {ReturnTuple} Retorna a nova posição dos pontos x, y após a rotação
 */
export function rotate(x, y, angle, cx = 0, cy = 0) {
    const radians = (Math.PI / 180) * angle;
    
    const cos = Math.cos(radians);
    const sin = Math.sin(radians);
    
    const nx = (cos * (x - cx)) + (sin * (y - cy)) + cx;
    const ny = (cos * (y - cy)) - (sin * (x - cx)) + cy;
    
    return new Float32Array([nx, ny]);
}