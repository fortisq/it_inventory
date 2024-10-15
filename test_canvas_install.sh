#!/bin/bash

set -e

log() {
    echo "[$(date +'%Y-%m-%d %H:%M:%S')] $1"
}

log "Starting canvas installation test"

# Method 1: Standard npm install
log "Trying standard npm install"
npm install canvas chartjs-node-canvas readable-stream@3.6.2 --save || log "Standard npm install failed"

# Method 2: Install with canvas-prebuilt
log "Trying canvas-prebuilt"
npm uninstall canvas chartjs-node-canvas
npm install canvas-prebuilt chartjs-node-canvas readable-stream@3.6.2 --save || log "canvas-prebuilt install failed"

# Method 3: Install with node-pre-gyp
log "Trying node-pre-gyp"
npm uninstall canvas chartjs-node-canvas
npm install canvas --build-from-source
npm install chartjs-node-canvas readable-stream@3.6.2 --save || log "node-pre-gyp install failed"

# Method 4: Install system dependencies and then canvas
log "Trying system dependencies installation"
sudo apt-get update
sudo apt-get install -y build-essential libcairo2-dev libpango1.0-dev libjpeg-dev libgif-dev librsvg2-dev
npm uninstall canvas chartjs-node-canvas
npm install canvas chartjs-node-canvas readable-stream@3.6.2 --save || log "System dependencies + npm install failed"

log "Canvas installation test completed"

# Test if we can require the modules
log "Testing if modules can be required"
node -e "
const { createReadStream } = require('fs');
const { Readable } = require('stream');
const canvas = require('canvas');
const { ChartJSNodeCanvas } = require('chartjs-node-canvas');

// Test readable-stream
const readableStream = new Readable();
readableStream.push('Hello, World!');
readableStream.push(null);

readableStream.on('data', (chunk) => {
  console.log('Received chunk:', chunk.toString());
});

readableStream.on('end', () => {
  console.log('Stream ended');
});

// Test canvas
const canvasInstance = canvas.createCanvas(200, 200);
const ctx = canvasInstance.getContext('2d');
ctx.font = '30px Arial';
ctx.fillText('Hello World', 10, 50);

// Test chartjs-node-canvas
const chartJSNodeCanvas = new ChartJSNodeCanvas({ width: 400, height: 400 });

console.log('All modules loaded and tested successfully');
" || log "Failed to load or test modules"

log "All tests completed"
