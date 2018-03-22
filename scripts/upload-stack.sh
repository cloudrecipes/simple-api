#!/bin/bash

AWS_PROFILE=antklim AWS_REGION=ap-southeast-2 aws s3 cp ./cloudformation/cf.bastion.instance.yml s3://antklim-cf-templates/simple-api/cf.bastion.instance.yml
AWS_PROFILE=antklim AWS_REGION=ap-southeast-2 aws s3 cp ./cloudformation/cf.loadbalancer.yml s3://antklim-cf-templates/simple-api/cf.loadbalancer.yml
AWS_PROFILE=antklim AWS_REGION=ap-southeast-2 aws s3 cp ./cloudformation/cf.master.yml s3://antklim-cf-templates/simple-api/cf.master.yml
AWS_PROFILE=antklim AWS_REGION=ap-southeast-2 aws s3 cp ./cloudformation/cf.network.yml s3://antklim-cf-templates/simple-api/cf.network.yml
AWS_PROFILE=antklim AWS_REGION=ap-southeast-2 aws s3 cp ./cloudformation/cf.security.groups.yml s3://antklim-cf-templates/simple-api/cf.security.groups.yml
AWS_PROFILE=antklim AWS_REGION=ap-southeast-2 aws s3 cp ./cloudformation/cf.service.instance.yml s3://antklim-cf-templates/simple-api/cf.service.instance.yml
