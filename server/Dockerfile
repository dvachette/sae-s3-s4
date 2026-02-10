FROM node:20-alpine

WORKDIR /app

COPY package*.json ./

RUN npm install
COPY . .

VOLUME [ "/app" ]

EXPOSE 3000

CMD [ "node", "index.js" ]

