#!/usr/bin/env bash

dir=`dirname "$(realpath $0)"`
name=services-documents-generator
version=0.0.1

docker image build -t ${name}:${version} ${dir}
