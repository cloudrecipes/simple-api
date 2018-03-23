#!/bin/bash

PROFILE=$1
STACKNAME=$2
BUCKET=$3

AWS_PROFILE=$PROFILE aws cloudformation update-stack --stack-name $STACKNAME \
--template-url https://s3.amazonaws.com/$BUCKET/cf.master.yml \
--parameters ParameterKey=Environment,UsePreviousValue=true \
--capabilities CAPABILITY_NAMED_IAM \
--region ap-southeast-2
