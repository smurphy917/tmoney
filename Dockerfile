FROM debian:jessie

MAINTAINER Samuel Murphy <sam@samueljmurphy.com>

#box setup
RUN apt-get update \
    && DEBIAN_FRONTEND=noninteractive apt-get install -y --no-install-recommends \
        apt-utils \
        curl \
        sudo \
        apt-transport-https \
        supervisor \
        bzip2 \
    && rm -rf /var/lib/apt/lists/*
#RUN echo "ALL            ALL = (ALL) NOPASSWD: ALL" >> /etc/sudoers

#install nginx
RUN apt-key adv --keyserver hkp://pgp.mit.edu:80 --recv-keys 573BFD6B3D8FBC641079A6ABABF5BD827BD9BF62 \
    && echo "deb http://nginx.org/packages/mainline/debian/ jessie nginx" >> /etc/apt/sources.list \
	&& apt-get update \
	&& DEBIAN_FRONTEND=noninteractive apt-get install --no-install-recommends --no-install-suggests -y \
        ca-certificates \
        nginx=1.11.5-1~jessie \
        nginx-module-xslt \
        nginx-module-geoip \
        nginx-module-image-filter \
        nginx-module-perl \
        nginx-module-njs \
        gettext-base \
	&& rm -rf /var/lib/apt/lists/*

#install nodejs
RUN curl --silent https://deb.nodesource.com/gpgkey/nodesource.gpg.key | apt-key add - \
    && echo "deb https://deb.nodesource.com/node_4.x jessie main" | tee /etc/apt/sources.list.d/nodesource.list \
    && apt-get update \
    && DEBIAN_FRONTEND=noninteractive apt-get install -y nodejs
RUN npm install --global npm@3.10.8
RUN npm install phantomjs-prebuilt -g

#install PhantomJS
#RUN mkdir /etc/PhantomJS
#RUN curl -L https://bitbucket.org/ariya/phantomjs/downloads/phantomjs-2.1.1-linux-x86_64.tar.bz2 -o /etc/PhantomJS/phantomjs-2.1.1-linux-x86_64.tar.bz2
#RUN tar jxf /etc/PhantomJS/phantomjs-2.1.1-linux-x86_64.tar.bz2

#setup server
RUN useradd --user-group --create-home --shell /bin/false app
RUN groupadd supervisor
RUN usermod -a -G supervisor app
ENV HOME /home/app
RUN mkdir $HOME/.conf
RUN mkdir $HOME/.conf/ssl
COPY ./.config/tmoney.conf $HOME/.conf/
COPY ./.config/ssl/* $HOME/.conf/ssl/
RUN echo "daemon off;" >> /etc/nginx/nginx.conf
RUN rm /etc/nginx/conf.d/default.conf
RUN ln -s /home/app/.conf/tmoney.conf /etc/nginx/conf.d/
EXPOSE 80
EXPOSE 443
#also exposing 8080 for webpack dev server
EXPOSE 8080

#supervisord conf
COPY ./.config/supervisord-tmoney.conf $HOME/.conf/
RUN rm /etc/supervisor/supervisord.conf
RUN ln -s $HOME/.conf/supervisord-tmoney.conf /etc/supervisor/supervisord.conf

#setup app: create web dir and copy install files
RUN mkdir $HOME/web
COPY /web/tsconfig.json \
#        ./web/typings.json \
#        systemjs.config.js \
#        index.html \
        /web/package.json \
        /web/npm-shrinkwrap.json \
    $HOME/web/
RUN chown -R app:app $HOME/*

#TEMPORARY
RUN echo "ALL            ALL = (ALL) NOPASSWD: ALL" >> /etc/sudoers

ENV PATH=$PATH:/etc/

#install from package.json as web user
USER app
WORKDIR $HOME/web/
RUN npm config set registry http://registry.npmjs.org/ && npm install
#RUN npm install
CMD npm start
#CMD supervisord
#CMD supervisord -n -c $HOME/.conf/supervisord-tmoney.conf start tmoney