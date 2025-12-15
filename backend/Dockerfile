FROM php:8.2-fpm
COPY --from=mlocati/php-extension-installer /usr/bin/install-php-extensions /usr/local/bin/
RUN docker-php-ext-install pdo pdo_mysql
COPY . /var/www
WORKDIR /var/www
RUN chown -R www-data:www-data /var/www
ENV COMPOSER_ALLOW_SUPERUSER=1

RUN install-php-extensions xdebug @composer

CMD ["php-fpm"]