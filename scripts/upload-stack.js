#!/usr/bin/env node

const AWS = require('aws-sdk')
const async = require('async')
const fs = require('fs')
const path = require('path')
const program = require('commander')

const s3 = new AWS.S3({apiVersion: 'latest'})
const cfDir = path.join(__dirname, '..', 'cloudformation')

const uploadTemplate = (options) => (template, cb) => {
  const {bucket, version} = options
  const bucketParts = bucket.split('/')
  const Bucket = bucketParts.shift()

  bucketParts.push(version, template)
  const Key = bucketParts.join('/')

  const bodyPath = path.join(cfDir, template)
  const Body = fs.createReadStream(bodyPath)

  const params = {
    ServerSideEncryption: 'AES256',
    Bucket,
    Key,
    Body,
  }

  s3.upload(params, cb)
}

const uploadStack = (options, templates) => {
  return new Promise((resolve, reject) => {
    async.each(templates, uploadTemplate(options), err => (err ? reject(err) : resolve()))
  })
}

const run = () => {
  program
    .option('-b, --bucket <value>', 'Templates bucket name')
    .option('-v, --version <value>', 'Stack version (build number)')
    .parse(process.argv)

  const templates = fs.readdirSync(cfDir)

  uploadStack(program, templates)
    .then(() => process.exit(0))
    .catch((err) => {
      console.error(err)
      process.exit(1)
    })
}

run()
