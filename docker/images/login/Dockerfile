FROM hailo/base:latest

ADD private-key /opt/hailo/login-service/private-key
RUN chmod 500 /opt/hailo/login-service/private-key

ADD service /opt/hailo/bin/service
CMD /opt/hailo/bin/service
