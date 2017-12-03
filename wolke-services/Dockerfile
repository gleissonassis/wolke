FROM alpine

RUN apk update && \
    apk add nodejs && \
    apk add nodejs-npm && \
    apk add mongodb && \
    mkdir /app && \
    mkdir /data && \
    mkdir /data/db

WORKDIR /app

VOLUME /data/db

COPY . .

RUN npm i && \
    chmod +x start.sh

EXPOSE 5000

CMD ["/app/start.sh"]
