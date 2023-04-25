import { APIGatewayEvent } from 'aws-lambda';

export const isLocalHost = (event: APIGatewayEvent): boolean => {
  const isLocalHost = event.headers?.host?.includes('localhost');
  return isLocalHost ?? false;
};

export type SQSConfig = {
  accountId: string,
  region: string,
  name: string,
  url: string
}

export const generateSQSQueueUrlFromArn = (arn: string | undefined): SQSConfig => {
  if (!arn) throw Error('Not found arn');
  const [_, __, ___, region, accountId, queueName] = arn.split(':');
  return {
    accountId: accountId,
    region: region,
    name: queueName,
    url: process.env.ENV === 'local' ? getOfflineSqsQueueUrl(`https://sqs.${region}.amazonaws.com/${accountId}/${queueName}`) : `https://sqs.${region}.amazonaws.com/${accountId}/${queueName}`
  }
};

export const getOfflineSqsQueueUrl = (sqsQueueUrl: string) => {
  const url = new URL(sqsQueueUrl);
  return `${process.env.SQS_OFFLINE_ENDPOINT}${url.pathname}`;
};

