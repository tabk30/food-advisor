import { Module } from "@nestjs/common";
import { SqsModule } from "@ssut/nestjs-sqs";
import { MessageProducer } from "./producer.service";

const generateSQSQueueUrlFromArn = (arn: string | undefined) => {
    if (!arn) throw Error('Not found arn');
    const [_, __, ___, region, accountId, queueName] = arn.split(':');
    return {
      accountId: accountId,
      region: region,
      name: queueName,
      url: process.env.ENV === 'local' ? getOfflineSqsQueueUrl(`https://sqs.${region}.amazonaws.com/${accountId}/${queueName}`) : `https://sqs.${region}.amazonaws.com/${accountId}/${queueName}`
    }
  };
  
const getOfflineSqsQueueUrl = (sqsQueueUrl: string) => {
    const url = new URL(sqsQueueUrl);
    return `${process.env.SQS_OFFLINE_ENDPOINT}${url.pathname}`;
  };
const sqsConfig = generateSQSQueueUrlFromArn(process.env.FIFO_QUEUE_ARN)
console.log("sqsConfig", sqsConfig)

@Module({
    imports: [
        SqsModule.register({
            consumers: [],
            producers: [{
                name: sqsConfig.name,
                queueUrl: sqsConfig.url,
                region: sqsConfig.region
            }]
        })
    ],
    controllers: [],
    providers: [MessageProducer],
    exports: [MessageProducer]
})
export class ProducerModule{}