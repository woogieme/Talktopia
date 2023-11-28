FROM nginx:stable-alpine
RUN rm -rf /etc/nginx/conf.d/default.conf

COPY conf.d /etc/nginx/conf.d
COPY cert /cert

EXPOSE 80
EXPOSE 443