import { Injectable } from "@nestjs/common";
import { SqsService } from "@ssut/nestjs-sqs";

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

@Injectable()
export class MessageProducer {
    constructor(private readonly sqsService: SqsService){}
    async sendMessage(body: any) {
        console.log("senmessage", body)
        const message: any = JSON.stringify(body);

        try {
            await this.sqsService.send(sqsConfig.name, message);
        } catch (error) {
            console.log('error in producing image!', error);
        }

    }
}