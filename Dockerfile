FROM ubuntu:latest
LABEL authors="Leonardo"

ENTRYPOINT ["top", "-b"]