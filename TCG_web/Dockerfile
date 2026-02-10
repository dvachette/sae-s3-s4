FROM node:20-alpine AS build

WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

FROM httpd:2.4-alpine

# Frontend build
COPY --from=build /app/dist/ /usr/local/apache2/htdocs/

# Vhost + MPM
COPY apache.conf /usr/local/apache2/conf/extra/frontend.conf

# Inclusion explicite
RUN echo "Include conf/extra/frontend.conf" \
    >> /usr/local/apache2/conf/httpd.conf

EXPOSE 80
