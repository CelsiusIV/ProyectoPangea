#!/bin/sh
set -e

if [ "$1" = 'php-fpm' ] || [ "$1" = 'php' ] || [ "$1" = 'artisan' ]; then
	php -r "file_exists('.env') || copy('.env.example', '.env');"
	composer install --prefer-dist --no-progress --no-interaction
    php artisan migrate --no-interaction
fi

exec docker-php-entrypoint "$@"