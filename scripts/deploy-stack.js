#!/usr/bin/env node

const AWS = require('aws-sdk')
const program = require('commander')

const stackName = ({stackNamespace, stackEnvironment}) => `${stackNamespace}-${stackEnvironment}`

const listStacks = (options) => {
  const {region, stackNamespace, stackEnvironment} = options
  const stackname = stackName(options)

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
      const exists = StackSummaries.find((e) => e.StackName === stackname)
      resolve(exists)
    })
  })
}

const deployStack = (options, exists) => {
  const {bucket, region, stackNamespace, stackEnvironment, version} = options
  const StackName = stackName(options)

  const params = {
    StackName,
    Capabilities: ['CAPABILITY_IAM', 'CAPABILITY_NAMED_IAM'],
    Parameters: [
      {ParameterKey: 'Environment', ParameterValue: stackEnvironment},
      {ParameterKey: 'Namespace', ParameterValue: stackNamespace},
      {ParameterKey: 'Version', ParameterValue: version},
    ],
    TemplateURL: `https://s3.amazonaws.com/${bucket}/${version}/cf.master.yml`
  }

  const cf = new AWS.CloudFormation({apiVersion: '2010-05-15', region})

  return new Promise((resolve, reject) => {
    console.log(`${exists ? 'Updating' : 'Creating'} stack: ${StackName}`)
    const action = exists ? cf.updateStack : cf.createStack
    action.call(cf, params, (err, data) => (err ? reject(err) : resolve(data)))
  })
}

const waitForDeployFinish = (options, exists) => {
  const {region} = options
  const StackName = stackName(options)
  const waitFor = exists ? 'stackUpdateComplete' : 'stackCreateComplete'

  const params = {StackName}

  const cf = new AWS.CloudFormation({apiVersion: '2010-05-15', region})

  return new Promise((resolve, reject) => {
    cf.waitFor(waitFor, params, (err, data) => (err ? reject(err) : resolve(data)))
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

  let stackExists

  listStacks(program)
    .then((exists) => {
      stackExists = exists
      return Promise.resolve()
    })
    .then(() => deployStack(program, stackExists))
    .then(() => waitForDeployFinish(program, stackExists))
    .then((data) => {
      console.log('Data')
      console.log(data)
      process.exit(0)
    })
    .catch((err) => {
      console.log('Error')
      console.error(err)
      process.exit(1)
    })
}

run()
