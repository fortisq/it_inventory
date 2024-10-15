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
    npm ci --only=production --verbose
    npm install canvas chartjs-node-canvas readable-stream@3.6.2 --save
}

install_method_2() {
    npm ci --only=production --verbose
    npm install canvas --build-from-source
    npm install chartjs-node-canvas readable-stream@3.6.2
}

install_method_3() {
    npm ci --only=production --verbose
    npm install canvas-prebuilt chartjs-node-canvas readable-stream@3.6.2
}

install_method_4() {
    npm ci --only=production --verbose
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

log "Starting Docker-like build test"

# Create a temporary directory to simulate Docker build context
BUILD_DIR=$(mktemp -d)
log "Created temporary build directory: $BUILD_DIR"

# Copy necessary files to the build directory
cp package.json package-lock.json "$BUILD_DIR/"
cp -r saas-it-inventory "$BUILD_DIR/"

# Change to the build directory
cd "$BUILD_DIR"

log "Installing system dependencies"
sudo apt-get update
sudo apt-get install -y build-essential libcairo2-dev libpango1.0-dev libjpeg-dev libgif-dev librsvg2-dev

log "Node version: $(node -v)"
log "NPM version: $(npm -v)"

log "Contents of package.json:"
cat package.json

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

log "Listing installed packages:"
npm list --depth=0

log "Docker-like build test completed"

# Clean up
cd -
rm -rf "$BUILD_DIR"
log "Removed temporary build directory"
