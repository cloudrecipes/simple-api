#!/bin/bash

AWS_PROFILE=antklim aws cloudformation create-stack --stack-name simple-api \
--template-url https://s3.amazonaws.com/antklim-cf-templates/simple-api/cf.master.yml \
--parameters ParameterKey=Environment,ParameterValue=dev \
--capabilities CAPABILITY_NAMED_IAM \
--region ap-southeast-2
