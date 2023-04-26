import { CfnOutput, Duration, RemovalPolicy, Stack } from "aws-cdk-lib";
import { Instance, InstanceClass, InstanceSize, InstanceType, Port, SubnetType, Vpc } from "aws-cdk-lib/aws-ec2";
import { Credentials, DatabaseInstance, DatabaseInstanceEngine, PostgresEngineVersion } from "aws-cdk-lib/aws-rds";
import { Construct } from "constructs";

export class RdsInitializer extends Construct {
    private readonly appName: string;
    private _rdsDatabase: DatabaseInstance;
    public get rds(): DatabaseInstance {
        return this._rdsDatabase
    }

    constructor(
        private readonly scope: Stack,
        private readonly id: string,
        private readonly vpc: Vpc,
        private readonly ec2: Instance
    ) {
        super(scope, id);
        this.appName = scope.node.tryGetContext('appName') || "Food-Advisor";
        this.createRdsDatabase();
    }

    private createRdsDatabase(): void {
        this._rdsDatabase = new DatabaseInstance(this, `${this.appName}-rds-db`, {
            vpc: this.vpc,
            vpcSubnets: {
                subnetType: SubnetType.PRIVATE_ISOLATED
            },
            engine: DatabaseInstanceEngine.postgres({
                version: PostgresEngineVersion.VER_14
            }),
            instanceType: InstanceType.of(
                InstanceClass.BURSTABLE3,
                InstanceSize.MICRO
            ),
            credentials: Credentials.fromGeneratedSecret('postgres'),
            multiAz: false,
            allocatedStorage: 100,
            maxAllocatedStorage: 110,
            allowMajorVersionUpgrade: false,
            autoMinorVersionUpgrade: true,
            backupRetention: Duration.days(0),
            deleteAutomatedBackups: true,
            removalPolicy: RemovalPolicy.DESTROY,
            deletionProtection: false,
            databaseName: 'foodAdvisorDB',
            publiclyAccessible: false,
        });
        this._rdsDatabase.connections.allowFrom(this.ec2, Port.tcp(5432));
        // this._rdsDatabase.connections.allowFrom(this.lambda, Port.tcp(5432));

        new CfnOutput(this, 'dbEndpoint', {
            value: this._rdsDatabase.instanceEndpoint.hostname,
        });

        new CfnOutput(this, 'secretName', {
            // eslint-disable-next-line @typescript-eslint/no-non-null-asserted-optional-chain
            value: this._rdsDatabase.secret?.secretName!,
        });
    }

}