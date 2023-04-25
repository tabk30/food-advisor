import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import { ProxyResult } from 'aws-lambda';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) { }

  @Get()
  async getHello(event: any): Promise<ProxyResult> {
    this.appService.sendMessage({body: "hello sqs"})
    return {
      statusCode: 200,
      body: 'Published message to SQS queue',
    };
  }
}
