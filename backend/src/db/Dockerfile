FROM postgres:16-alpine

COPY ./init/DDL.sql /docker-entrypoint-initdb.d/01_ddl.sql
COPY ./init/insercion.sql /docker-entrypoint-initdb.d/02_seed.sql