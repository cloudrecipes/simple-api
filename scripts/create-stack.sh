#!/bin/bash

PROFILE=$1
STACKNAME=$2
BUCKET=$3
ENVIRONMENT=$4

AWS_PROFILE=$PROFILE aws cloudformation create-stack --stack-name $STACKNAME \
--template-url https://s3.amazonaws.com/$BUCKET/cf.master.yml \
--parameters ParameterKey=Environment,ParameterValue=$ENVIRONMENT \
--capabilities CAPABILITY_NAMED_IAM \
--region ap-southeast-2
