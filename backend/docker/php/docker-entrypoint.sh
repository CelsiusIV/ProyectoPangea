#!/bin/sh
set -e

# Crear .env si no existe
if [ ! -f .env ]; then
    cp .env.example .env
fi

# Instalar dependencias solo si no existe vendor/
if [ ! -d vendor ]; then
    composer install --prefer-dist --no-progress --no-interaction
fi

if [ "$MIGRATE" = "true" ]; then
    php artisan migrate --force
fi


#if [ "$1" = 'php-fpm' ] || [ "$1" = 'php' ] || [ "$1" = 'artisan' ]; then
	#php -r "file_exists('.env') || copy('.env.example', '.env');"
#	composer install --prefer-dist --no-progress --no-interaction
    #php artisan migrate --no-interaction
#fi

exec docker-php-entrypoint "$@"