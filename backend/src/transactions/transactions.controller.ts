import {
  Controller,
  Get,
  Param,
  Query,
  ParseIntPipe,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiQuery,
} from '@nestjs/swagger';
import { TransactionsService } from './transactions.service';

@ApiTags('transactions')
@Controller('transactions')
export class TransactionsController {
  constructor(private readonly transactionsService: TransactionsService) {}

  @Get()
  @ApiOperation({ summary: 'Get all transactions with optional filters' })
  @ApiQuery({ name: 'memberId', required: false, description: 'Filter by member ID' })
  @ApiQuery({ name: 'categoryId', required: false, description: 'Filter by category ID' })
  @ApiQuery({ name: 'sessionId', required: false, description: 'Filter by session ID' })
  @ApiQuery({ 
    name: 'type', 
    required: false, 
    enum: ['contribution', 'session_fee', 'onfield_payment', 'refund', 'adjustment'],
    description: 'Filter by transaction type'
  })
  @ApiQuery({ name: 'from', required: false, description: 'Start date (ISO format)' })
  @ApiQuery({ name: 'to', required: false, description: 'End date (ISO format)' })
  @ApiResponse({
    status: 200,
    description: 'List of transactions with relations',
  })
  findAll(
    @Query('memberId') memberId?: string,
    @Query('categoryId') categoryId?: string,
    @Query('sessionId') sessionId?: string,
    @Query('type') type?: string,
    @Query('from') from?: string,
    @Query('to') to?: string,
  ) {
    return this.transactionsService.findAll(
      memberId ? parseInt(memberId) : undefined,
      categoryId ? parseInt(categoryId) : undefined,
      sessionId ? parseInt(sessionId) : undefined,
      type,
      from,
      to,
    );
  }

  @Get('stats/by-type')
  @ApiOperation({ summary: 'Get transaction statistics grouped by type' })
  @ApiResponse({
    status: 200,
    description: 'Transaction statistics by type',
    schema: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          type: { type: 'string', example: 'contribution' },
          count: { type: 'number', example: 5 },
          total: { type: 'number', example: 500.00 },
        },
      },
    },
  })
  getStatsByType() {
    return this.transactionsService.getStatsByType();
  }

  @Get('stats/by-category')
  @ApiOperation({ summary: 'Get transaction statistics grouped by category' })
  @ApiResponse({
    status: 200,
    description: 'Transaction statistics by category',
    schema: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          categoryId: { type: 'number', example: 1 },
          categoryName: { type: 'string', example: 'Field Rental' },
          count: { type: 'number', example: 3 },
          total: { type: 'number', example: 300.00 },
        },
      },
    },
  })
  getStatsByCategory() {
    return this.transactionsService.getStatsByCategory();
  }

  @Get('stats/by-member')
  @ApiOperation({ summary: 'Get transaction statistics grouped by member' })
  @ApiResponse({
    status: 200,
    description: 'Transaction statistics by member',
    schema: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          memberId: { type: 'number', example: 1 },
          memberName: { type: 'string', example: 'John Doe' },
          count: { type: 'number', example: 4 },
          total: { type: 'number', example: -150.00 },
        },
      },
    },
  })
  getStatsByMember() {
    return this.transactionsService.getStatsByMember();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get transaction by ID' })
  @ApiParam({ name: 'id', description: 'Transaction ID' })
  @ApiResponse({
    status: 200,
    description: 'Transaction details with relations',
  })
  @ApiResponse({ status: 404, description: 'Transaction not found' })
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.transactionsService.findOne(id);
  }
}
