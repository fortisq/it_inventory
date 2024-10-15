#!/bin/bash

set -e

log() {
    echo "[$(date +'%Y-%m-%d %H:%M:%S')] $1"
}

attempt_install() {
    local method=$1
    log "Attempting installation: $method"
    if $method; then
        log "Installation successful: $method"
        return 0
    else
        log "Installation failed: $method"
        return 1
    fi
}

install_method_1() {
    npm install canvas chartjs-node-canvas readable-stream@3.6.2 --save
}

install_method_2() {
    npm install canvas --build-from-source
    npm install chartjs-node-canvas readable-stream@3.6.2
}

install_method_3() {
    npm install canvas-prebuilt chartjs-node-canvas readable-stream@3.6.2
}

install_method_4() {
    npm install pango cairo-pdf
    npm install canvas --build-from-source
    npm install chartjs-node-canvas readable-stream@3.6.2
}

test_modules() {
    node -e "
    const { createReadStream } = require('fs');
    const { Readable } = require('stream');
    const canvas = require('canvas');
    const { ChartJSNodeCanvas } = require('chartjs-node-canvas');

    console.log('Modules loaded successfully');

    const readableStream = new Readable();
    readableStream.push('Hello, World!');
    readableStream.push(null);

    readableStream.on('data', (chunk) => {
      console.log('Received chunk:', chunk.toString());
    });

    readableStream.on('end', () => {
      console.log('Stream ended');
    });

    const canvasInstance = canvas.createCanvas(200, 200);
    const ctx = canvasInstance.getContext('2d');
    ctx.font = '30px Arial';
    ctx.fillText('Hello World', 10, 50);

    const chartJSNodeCanvas = new ChartJSNodeCanvas({ width: 400, height: 400 });

    console.log('All modules tested successfully');
    "
}

log "Starting canvas installation test"

# Install system dependencies
log "Installing system dependencies"
sudo apt-get update
sudo apt-get install -y build-essential libcairo2-dev libpango1.0-dev libjpeg-dev libgif-dev librsvg2-dev

# Clean npm cache and remove existing installations
log "Cleaning npm cache and removing existing installations"
npm cache clean --force
rm -rf node_modules package-lock.json

# Attempt different installation methods
if attempt_install install_method_1 || 
   attempt_install install_method_2 || 
   attempt_install install_method_3 || 
   attempt_install install_method_4; then
    log "Installation successful"
    if test_modules; then
        log "All modules loaded and tested successfully"
    else
        log "Module testing failed"
    fi
else
    log "All installation methods failed"
fi

log "Canvas installation test completed"
