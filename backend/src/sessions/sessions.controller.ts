import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  Query,
  ParseIntPipe,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiQuery,
} from '@nestjs/swagger';
import { SessionsService } from './sessions.service';
import { CreateSessionDto } from './dto/create-session.dto';
import { UpdateSessionDto } from './dto/update-session.dto';
import { BulkAttendanceDto } from './dto/mark-attendance.dto';
import { OnFieldCollectionDto } from './dto/onfield-collection.dto';

@ApiTags('sessions')
@Controller('sessions')
export class SessionsController {
  constructor(private readonly sessionsService: SessionsService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new session' })
  @ApiResponse({
    status: 201,
    description: 'Session successfully created',
  })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @ApiResponse({ status: 404, description: 'Field not found' })
  create(@Body() createSessionDto: CreateSessionDto) {
    return this.sessionsService.create(createSessionDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all sessions with optional filters' })
  @ApiQuery({ name: 'status', required: false, enum: ['planned', 'completed', 'canceled'] })
  @ApiQuery({ name: 'from', required: false, description: 'Start date (ISO format)' })
  @ApiQuery({ name: 'to', required: false, description: 'End date (ISO format)' })
  @ApiResponse({
    status: 200,
    description: 'List of sessions',
  })
  findAll(
    @Query('status') status?: string,
    @Query('from') from?: string,
    @Query('to') to?: string,
  ) {
    return this.sessionsService.findAll(status, from, to);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get session by ID' })
  @ApiParam({ name: 'id', description: 'Session ID' })
  @ApiResponse({
    status: 200,
    description: 'Session details',
  })
  @ApiResponse({ status: 404, description: 'Session not found' })
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.sessionsService.findOne(id);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update session' })
  @ApiParam({ name: 'id', description: 'Session ID' })
  @ApiResponse({
    status: 200,
    description: 'Session successfully updated',
  })
  @ApiResponse({ status: 404, description: 'Session not found' })
  @ApiResponse({ status: 400, description: 'Cannot update completed session' })
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateSessionDto: UpdateSessionDto,
  ) {
    return this.sessionsService.update(id, updateSessionDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Delete session' })
  @ApiParam({ name: 'id', description: 'Session ID' })
  @ApiResponse({
    status: 200,
    description: 'Session successfully deleted',
  })
  @ApiResponse({ status: 404, description: 'Session not found' })
  @ApiResponse({ status: 400, description: 'Cannot delete completed session' })
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.sessionsService.remove(id);
  }

  @Post(':id/attendance/bulk')
  @ApiOperation({ summary: 'Mark attendance for multiple members' })
  @ApiParam({ name: 'id', description: 'Session ID' })
  @ApiResponse({
    status: 201,
    description: 'Attendance records created/updated',
  })
  @ApiResponse({ status: 404, description: 'Session or member not found' })
  @ApiResponse({ status: 400, description: 'Cannot mark attendance for completed session' })
  markAttendanceBulk(
    @Param('id', ParseIntPipe) id: number,
    @Body() bulkAttendanceDto: BulkAttendanceDto,
  ) {
    return this.sessionsService.markAttendanceBulk(id, bulkAttendanceDto);
  }

  @Get(':id/attendance')
  @ApiOperation({ summary: 'Get attendance records for a session' })
  @ApiParam({ name: 'id', description: 'Session ID' })
  @ApiResponse({
    status: 200,
    description: 'List of attendance records',
  })
  @ApiResponse({ status: 404, description: 'Session not found' })
  getAttendance(@Param('id', ParseIntPipe) id: number) {
    return this.sessionsService.getAttendance(id);
  }

  @Post(':id/onfield-collection')
  @ApiOperation({ summary: 'Record on-field payment collection' })
  @ApiParam({ name: 'id', description: 'Session ID' })
  @ApiResponse({
    status: 201,
    description: 'Payment recorded successfully',
  })
  @ApiResponse({ status: 404, description: 'Session or member not found' })
  @ApiResponse({ status: 400, description: 'Invalid payment data' })
  recordOnFieldCollection(
    @Param('id', ParseIntPipe) id: number,
    @Body() onFieldCollectionDto: OnFieldCollectionDto,
  ) {
    return this.sessionsService.recordOnFieldCollection(id, onFieldCollectionDto);
  }

  @Get(':id/total-cost')
  @ApiOperation({ summary: 'Get total cost for a session' })
  @ApiParam({ name: 'id', description: 'Session ID' })
  @ApiResponse({
    status: 200,
    description: 'Total session cost',
    schema: {
      type: 'object',
      properties: {
        totalCost: { type: 'number', example: 195.00 },
      },
    },
  })
  @ApiResponse({ status: 404, description: 'Session not found' })
  async getTotalCost(@Param('id', ParseIntPipe) id: number) {
    const totalCost = await this.sessionsService.getTotalCost(id);
    return { totalCost };
  }
}
