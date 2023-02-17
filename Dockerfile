FROM node:18.14.0-alpine

WORKDIR /app

COPY package*.json ./

RUN npm ci

RUN rm package-lock.json package.json

COPY src src

EXPOSE 6000

CMD ["node", "src/app.js"]