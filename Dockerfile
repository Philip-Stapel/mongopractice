FROM node:18

RUN apt-get install libcurl4

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

EXPOSE 6000

CMD ["npm", "start"]