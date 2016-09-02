#!/bin/bash

npm install
cf push --no-start
cf start nodeCarshop
