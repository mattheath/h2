#! /bin/bash

H2_DOCKER_DIR=$(dirname "${BASH_SOURCE}")
docker build -t hailo/base "${H2_DOCKER_DIR}/images/base"
