import {
  Controller,
  Get,
  Query,
  Param,
  ParseIntPipe,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiQuery,
  ApiParam,
} from '@nestjs/swagger';
import { ReportsService } from './reports.service';

@ApiTags('reports')
@Controller('reports')
export class ReportsController {
  constructor(private readonly reportsService: ReportsService) {}

  @Get('team-balance')
  @ApiOperation({ summary: 'Get comprehensive team balance report' })
  @ApiResponse({
    status: 200,
    description: 'Team balance report with member details',
  })
  getTeamBalanceReport() {
    return this.reportsService.getTeamBalanceReport();
  }

  @Get('spending-by-category')
  @ApiOperation({ summary: 'Get spending breakdown by category' })
  @ApiQuery({ name: 'from', required: false, description: 'Start date (ISO format)' })
  @ApiQuery({ name: 'to', required: false, description: 'End date (ISO format)' })
  @ApiResponse({
    status: 200,
    description: 'Spending statistics grouped by category',
  })
  getSpendingByCategory(
    @Query('from') from?: string,
    @Query('to') to?: string,
  ) {
    return this.reportsService.getSpendingByCategory(from, to);
  }

  @Get('session-costs')
  @ApiOperation({ summary: 'Get session cost analytics' })
  @ApiQuery({ name: 'from', required: false, description: 'Start date (ISO format)' })
  @ApiQuery({ name: 'to', required: false, description: 'End date (ISO format)' })
  @ApiResponse({
    status: 200,
    description: 'Session cost analytics with attendance data',
  })
  getSessionCostAnalytics(
    @Query('from') from?: string,
    @Query('to') to?: string,
  ) {
    return this.reportsService.getSessionCostAnalytics(from, to);
  }

  @Get('attendance-summary')
  @ApiOperation({ summary: 'Get attendance summary and statistics' })
  @ApiQuery({ name: 'from', required: false, description: 'Start date (ISO format)' })
  @ApiQuery({ name: 'to', required: false, description: 'End date (ISO format)' })
  @ApiResponse({
    status: 200,
    description: 'Attendance statistics by member',
  })
  getAttendanceSummary(
    @Query('from') from?: string,
    @Query('to') to?: string,
  ) {
    return this.reportsService.getAttendanceSummary(from, to);
  }

  @Get('member-balance-history/:id')
  @ApiOperation({ summary: 'Get balance history for a specific member' })
  @ApiParam({ name: 'id', description: 'Member ID' })
  @ApiResponse({
    status: 200,
    description: 'Member balance history with running balance',
  })
  @ApiResponse({ status: 404, description: 'Member not found' })
  getMemberBalanceHistory(@Param('id', ParseIntPipe) id: number) {
    return this.reportsService.getMemberBalanceHistory(id);
  }
}
