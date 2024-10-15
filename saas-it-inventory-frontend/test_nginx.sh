#!/bin/sh
# Test script to check Nginx status and environment

echo "=== Checking Nginx status ==="
nginx -t

echo "=== Checking running processes ==="
ps aux

echo "=== Checking environment variables ==="
env

echo "=== Checking Nginx error log ==="
cat /var/log/nginx/error.log
