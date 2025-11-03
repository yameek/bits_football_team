import {
  Controller,
  Get,
  Post,
  Body,
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
  ApiBody,
} from '@nestjs/swagger';
import { TransactionsService } from './transactions.service';
import { BulkPaymentDto } from './dto/bulk-payment.dto';

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

  @Post('bulk-payment')
  @ApiOperation({
    summary: 'Create a bulk payment split among multiple members',
    description: 'Creates transactions for multiple members at once. Can split equally or use custom amounts for each member.',
  })
  @ApiBody({
    type: BulkPaymentDto,
    examples: {
      equalSplit: {
        summary: 'Equal split among members',
        value: {
          memberIds: [1, 2, 3, 4],
          amount: 1000,
          splitType: 'equal',
          notes: 'Equipment purchase',
        },
      },
      customSplit: {
        summary: 'Custom amounts for each member',
        value: {
          memberIds: [1, 2, 3],
          amount: 600,
          splitType: 'custom',
          customAmounts: [
            { memberId: 1, amount: 200 },
            { memberId: 2, amount: 250 },
            { memberId: 3, amount: 150 },
          ],
          notes: 'Unequal contribution',
        },
      },
    },
  })
  @ApiResponse({
    status: 201,
    description: 'Bulk payment created successfully',
    schema: {
      type: 'object',
      properties: {
        groupId: { type: 'string', example: '550e8400-e29b-41d4-a716-446655440000' },
        transactions: {
          type: 'array',
          items: { type: 'object' },
        },
        summary: {
          type: 'object',
          properties: {
            totalAmount: { type: 'number', example: 1000 },
            memberCount: { type: 'number', example: 4 },
            splitType: { type: 'string', example: 'equal' },
          },
        },
      },
    },
  })
  @ApiResponse({ status: 400, description: 'Invalid bulk payment data' })
  @ApiResponse({ status: 404, description: 'One or more members not found' })
  createBulkPayment(@Body() bulkPaymentDto: BulkPaymentDto) {
    return this.transactionsService.createBulkPayment(bulkPaymentDto);
  }

  @Get('bulk/:groupId')
  @ApiOperation({
    summary: 'Get all transactions in a bulk payment group',
    description: 'Retrieves all transactions that belong to the same bulk payment group.',
  })
  @ApiParam({
    name: 'groupId',
    description: 'Bulk payment group ID (UUID)',
    example: '550e8400-e29b-41d4-a716-446655440000',
  })
  @ApiResponse({
    status: 200,
    description: 'Bulk payment group details',
    schema: {
      type: 'object',
      properties: {
        groupId: { type: 'string' },
        transactions: {
          type: 'array',
          items: { type: 'object' },
        },
        summary: {
          type: 'object',
          properties: {
            totalAmount: { type: 'number', example: 1000 },
            memberCount: { type: 'number', example: 4 },
          },
        },
      },
    },
  })
  @ApiResponse({ status: 404, description: 'Bulk payment group not found' })
  findBulkPaymentGroup(@Param('groupId') groupId: string) {
    return this.transactionsService.findBulkPaymentGroup(groupId);
  }
}
