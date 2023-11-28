#!/bin/bash

#pem_key_path="/c/Users/SSAFY/Desktop/I9B204T.pem"
#
## 접속할 EC2 인스턴스의 주소
#ec2_instance_address="i9b204.p.ssafy.io"

openvidu start

docker-compose -f docker-compose-prod.yml pull

COMPOSE_DOCKER_CLI_BUILD=1 DOCKER_BUILDKIT=1 docker-compose -f docker-compose-prod.yml up --build -d

docker rmi -f $(docker images -f "dangling=true" -q) || true