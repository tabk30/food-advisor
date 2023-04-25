import { Code, Function, Runtime } from "aws-cdk-lib/aws-lambda";
import { Construct } from "constructs"

export class LambdaNestJS extends Construct {
    constructor(scope, id) {
        super(scope, id);
        const hander = new Function(this, 'hander', {
            runtime: Runtime.NODEJS_16_X,
            code: Code.fromAsset('src'),
            handler: 'lambda.handler',
            environment: {
                // any config eviroment
            }
        });
    }
}