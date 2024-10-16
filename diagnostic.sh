#!/bin/bash

echo "System Diagnostics"
echo "=================="

echo -e "\nDisk Space:"
df -h

echo -e "\nMemory Usage:"
free -h

echo -e "\nCPU Information:"
lscpu

echo -e "\nDocker Version:"
docker --version

echo -e "\nDocker Compose Version:"
docker-compose --version

echo -e "\nNode.js Version:"
node --version

echo -e "\nnpm Version:"
npm --version

echo -e "\nMongoDB Version:"
mongod --version

echo -e "\nCurrent User and Groups:"
id

echo -e "\nCurrent Working Directory:"
pwd

echo -e "\nContents of Current Directory:"
ls -la

echo -e "\nDocker Images:"
docker images

echo -e "\nRunning Docker Containers:"
docker ps

echo -e "\nAll Docker Containers:"
docker ps -a

echo -e "\nDocker Networks:"
docker network ls

echo -e "\nDocker Volumes:"
docker volume ls

echo -e "\nContents of .env file:"
cat .env

echo -e "\nContents of docker-compose.yml:"
cat docker-compose.yml
