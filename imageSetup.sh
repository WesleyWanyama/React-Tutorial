#!/bin/bash

#Ensure you have logged in
docker login

#Tag the image
docker tag react-frontend:v1 wesley3015/react-frontend:v1

#Push the image
docker push wesley3015/react-frontend:v1