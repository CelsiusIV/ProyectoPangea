FROM php:8.2-fpm
RUN docker-php-ext-install pdo pdo_mysql
COPY . /var/www
WORKDIR /var/www
RUN chown -R www-data:www-data /var/www

CMD ["php-fpm"]