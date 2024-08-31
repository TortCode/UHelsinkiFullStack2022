FROM node:20 AS build-stage
WORKDIR /usr/src/app

COPY . .
RUN npm ci

ENV REACT_APP_WS_SERVER='ws://localhost:8080/api/'
ENV REACT_APP_HTTP_SERVER='http://localhost:8080/api/'
RUN npm run build

FROM nginx:1.25-alpine
COPY --from=build-stage /usr/src/app/build /usr/share/nginx/html