#!/usr/bin/env node

const cdk = require('aws-cdk-lib');
const { InfraPhaseSetupStack } = require('../lib/infra-phase-setup-stack');

const indexOfAwsAccountInArnSplit = process.env.CODEBUILD_BUILD_ARN.split(":").indexOf(process.env.AWS_REGION) + 1;
const awsAccount = process.env.CODEBUILD_BUILD_ARN.split(":")[indexOfAwsAccountInArnSplit];
const awsRegion = process.env.AWS_REGION;
const codestarConnArn = process.env.MP_GITHUB_CONN_ARN;
const ingestionAwsRepo = process.env.MP_INGESTION_AWS_REPO.split("/");
const transformationAwsRepo = process.env.MP_TRANSFORMATION_AWS_REPO.split("/");
const platformTfRepo = process.env.MP_PLATFORM_TF_REPO.split("/");
const envName = process.env.MP_ENV_NAME;
const githubRepoLink = process.env.MP_GITHUB_ECR_REPO_LINK;

const app = new cdk.App();
new InfraPhaseSetupStack(app, 'InfraPhaseSetupStack', {
  env: { account: awsAccount, region: awsRegion },
  envName,
  codestarConnArn,
  ingestionAwsRepo,
  transformationAwsRepo,
  platformTfRepo,
  githubRepoLink
});
