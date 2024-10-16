#!/bin/sh
# wait-for-it.sh

set -e

host="$1"
shift
cmd="$@"

until nc -z "$host" 27017; do
  >&2 echo "MongoDB is unavailable - sleeping"
  sleep 1
done

>&2 echo "MongoDB is up - executing command"
exec $cmd
