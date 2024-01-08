FROM caddy:builder-alpine AS cbuild
RUN xcaddy build \
    --with github.com/caddyserver/transform-encoder

FROM node:20-alpine3.18 AS ngbuild
RUN npm install -g @angular/cli
WORKDIR /app
COPY package.json .
RUN yarn install
COPY . .
RUN ng build -c production

FROM caddy:2.7.6-alpine
WORKDIR /static
COPY --from=cbuild /usr/bin/caddy /usr/bin/caddy
COPY --from=ngbuild /app/dist/client/browser/ .
COPY Caddyfile /etc/caddy/Caddyfile
