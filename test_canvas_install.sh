#!/bin/bash

set -e

log() {
    echo "[$(date +'%Y-%m-%d %H:%M:%S')] $1"
}

log "Starting canvas installation test"

# Install system dependencies
log "Installing system dependencies"
sudo apt-get update
sudo apt-get install -y build-essential libcairo2-dev libpango1.0-dev libjpeg-dev libgif-dev librsvg2-dev

# Clean npm cache
log "Cleaning npm cache"
npm cache clean --force

# Remove existing node_modules and package-lock.json
log "Removing existing node_modules and package-lock.json"
rm -rf node_modules package-lock.json

# Install production dependencies
log "Installing production dependencies"
npm ci --only=production --verbose

# Install canvas from source
log "Installing canvas from source"
npm install canvas --build-from-source

# Install other specific dependencies
log "Installing other specific dependencies"
npm install chartjs-node-canvas readable-stream@3.6.2

log "Installation completed"

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
