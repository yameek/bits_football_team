import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getHello() {
    return {
      message: 'Football Team Treasury API v1.0',
      status: 'healthy',
      timestamp: new Date().toISOString(),
    };
  }
}
