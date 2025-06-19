FROM arm64v8/amazonlinux:2023
USER root

RUN yum update
RUN yum install -y nodejs npm

WORKDIR /usr/whozwho-client
COPY ./whozwho-client/dist /usr/whozwho-client/dist

WORKDIR /usr/whozwho-client/dist
RUN npm i

WORKDIR /usr/app
COPY ./whozwho/package*.json ./
COPY ./whozwho/dist ./app
RUN npm i

CMD ["npm","run","start-in-docker"]
