FROM rabbitmq:management
MAINTAINER H2 Platform <platform@hailocab.com>

# Setup RabbitMQ for H2
ADD ./rabbitmq_hailo_magic_exchange-0.3.0-rmq0.0.0.ez /usr/lib/rabbitmq/lib/rabbitmq_server-3.5.4/plugins/rabbitmq_hailo_magic_exchange-0.3.0-rmq0.0.0.ez
RUN chmod 777 /usr/lib/rabbitmq/lib/rabbitmq_server-3.5.4/plugins/rabbitmq_hailo_magic_exchange-0.3.0-rmq0.0.0.ez 
RUN rabbitmq-plugins enable rabbitmq_hailo_magic_exchange

ADD ./load_definitions /etc/rabbitmq/load_definitions.json
RUN chmod 777 /etc/rabbitmq/load_definitions.json
RUN echo "[{rabbit, [{loopback_users, []}]},{rabbitmq_management, [{load_definitions, \"/etc/rabbitmq/load_definitions.json\"}]}]." > /etc/rabbitmq/rabbitmq.config

# Expose ports.
EXPOSE 5672
EXPOSE 15672
