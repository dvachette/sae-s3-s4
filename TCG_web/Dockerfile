FROM node:20-alpine AS build

WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

FROM httpd:2.4-alpine

COPY apache.conf /usr/local/apache2/conf/httpd.conf
COPY --from=build /app/dist/ /var/www/html/

EXPOSE 80