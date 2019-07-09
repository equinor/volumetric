#!/bin/bash
set -e

psql -v ON_ERROR_STOP=1 --dbname "$POSTGRES_DB" --username "$POSTGRES_USER" <<-EOSQL
    CREATE USER viewer;
    ALTER ROLE viewer WITH PASSWORD 'jkgf72ld0';
    GRANT USAGE ON SCHEMA public to viewer;
    GRANT SELECT ON ALL TABLES IN SCHEMA public TO viewer;
    GRANT SELECT  ON ALL SEQUENCES IN SCHEMA public TO viewer;
    GRANT CONNECT ON DATABASE "$POSTGRES_DB" to viewer;

    ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT SELECT ON TABLES TO viewer;
    ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON TABLES TO viewer;
EOSQL