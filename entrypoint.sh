#!/usr/bin/env sh
first_arg="$1"
if [ ${first_arg} = 'api' ]; then
	python3 app.py
fi
if [ ${first_arg} = 'manage' ]; then
    shift  # shift the input arguments to the left, replacing the first argument with the second etc
    echo "python3 manage.py $@"
    python3 manage.py "$@"
else
    exec "$@"
fi