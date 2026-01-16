FROM node:lts-alpine3.23 AS node_upstream

# Base Node image
FROM node_upstream AS node_base

ENV NUXT_TELEMETRY_DISABLED=1
ARG USER_ID=1000
ARG GROUP_ID=1000

RUN npm install -g @angular/cli

RUN mkdir /app; \
    chown ${USER_ID}:${GROUP_ID} /app

WORKDIR /app

# Dev Node image
FROM node_base AS node_dev

USER ${USER_ID}:${GROUP_ID}

CMD [ "npm", "run",  "start", "--", "--host", "0.0.0.0" ]