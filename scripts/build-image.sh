#!/bin/sh
# Argument 1: Chain ID - Require env file '.env.[Chain Id]'
CHAIN_ID="${1:-test3}"

SERVICE_NAME=gnoscan-front-${CHAIN_ID}
BUILD_TAG=$(date "+%Y%m%d%H%M%S")

docker build \
    -t "${SERVICE_NAME}:latest" \
    -t "${SERVICE_NAME}:${BUILD_TAG}" \
    --build-arg ENV_PATH=".env.$CHAIN_ID" \
    .
