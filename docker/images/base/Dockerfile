FROM ubuntu:latest
MAINTAINER Hailo Labs <platform@hailocab.com>

ENV H2_CONFIG_SERVICE_ADDR http://config:8097
ENV BOXEN_RABBITMQ_URL amqp://guest:guest@rabbitmq:5672
ENV H2_CASSA_DEFAULT_ADDR=cassandra:9160

RUN mkdir -p /etc/h2o && echo "local" > /etc/h2o/azname && chmod +r /etc/h2o/azname
RUN mkdir -p /opt/hailo/bin && mkdir -p /opt/hailo/login-service

ADD public-key /opt/hailo/login-service/public-key
RUN chmod 500 /opt/hailo/login-service/public-key

CMD /opt/hailo/bin/service
