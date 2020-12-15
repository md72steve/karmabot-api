#!/bin/bash
PROJECT=karmabot-api

## A list of target architectures. Allowed values are arm32v7 and amd64
ARCHS='arm32v7'

for ARCH in $ARCHS
do
docker build -f docker/$ARCH.df -t schlupp2002/$ARCH-$PROJECT .      
docker push schlupp2002/$ARCH-$PROJECT:latest
done
