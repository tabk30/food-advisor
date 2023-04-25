import { Injectable } from '@nestjs/common';
import { MessageProducer } from './infrastructure';

@Injectable()
export class AppService {
  constructor(private readonly sqsPoduser: MessageProducer){

  }
  getHello(): string {
    return 'Hello World food advisor 1';
  }
  sendMessage(message: any) {
    this.sqsPoduser.sendMessage(message)
  }
}
