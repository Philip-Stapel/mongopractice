#FROM node:18.14.0
#
#RUN mkdir /app_dir
#
#WORKDIR /app_dir
#
#COPY . .
#
#RUN npm install ci
#
#EXPOSE 6000
#
#CMD ["node", "./src/app.js"]


FROM node:18.14.0

WORKDIR /app

COPY package*.json ./

RUN npm ci

COPY src src

EXPOSE 6000

CMD ["node", "src/app.js"]