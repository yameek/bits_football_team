import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';

@ApiTags('health')
@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  @ApiOperation({ 
    summary: 'Health check endpoint',
    description: 'Returns a simple message to verify the API is running',
  })
  @ApiResponse({ 
    status: 200, 
    description: 'API is healthy and running',
    schema: {
      type: 'object',
      properties: {
        message: { type: 'string', example: 'Football Team Treasury API v1.0' },
        status: { type: 'string', example: 'healthy' },
        timestamp: { type: 'string', format: 'date-time' },
      },
    },
  })
  getHello() {
    return this.appService.getHello();
  }
}
