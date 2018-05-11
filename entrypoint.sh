#!/usr/bin/env sh

# Wait until the service is ready before continuing.
# This is to ensure that the service is initialized before the API tries to connect.
service_is_ready() {
    NAME=$1
    HOST=$2
    PORT=$3
    # echo "Using service $NAME: $HOST:$PORT"
    i=1
    while ! nc -z $HOST $PORT; do
        sleep 1
        i=$((i+1));
        if [ $i -eq 600 ]; then
            echo "Service $NAME '$HOST:$PORT' not responding. Exiting..."
            exit 1
        fi;
    done
}

if [ ! -z $DATABASE_HOST ]; then
    service_is_ready "DATABASE" ${DATABASE_HOST} ${DATABASE_PORT}
fi

first_arg="$1"

if [ ${first_arg} = 'api' ]; then
    flask db upgrade
	flask run
	exit $?
fi

if [ ${first_arg} = 'manage' ]; then
    shift  # shift the input arguments to the left, replacing the first argument with the second etc
    flask "$@"
    exit $?
fi

exec "$@"