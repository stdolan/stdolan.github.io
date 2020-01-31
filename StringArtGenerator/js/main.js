'use strict';

// Setup
console.log('Setting up...')
const mainCanvas = document.getElementById('mainCanvas');
// Give up upfront if we're not going to be able to use the canvas.
if (!mainCanvas.getContext) {
    throw new Error('Browser does not support <canvas>!');
}

const ctx = mainCanvas.getContext('2d');

let pins = [];
let areStringsFrozen = false;

window.addEventListener('resize', resizeCanvas);
resizeCanvas();
mainCanvas.addEventListener('click', dropPin);

const generateStringsButton = document.getElementById('generateStringsButton');
generateStringsButton.addEventListener('click', generateStrings);

const clearPinsButton = document.getElementById('clearPinsButton');
clearPinsButton.addEventListener('click', clearPins);

generateStringsButton.disabled = false;
clearPinsButton.disabled = false;
console.log('Setup complete!')


function resizeCanvas() {
    console.log('Resizing canvas...');
    mainCanvas.setAttribute('width', document.body.offsetWidth);
    // Not perfect height sizing but it's okay for now.
    mainCanvas.setAttribute(
        'height',
        window.innerHeight
            -  ($('#header').outerHeight(true) + $('#canvasControls').outerHeight(true)));

    // Pins' display already gets cleared during resize of canvas, but need to clear internal
    // logging of pin locations for string generation.
    clearPins();
    console.log('Canvas resized!');
}


function dropPin(event) {
    if (areStringsFrozen) {
        console.log('Strings frozen, no further pins can be dropped');
        return;
    }

    const x = event.offsetX, y = event.offsetY;
    console.log(`Dropping pin at (${x}, ${y})...`);
    ctx.beginPath();
    ctx.fillStyle = 'purple';
    ctx.arc(x, y, 3, 0, Math.PI * 2);
    ctx.fill();
    pins.push([x, y]);
    console.log('Pin dropped!');
}


function generateStrings(event) {
    if (areStringsFrozen) {
        console.log('Strings already drawn and frozen');
        return;
    }

    console.log('Generating strings...');
    ctx.beginPath();
    ctx.strokeStyle = 'black';
    for (let i = 0; i < pins.length; i++) {
        const startPin = pins[i];
        for (let j = i + 1; j < pins.length; j++) {
            const endPin = pins[j];
            ctx.moveTo(startPin[0], startPin[1]);
            ctx.lineTo(endPin[0], endPin[1]);
        }
    }
    ctx.stroke();
    areStringsFrozen = true;
    console.log('Strings generated!');
}


function clearPins(event) {
    console.log('Clearing pins...')
    ctx.clearRect(0, 0, mainCanvas.width, mainCanvas.height);
    pins = [];
    areStringsFrozen = false;
    console.log('Pins cleared!')
}