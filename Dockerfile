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


FROM node:18

WORKDIR /app

COPY package*.json ./

RUN npm ci

COPY . .

RUN npm run build

EXPOSE 3000

CMD ["node", "dist/index.js"]