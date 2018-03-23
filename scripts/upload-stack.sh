#!/bin/bash

PROFILE=$1
REGION=$2
BUCKET=$3

AWS_PROFILE=$PROFILE AWS_REGION=$REGION aws s3 cp ./cloudformation/cf.bastion.instance.yml s3://$BUCKET/cf.bastion.instance.yml
AWS_PROFILE=$PROFILE AWS_REGION=$REGION aws s3 cp ./cloudformation/cf.loadbalancer.yml s3://$BUCKET/cf.loadbalancer.yml
AWS_PROFILE=$PROFILE AWS_REGION=$REGION aws s3 cp ./cloudformation/cf.master.yml s3://$BUCKET/cf.master.yml
AWS_PROFILE=$PROFILE AWS_REGION=$REGION aws s3 cp ./cloudformation/cf.network.yml s3://$BUCKET/cf.network.yml
AWS_PROFILE=$PROFILE AWS_REGION=$REGION aws s3 cp ./cloudformation/cf.security.groups.yml s3://$BUCKET/cf.security.groups.yml
AWS_PROFILE=$PROFILE AWS_REGION=$REGION aws s3 cp ./cloudformation/cf.service.instance.yml s3://$BUCKET/cf.service.instance.yml
