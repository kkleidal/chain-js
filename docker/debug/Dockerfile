FROM iojs
# :onbuild
MAINTAINER Ken Leidal <kkleidal@gmail.com>

RUN apt-get update && (DEBIAN_FRONTEND=noninteractive apt-get install -y mysql-server)
EXPOSE 3000
ENTRYPOINT ["bash", "-c", "cd /usr/src/app && (npm install; npm start)"]
