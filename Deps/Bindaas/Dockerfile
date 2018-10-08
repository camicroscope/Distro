FROM ubuntu:16.04
LABEL maintainer="ashish@dbmi.emory.edu"

# Add group Bindaas and user Bindaas
RUN groupadd -g 9999 bindaas && \
    useradd -r -u 9999 -g bindaas bindaas


# Bindaas
RUN mkdir -p /root/bindaas


# build with
#  sudo docker build --rm=true -t="repo/imgname" .

### update
RUN apt-get -q update
RUN apt-get -q -y upgrade
RUN apt-get -q -y dist-upgrade
RUN apt-get install -q -y libcurl3

# Java
RUN mkdir /root/src

WORKDIR /root/src

RUN apt-get install -y openjdk-8-jre

# Add java to path
ENV PATH /root/src/jre1.8.0_171/bin:$PATH


RUN chown -R bindaas:bindaas /root/


ADD https://github.com/sharmalab/bindaas/releases/download/v3.0.2/bindaas-dist-3.0.2.tar.gz /root/bindaas/bindaas.tar.gz
WORKDIR /root/bindaas


RUN tar -xvf bindaas.tar.gz && rm bindaas.tar.gz

RUN chown -R bindaas:bindaas /root/bindaas

USER bindaas

COPY bindaas.config.json /root/bindaas/bin/

EXPOSE 9099
EXPOSE 8080
WORKDIR /root/bindaas/bin

COPY /run.sh /root/bindaas/bin/run.sh


CMD ["sh", "run.sh"]
