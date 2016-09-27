#!/bin/bash
ENV_FILE=.env-dev
if [ -f $ENV_FILE ]; then
  echo sourcing $ENV_FILE
  source $ENV_FILE;
fi
