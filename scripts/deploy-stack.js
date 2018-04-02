#!/usr/bin/env node

const AWS = require('aws-sdk')
const program = require('commander')

// TODO: add wait untill stack create/update finishes
// TODO: refactor create/update methods
// TODO: add version to stack parameters

const listStacks = (options) => {
  const {region, stackNamespace, stackEnvironment} = options
  const stackName = `${stackNamespace}-${stackEnvironment}`

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

const createStack = (options) => {
  const {bucket, region, stackNamespace, stackEnvironment, version} = options
  const stackName = `${stackNamespace}-${stackEnvironment}`

  const params = {
    StackName: stackName,
    Capabilities: ['CAPABILITY_IAM'],
    Parameters: [
      {ParameterKey: 'Environment', ParameterValue: stackEnvironment},
      {ParameterKey: 'Namespace', ParameterValue: stackNamespace},
    ],
    TemplateURL: `https://s3.amazonaws.com/${bucket}/${version}/cf.master.yml`
  }

  const cf = new AWS.CloudFormation({apiVersion: '2010-05-15', region})

  return new Promise((resolve, reject) => {
    console.log(`Creating stack: ${stackName}`)
    resolve({})
    // cf.createStack(params, (err, data) => (err ? reject(err) : resolve(data)))
  })
}

const updateStack = (options) => {
  const {bucket, region, stackNamespace, stackEnvironment, version} = options
  const stackName = `${stackNamespace}-${stackEnvironment}`

  const params = {
    StackName: stackName,
    Capabilities: ['CAPABILITY_IAM'],
    Parameters: [
      {ParameterKey: 'Environment', ParameterValue: stackEnvironment},
      {ParameterKey: 'Namespace', ParameterValue: stackNamespace},
    ],
    TemplateURL: `https://s3.amazonaws.com/${bucket}/${version}/cf.master.yml`
  }

  const cf = new AWS.CloudFormation({apiVersion: '2010-05-15', region})

  return new Promise((resolve, reject) => {
    console.log(`Updating stack: ${stackName}`)
    resolve({})
    // cf.updateStack(params, (err, data) => (err ? reject(err) : resolve(data)))
  })
}

const run = () => {
  program
    .option('-r, --region <value>', 'Region where the stack should be created/updated')
    .option('-b, --bucket <value>', 'Templates bucket name')
    .option('-n, --stack-namespace <value>', 'Stack namespace')
    .option('-e, --stack-environment <value>', 'Stack environment')
    .option('-v, --version <value>', 'Stack version (build number)')
    .parse(process.argv)

  listStacks(program)
    .then((exists) => (exists ? updateStack(program) : createStack(program)))
    .then((data) => {
      console.log(data)
      process.exit(0)
    })
    .catch((err) => {
      console.error(err)
      process.exit(1)
    })
}

run()
