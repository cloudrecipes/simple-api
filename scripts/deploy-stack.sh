#!/bin/bash

REGION=$1
TEMPLATES_BUCKET=$2
STACK_NAME=$3
STACK_ENVIRONMENT=$4

# Check if stack exists
if aws cloudformation describe-stacks --stack-name $STACK_NAME --region $REGION; then
  echo "Stack exists"
else
  echo "Stack does not exist"
fi
