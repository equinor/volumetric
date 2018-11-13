#!/usr/bin/env sh

# Wait until the service is ready before continuing.
# This is to ensure that the service is initialized before the API tries to connect.
service_is_ready() {
    NAME=$1
    HOST=$2
    DB_PORT=$3
    # echo "Using service $NAME: $HOST:$PORT"
    i=1
    while ! nc -z $HOST $DB_PORT; do
        sleep 1
        i=$((i+1));
        if [ $i -eq 600 ]; then
            echo "Service $NAME '$HOST:$DB_PORT' not responding. Exiting..."
            exit 1
        fi;
    done
}

first_arg="$1"

# Feature tests are not depended on database service
if [ ! -z $DATABASE_HOST ] && [ ${first_arg} != 'tests' ]; then
    service_is_ready "DATABASE" ${DATABASE_HOST} ${DATABASE_PORT}
fi


if [ ${first_arg} = 'api' ]; then
    flask db upgrade
    if [ "$FLASK_ENV" != 'development' ]; then
        flask import_test
    else
        echo "Running in development mode. Skipping import of test data."
        echo "To import manually, run 'volumetric run api flask db import_test'"
    fi

	flask run
	exit $?
fi

if [ ${first_arg} = 'manage' ]; then
    shift  # shift the input arguments to the left, replacing the first argument with the second etc
    flask "$@"
    exit $?
fi

if [ ${first_arg} = 'tests' ]; then
    export ENVIRONMENT='test'
    behave
    exit $?
fi

exec "$@"