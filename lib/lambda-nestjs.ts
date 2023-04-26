import { Code, Function, Runtime } from "aws-cdk-lib/aws-lambda";
import { Construct } from "constructs";
import * as cdk from 'aws-cdk-lib';
import * as path from "path";
import { LambdaIntegration, RestApi } from "aws-cdk-lib/aws-apigateway";
import { SubnetType, Vpc } from "aws-cdk-lib/aws-ec2";

export class LambdaNestJS extends Construct {
    private readonly appName: string;
    private lambdaHandler: Function;
    private apiGateway: RestApi;

    constructor(
        private readonly scope: cdk.Stack, 
        private readonly id: string,
        private readonly vpc: Vpc,
    ) {
        super(scope, id);
        this.appName = scope.node.tryGetContext('appName') || "Food-Advisor";

        this.createLambdaHandler();
        this.createApiGateWay();
    }

    /*
        Creating lambda function for handling API endpoints
    */
    private createLambdaHandler() {
        this.lambdaHandler = new Function(this, `${this.appName}-lamdda-handler`, {
            runtime: Runtime.NODEJS_16_X,
            code: Code.fromAsset(path.join(__dirname, '../api/src')),
            handler: 'lambda.handler',
            // 👇 place lambda in the VPC
            vpc: this.vpc,
            // 👇 place lambda in Private Subnets
            vpcSubnets: {
                subnetType: SubnetType.PRIVATE_WITH_EGRESS
            },
            environment: {
                // any config eviroment
                dbname: 'foodAdvisorDB',
                dbtype: 'engine',
                dbhost: 'cdkappstack-postgresdbfoodadvisorrdsdb1b63d95f-r0js785fdji4.cadptjxhazkw.ap-southeast-1.rds.amazonaws.com',
                dbport: '5432',
                dbusername: 'postgres',
                dbpassword: 'rrJkFXJaN6Vu,1zi0.bOTEoruz^bTt',
                dbInstanceIdentifier: 'cdkappstack-postgresdbfoodadvisorrdsdb1b63d95f-r0js785fdji4'
            }
        });
    }

    /*
        API Gateway integration
    */
    private createApiGateWay() {
        this.apiGateway = new RestApi(this, `${this.appName}-api-gateway`,
            {
                description: "Api gateway",
                deployOptions: {
                    stageName: "develop"
                },
                defaultCorsPreflightOptions: {
                    allowHeaders: [
                        'Content-Type',
                        'X-Amz-Date',
                        'Authorization',
                        'X-Api-Key',
                    ],
                    allowMethods: ['OPTIONS', 'GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
                    allowCredentials: true,
                    allowOrigins: ['http://localhost:3000'],
                }
            }
        );
        new cdk.CfnOutput(this, 'apiUrl', {value: this.apiGateway.url});
        this.addApiGatewayReource();
    }
    private addApiGatewayReource () {
        const apiGateways = this.apiGateway.root.addResource('restaurant');
        const apiGateway = apiGateways.addResource('{id}');

        apiGateways.addMethod('POST', new LambdaIntegration(this.lambdaHandler));
        apiGateways.addMethod('GET', new LambdaIntegration(this.lambdaHandler));

        apiGateway.addMethod('GET', new LambdaIntegration(this.lambdaHandler));
        apiGateway.addMethod('PUT', new LambdaIntegration(this.lambdaHandler));
        apiGateway.addMethod('DELETE', new LambdaIntegration(this.lambdaHandler));
    }
}