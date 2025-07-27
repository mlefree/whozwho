FROM node:22
USER root
EXPOSE 3000-4000

RUN apt-get update
RUN apt-get install -y git
RUN apt-get install -y vim
RUN apt-get install -y curl

WORKDIR /usr/whozwho-client
COPY ./whozwho-client/dist /usr/whozwho-client/dist

WORKDIR /usr/whozwho-client/dist
RUN npm i

WORKDIR /usr/app
COPY ./whozwho/package*.json ./
COPY ./whozwho/dist ./app
RUN npm i --omit=dev

CMD ["npm","run","start-in-docker"]
