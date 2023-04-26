import { Stack, StackProps } from "aws-cdk-lib";
import { Construct } from "constructs";
import { AmazonLinuxGeneration, AmazonLinuxImage, Instance, InstanceClass, InstanceSize, InstanceType, Peer, Port, SecurityGroup, SubnetType, Vpc } from "aws-cdk-lib/aws-ec2";

export class NetworkInitializer extends Construct {
    private readonly appName: string;

    private _vpc: Vpc;
    private _ec2SecurityGroup: SecurityGroup;
    public get vpc (): Vpc {
        return this._vpc;
    }

    private _ec2: Instance;
    public get ec2 (): Instance {
        return this._ec2;
    }

    constructor(
        private readonly scope: Stack, 
        private readonly id: string) {
        super(scope, id);
        this.appName = scope.node.tryGetContext('appName') || "Food-Advisor";

        this.createVpc();
        this.createSecurityGroup();
        this.createEc2();
    }

    // 👇 create the VPC
    private createVpc() {
        this._vpc = new Vpc(this, `${this.appName}-vpc`, {
            cidr: '10.0.0.0/16',
            natGateways: 1,
            maxAzs: 2,
            subnetConfiguration: [
                {
                    name: 'public-subnet-1',
                    subnetType: SubnetType.PUBLIC,
                    cidrMask: 24
                },
                {
                    name: 'private-subnet-1',
                    subnetType: SubnetType.PRIVATE_ISOLATED,
                    cidrMask: 24
                },
                {
                    name: 'private-subnet-2',
                    subnetType: SubnetType.PRIVATE_WITH_EGRESS,
                    cidrMask: 24,
                  }
            ]
        });
    }

    // 👇 create a security group for the EC2 instance
    private createSecurityGroup(){
        this._ec2SecurityGroup = new SecurityGroup(this, `${this.appName}-ec2-sercurity-group`, {
            vpc: this._vpc
        });
        this._ec2SecurityGroup.addIngressRule(
            Peer.anyIpv4(),
            Port.tcp(22),
            'allow SSH connections from anywhere'
        );
    }

    // 👇 create the EC2 instance
    private createEc2() {
        this._ec2 = new Instance(this, `${this.appName}-ec-instance`, {
            vpc: this._vpc,
            vpcSubnets: {
                subnetType: SubnetType.PUBLIC
            },
            securityGroup: this._ec2SecurityGroup,
            instanceType: InstanceType.of(
                InstanceClass.BURSTABLE2,
                InstanceSize.MICRO
            ),
            machineImage: new AmazonLinuxImage({
                generation: AmazonLinuxGeneration.AMAZON_LINUX_2
            }),
            keyName: 'anhpt-personal-tabk301991'
        });
    }
}