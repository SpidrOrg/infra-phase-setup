const { Stack, Duration } = require('aws-cdk-lib');
const {PreRequisiteStack} = require("./pre-requiste-stack");
const {PipelineStack} = require("./pipeline-stack");
const {IngestionPipelineStack} = require("./ingestion-pipeline-stack");
const {TransformationPipelineStack} = require("./transformation-pipeline-stack");

class InfraPhaseSetupStack extends Stack {
  /**
   *
   * @param {Construct} scope
   * @param {string} id
   * @param {StackProps=} props
   */
  constructor(scope, id, props) {
    super(scope, id, props);

    let stackProps = {...props};

    const preRequisiteStack = new PreRequisiteStack(this, "preRequisiteStack", stackProps);

    const platformPipelineStack = new PipelineStack(this, "platformstack", stackProps);
    platformPipelineStack.addDependency(preRequisiteStack);

    const ingestionPipelineStack = new IngestionPipelineStack(this, "IngestionPipelineStack", stackProps);
    ingestionPipelineStack.addDependency(preRequisiteStack);

    const transformationPipelineStack = new TransformationPipelineStack(this, "TransformationPipelineStack", stackProps);
    transformationPipelineStack.addDependency(preRequisiteStack);
  }
}

module.exports = { InfraPhaseSetupStack }
