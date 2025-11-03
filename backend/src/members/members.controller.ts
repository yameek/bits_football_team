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
import { MembersService } from './members.service';
import { CreateMemberDto } from './dto/create-member.dto';
import { UpdateMemberDto } from './dto/update-member.dto';
import { AddContributionDto } from './dto/add-contribution.dto';
import { VerifyPinDto } from './dto/verify-pin.dto';

@ApiTags('members')
@Controller('members')
export class MembersController {
  constructor(private readonly membersService: MembersService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new member' })
  @ApiResponse({
    status: 201,
    description: 'Member successfully created',
  })
  @ApiResponse({ status: 400, description: 'Bad request' })
  create(@Body() createMemberDto: CreateMemberDto) {
    return this.membersService.create(createMemberDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all members' })
  @ApiResponse({
    status: 200,
    description: 'List of all members',
  })
  findAll() {
    return this.membersService.findAll();
  }

  @Get('team-balance')
  @ApiOperation({ summary: 'Get team balance summary' })
  @ApiResponse({
    status: 200,
    description: 'Team balance summary with member counts',
  })
  getTeamBalance() {
    return this.membersService.getTeamBalance();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get member by ID' })
  @ApiParam({ name: 'id', description: 'Member ID' })
  @ApiResponse({
    status: 200,
    description: 'Member details',
  })
  @ApiResponse({ status: 404, description: 'Member not found' })
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.membersService.findOne(id);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update member' })
  @ApiParam({ name: 'id', description: 'Member ID' })
  @ApiResponse({
    status: 200,
    description: 'Member successfully updated',
  })
  @ApiResponse({ status: 404, description: 'Member not found' })
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateMemberDto: UpdateMemberDto,
  ) {
    return this.membersService.update(id, updateMemberDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Delete member (soft or hard delete)' })
  @ApiParam({ name: 'id', description: 'Member ID' })
  @ApiQuery({
    name: 'mode',
    enum: ['soft', 'hard'],
    required: false,
    description: 'Deletion mode: soft (deactivate) or hard (permanent delete)',
  })
  @ApiResponse({
    status: 200,
    description: 'Member successfully deleted',
  })
  @ApiResponse({ status: 404, description: 'Member not found' })
  remove(
    @Param('id', ParseIntPipe) id: number,
    @Query('mode') mode: 'soft' | 'hard' = 'soft',
  ) {
    return this.membersService.remove(id, mode);
  }

  @Post(':id/contributions')
  @ApiOperation({ summary: 'Add contribution for member' })
  @ApiParam({ name: 'id', description: 'Member ID' })
  @ApiResponse({
    status: 201,
    description: 'Contribution successfully added',
  })
  @ApiResponse({ status: 404, description: 'Member not found' })
  addContribution(
    @Param('id', ParseIntPipe) id: number,
    @Body() addContributionDto: AddContributionDto,
  ) {
    return this.membersService.addContribution(id, addContributionDto);
  }

  @Get(':id/transactions')
  @ApiOperation({ summary: 'Get all transactions for a member' })
  @ApiParam({ name: 'id', description: 'Member ID' })
  @ApiResponse({
    status: 200,
    description: 'List of member transactions',
  })
  @ApiResponse({ status: 404, description: 'Member not found' })
  findTransactions(@Param('id', ParseIntPipe) id: number) {
    return this.membersService.findTransactions(id);
  }

  @Get(':id/attendance')
  @ApiOperation({ summary: 'Get attendance history for a member' })
  @ApiParam({ name: 'id', description: 'Member ID' })
  @ApiResponse({
    status: 200,
    description: 'List of member attendance records',
  })
  @ApiResponse({ status: 404, description: 'Member not found' })
  findAttendance(@Param('id', ParseIntPipe) id: number) {
    return this.membersService.findAttendance(id);
  }

  @Get('by-pin/:pin')
  @ApiOperation({ summary: 'Find member by PIN/Office ID' })
  @ApiParam({ name: 'pin', description: 'Member PIN/Office ID', example: 'EMP001' })
  @ApiResponse({
    status: 200,
    description: 'Member found by PIN',
  })
  @ApiResponse({ status: 404, description: 'Member with this PIN not found' })
  findByPin(@Param('pin') pin: string) {
    return this.membersService.findByPin(pin);
  }

  @Post('verify-pin')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Verify if a PIN exists and return member info' })
  @ApiResponse({
    status: 200,
    description: 'PIN verified, member found',
  })
  @ApiResponse({ status: 404, description: 'PIN not found' })
  verifyPin(@Body() verifyPinDto: VerifyPinDto) {
    return this.membersService.findByPin(verifyPinDto.pin);
  }
}
