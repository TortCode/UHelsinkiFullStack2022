FROM node:20

WORKDIR /usr/src/app

COPY . .

RUN npm install

ENV REACT_APP_WS_SERVER='ws://localhost:8080/api/'
ENV REACT_APP_HTTP_SERVER='http://localhost:8080/api/'

CMD ["npm", "start"]