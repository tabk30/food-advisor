import { Code, Function, Runtime } from "aws-cdk-lib/aws-lambda";
import { Construct } from "constructs";
import * as cdk from 'aws-cdk-lib';
import * as path from "path";
import { LambdaIntegration, RestApi } from "aws-cdk-lib/aws-apigateway";

export class LambdaNestJS extends Construct {
    private readonly appName: string;
    private lambdaHandler: Function;
    private apiGateway: RestApi;

    constructor(private readonly scope: cdk.Stack, id: string) {
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
            code: Code.fromAsset(path.join(__dirname, '../src')),
            handler: 'lambda.handler',
            environment: {
                // any config eviroment
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