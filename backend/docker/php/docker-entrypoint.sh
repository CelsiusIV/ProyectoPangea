#!/bin/sh
set -e

if [ "$1" = 'php-fpm' ] || [ "$1" = 'php' ] || [ "$1" = 'artisan' ]; then
	php -r "file_exists('.env') || copy('.env.example', '.env');"
	composer install --prefer-dist --no-progress --no-interaction
	until php -r "
		try {
	    	new PDO('mysql:host=db;port=3306', 'pangea', 'pangea');
	    	echo 'OK';
		} catch (Exception \$e) {
    		exit(1);
		}
	"; do
  sleep 2
done

echo "MySQL listo ✔"
    php artisan migrate --no-interaction
fi

exec docker-php-entrypoint "$@"