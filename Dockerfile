FROM node:slim

RUN apt-get update
RUN apt-get upgrade -y

RUN apt-get install -y git

WORKDIR /mahjong
COPY . .

#Install npm modules
RUN npm install --only=prod

CMD node server.js

EXPOSE 8080
