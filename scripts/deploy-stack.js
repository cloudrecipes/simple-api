#!/usr/bin/env node

const AWS = require('aws-sdk')
const program = require('commander')

const listStacks = (options, statuses) => {
  const {region, stackName} = options

  const params = {
    StackStatusFilter: [
      'CREATE_COMPLETE',
      'UPDATE_IN_PROGRESS',
      'UPDATE_COMPLETE_CLEANUP_IN_PROGRESS',
      'UPDATE_COMPLETE',
      'UPDATE_ROLLBACK_IN_PROGRESS',
      'UPDATE_ROLLBACK_FAILED',
      'UPDATE_ROLLBACK_COMPLETE_CLEANUP_IN_PROGRESS',
      'UPDATE_ROLLBACK_COMPLETE',
    ]
  }

  const cf = new AWS.CloudFormation({apiVersion: '2010-05-15', region})

  return new Promise((resolve, reject) => {
    cf.listStacks(params, (err, data) => {
      if (err) {
        return reject(err)
      }

      const {StackSummaries} = data
      const exists = StackSummaries.find((e) => e.StackName === stackName)
      resolve(exists)
    })
  })
}

const run = () => {
  program
    .option('-r, --region <value>', 'Region where the stack should be created/updated')
    .option('-b, --bucket <value>', 'Templates bucket name')
    .option('-n, --stack-name <value>', 'Stack name')
    .option('-e, --stack-environment <value>', 'Stack environment')
    .parse(process.argv)

  listStacks(program)
    .then((exists) => {
      if (exists) {
        console.log('Stack exists')
        console.log('Updating stack')
      } else {
        console.log('Stack does not exist')
        console.log('Creating stack')
      }
      process.exit(0)
    })
    .catch((err) => {
      console.error(err)
      process.exit(1)
    })
}

run()
