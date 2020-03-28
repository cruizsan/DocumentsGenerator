FROM node:12-alpine
WORKDIR /app

COPY . .
RUN npm install --silent
RUN npm install sqlite3 --save --silent

ENV UNO_URL https://raw.githubusercontent.com/cruizsan/DocumentsGenerator/master/unoconv
RUN apk --no-cache add bash mc \
            curl \
            util-linux \
            libreoffice-common \
            libreoffice-writer \
            ttf-droid-nonlatin \
            ttf-droid \
            ttf-dejavu \
            ttf-freefont \
            ttf-liberation \
        && curl -Ls $UNO_URL -o /usr/local/bin/unoconv \
        && chmod +x /usr/local/bin/unoconv \
        && ln -s /usr/bin/python3 /usr/bin/python \
        && apk del curl \
        && rm -rf /var/cache/apk/*

EXPOSE 8080

CMD [ "npm", "run", "start:prod" ]
