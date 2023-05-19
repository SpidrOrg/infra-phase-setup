const {Stack, Duration} = require('aws-cdk-lib');
const s3 = require("aws-cdk-lib/aws-s3");
const dynamodb = require("aws-cdk-lib/aws-dynamodb");
const s3deploy = require("aws-cdk-lib/aws-s3-deployment");
const ssm = require('aws-cdk-lib/aws-ssm');
const path = require("path");
const fs = require("fs");

class PreRequisiteStack extends Stack {
  constructor(scope, id, props) {
    super(scope, id, props);

    const {env, envName} = props;
    const awsAccount = env.account;
    // Step 1: Create S3 Bucket
    const terraformStateBucket = new s3.Bucket(this, 'terraformStateFileS3Bucket', {
      bucketName: `${awsAccount}-statefile`,
      versioned: true,
      bucketKeyEnabled: true,
      encryption: s3.BucketEncryption.KMS
    });
    new ssm.StringParameter(this, 'terraformStateFileS3BucketSSMParameter', {
      parameterName: `terraformStateFileS3Bucket`,
      stringValue: terraformStateBucket.bucketName
    });

    // Step 2:
    const terraformStateLockDDTable = new dynamodb.Table(this, 'terraformStatelockDynamoDB', {
      partitionKey: { name: 'LockID', type: dynamodb.AttributeType.STRING },
      tableName: "tf-statelock"
    });
    new ssm.StringParameter(this, 'terraformStateLockDDTableSSMParameter', {
      parameterName: `terraformStateLockDDTable`,
      stringValue: terraformStateLockDDTable.tableName
    });
    // Step 3:
    const lamdaFunctionCodebaseBucketName = `${awsAccount}-codebase`
    const codebaseBucket = new s3.Bucket(this, 'terraformLambdasS3Bucket', {
      bucketName: lamdaFunctionCodebaseBucketName
    });

    // Step 3a: Create bucket folders
    new s3deploy.BucketDeployment(this, `client-bucket-folders-${lamdaFunctionCodebaseBucketName}`, {
      sources: [s3deploy.Source.asset(path.join(__dirname, '../values/s3-codebase-bucket-folders'))],
      destinationBucket: codebaseBucket,
    });

    new ssm.StringParameter(this, 'envNameSSMParameter', {
      parameterName: `envName`,
      stringValue: envName
    });
  }
}

module.exports = {PreRequisiteStack}
