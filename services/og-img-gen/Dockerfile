FROM zenika/alpine-chrome:with-node

USER root
ENV NODE_ENV=production
ENV TINI_SUBREAPER=true
WORKDIR /src

COPY package*.json ./
RUN npm ci

COPY . .
EXPOSE 8080
CMD ["npm" , "start"]