FROM node:20-alpine3.18 AS build
RUN npm install -g @angular/cli
WORKDIR /app
COPY package.json .
RUN yarn install
COPY . .
RUN ng build -c production

FROM caddy:2.7.6-alpine
WORKDIR /static
COPY --from=build /app/dist/client/browser/ .
COPY Caddyfile /etc/caddy/Caddyfile