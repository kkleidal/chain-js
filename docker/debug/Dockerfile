FROM iojs
# :onbuild
MAINTAINER Ken Leidal <kkleidal@gmail.com>

RUN apt-get update && bash -c "debconf-set-selections <<< 'mysql-server mysql-server/root_password password pass' && debconf-set-selections <<< 'mysql-server mysql-server/root_password_again password pass'" && apt-get install -y mysql-server
RUN mkdir /var/lib/mysql.old && cp -R /var/lib/mysql/* /var/lib/mysql.old
ADD startup /opt/startup
RUN chmod +x /opt/startup
EXPOSE 3000
ENTRYPOINT ["/opt/startup"]
