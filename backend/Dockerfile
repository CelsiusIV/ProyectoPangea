#syntax=docker/dockerfile:1.4
FROM php:8.2-fpm-alpine AS php_upstream
FROM mlocati/php-extension-installer:2 AS php_extension_installer_upstream
FROM composer/composer:2-bin AS composer_upstream
FROM nginxinc/nginx-unprivileged:stable-alpine3.21-perl AS nginx_upstream

FROM php_upstream AS php_base

ARG USER_ID=1000
ARG GROUP_ID=1000

RUN mkdir /usr/share/nginx; \
	chown ${USER_ID}:${GROUP_ID} /usr/share/nginx

WORKDIR /usr/share/nginx

RUN apk add --no-cache \
	acl \
	fcgi \
	file \
	gettext \
	git \
	;

COPY --from=php_extension_installer_upstream --link /usr/bin/install-php-extensions /usr/local/bin/
RUN set -eux; \
	install-php-extensions \
	apcu \
	intl \
	opcache \
	zip \
	pdo_mysql \
	;

CMD ["php-fpm"]

ENV PATH="${PATH}:/root/.composer/vendor/bin"

COPY --from=composer_upstream --link /composer /usr/bin/composer

FROM php_base AS php_dev

ENV APP_ENV=local XDEBUG_MODE=off

COPY --link --chmod=755 docker/php/docker-entrypoint.sh /usr/local/bin/docker-entrypoint
ENTRYPOINT ["docker-entrypoint"]

CMD ["php-fpm"]

RUN set -eux; \
	install-php-extensions xdebug;

USER ${USER_ID}:${GROUP_ID}

# Prod PHP image
FROM php_base AS php_prod

ENV APP_ENV=production

COPY --link --chmod=755 docker/php/docker-entrypoint.sh.prod /usr/local/bin/docker-entrypoint
ENTRYPOINT ["docker-entrypoint"]
CMD ["php-fpm"]

COPY --link --chown=${USER_ID}:${GROUP_ID} composer.* ./
RUN composer install --prefer-dist --no-dev --no-autoloader --no-scripts --no-progress

COPY --link --chown=${USER_ID}:${GROUP_ID} ./ ./

USER ${USER_ID}:${GROUP_ID}

RUN set -eux; \
	php artisan event:cache; \
	php artisan route:cache; \
	php artisan view:cache;
