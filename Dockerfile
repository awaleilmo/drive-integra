FROM node:lts-alpine
ENV TZ=UTC \
    PORT=3333 \
    HOST=production \
    LOG_LEVEL=info \
    APP_KEY=y08UTWgXzQldbab3apPZZvngHweodtQp \
    NODE_ENV=development \
    ENCRYPTION_KEY=your-256-bit-secret-key-in-hex-format \
    SESSION_DRIVER=cookie \
    DB_HOST=127.0.0.1 \
    DB_PORT=5432 \
    DB_USER=postgres \
    DB_PASSWORD='' \
    DB_DATABASE='' \
    DRIVE_DISK=fs
WORKDIR /usr/src/app
COPY ["package.json", "package-lock.json*", "npm-shrinkwrap.json*", "./"]
RUN npm install --production --silent && mv node_modules ../
COPY . .
EXPOSE 3000
RUN chown -R node /usr/src/app
USER node
CMD ["npm", "start"]
