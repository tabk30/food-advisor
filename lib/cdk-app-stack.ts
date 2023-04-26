import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
// import * as sqs from 'aws-cdk-lib/aws-sqs';
import { LambdaNestJS } from './lambda-nestjs';
import { NetworkInitializer } from './network-initializer';
import { RdsInitializer } from './rds-initializer';

export class CdkAppStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    // The code that defines your stack goes here

    // example resource
    // const queue = new sqs.Queue(this, 'CdkAppQueue', {
    //   visibilityTimeout: cdk.Duration.seconds(300)
    // });
    const network = new NetworkInitializer(this, "NetworkInitializer");
    const lambdaFn = new LambdaNestJS(this, "LambdaNestJS", network.vpc);
    const dbInstance = new RdsInitializer(this, 'PostgresDb', network.vpc, network.ec2)
  }
}
