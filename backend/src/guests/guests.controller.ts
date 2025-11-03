import { Controller, Get, Post, Body, Param, Delete, ParseIntPipe } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam, ApiBody } from '@nestjs/swagger';
import { GuestsService } from './guests.service';
import { CreateGuestDto, ConvertGuestDto } from './dto/guest.dto';

@ApiTags('Guests')
@Controller('guests')
export class GuestsController {
  constructor(private readonly guestsService: GuestsService) {}

  @Post('sessions/:sessionId')
  @ApiOperation({
    summary: 'Add a guest to a session',
    description: 'Register a non-member guest who attended or will attend a session. The guest pays a fee which is recorded.'
  })
  @ApiParam({
    name: 'sessionId',
    type: 'number',
    description: 'ID of the session to add guest to',
    example: 1
  })
  @ApiBody({
    type: CreateGuestDto,
    examples: {
      example1: {
        summary: 'Guest brought by member',
        value: {
          name: 'Ahmed Hassan',
          contactNumber: '+249912345678',
          broughtByMemberId: 5,
          paidByMemberId: 5,
          amountPaid: 200
        }
      },
      example2: {
        summary: 'Guest who paid for themselves',
        value: {
          name: 'Mohammed Ali',
          contactNumber: '+249923456789',
          broughtByMemberId: 3,
          paidByMemberId: null,
          amountPaid: 250
        }
      }
    }
  })
  @ApiResponse({
    status: 201,
    description: 'Guest successfully added to session',
    schema: {
      example: {
        id: 1,
        name: 'Ahmed Hassan',
        contact_number: '+249912345678',
        amount_paid: 200,
        status: 'pending',
        created_at: '2024-01-15T10:30:00Z',
        session: { id: 1 },
        broughtByMember: { id: 5, name: 'Ali Mohammed' },
        paidByMember: { id: 5, name: 'Ali Mohammed' }
      }
    }
  })
  @ApiResponse({ status: 400, description: 'Cannot add guest to finalized session' })
  @ApiResponse({ status: 404, description: 'Session or member not found' })
  create(
    @Param('sessionId', ParseIntPipe) sessionId: number,
    @Body() createGuestDto: CreateGuestDto
  ) {
    return this.guestsService.create(sessionId, createGuestDto);
  }

  @Get('sessions/:sessionId')
  @ApiOperation({
    summary: 'Get all guests for a session',
    description: 'Retrieve all guests who attended a specific session with their payment details and who brought them.'
  })
  @ApiParam({
    name: 'sessionId',
    type: 'number',
    description: 'ID of the session',
    example: 1
  })
  @ApiResponse({
    status: 200,
    description: 'List of guests for the session',
    schema: {
      example: [
        {
          id: 1,
          name: 'Ahmed Hassan',
          contact_number: '+249912345678',
          amount_paid: 200,
          status: 'pending',
          created_at: '2024-01-15T10:30:00Z',
          broughtByMember: { id: 5, name: 'Ali Mohammed' }
        },
        {
          id: 2,
          name: 'Mohammed Ali',
          contact_number: '+249923456789',
          amount_paid: 250,
          status: 'converted',
          created_at: '2024-01-15T11:00:00Z',
          broughtByMember: { id: 3, name: 'Omar Salah' }
        }
      ]
    }
  })
  @ApiResponse({ status: 404, description: 'Session not found' })
  findBySession(@Param('sessionId', ParseIntPipe) sessionId: number) {
    return this.guestsService.findBySession(sessionId);
  }

  @Get(':id')
  @ApiOperation({
    summary: 'Get guest details',
    description: 'Retrieve detailed information about a specific guest including their session and payment info.'
  })
  @ApiParam({
    name: 'id',
    type: 'number',
    description: 'Guest ID',
    example: 1
  })
  @ApiResponse({
    status: 200,
    description: 'Guest details',
    schema: {
      example: {
        id: 1,
        name: 'Ahmed Hassan',
        contact_number: '+249912345678',
        amount_paid: 200,
        status: 'pending',
        created_at: '2024-01-15T10:30:00Z',
        session: {
          id: 1,
          date: '2024-01-15',
          status: 'completed',
          field: { id: 1, name: 'Green Park Stadium' }
        },
        broughtByMember: { id: 5, name: 'Ali Mohammed', phone: '+249911111111' },
        paidByMember: { id: 5, name: 'Ali Mohammed' }
      }
    }
  })
  @ApiResponse({ status: 404, description: 'Guest not found' })
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.guestsService.findOne(id);
  }

  @Post(':id/convert')
  @ApiOperation({
    summary: 'Convert guest to member',
    description: 'Convert a guest to a full member. Requires member PIN verification. The guest\'s paid amount is credited to their new member account balance.'
  })
  @ApiParam({
    name: 'id',
    type: 'number',
    description: 'Guest ID to convert',
    example: 1
  })
  @ApiBody({
    type: ConvertGuestDto,
    examples: {
      example1: {
        summary: 'Convert with active status',
        value: {
          pin: '1234',
          status: 'active'
        }
      }
    }
  })
  @ApiResponse({
    status: 200,
    description: 'Guest successfully converted to member',
    schema: {
      example: {
        id: 12,
        name: 'Ahmed Hassan',
        phone: '+249912345678',
        category: { id: 1, name: 'Regular' },
        status: 'active',
        balance: 200,
        consecutive_absences: 0,
        created_at: '2024-01-15T12:00:00Z'
      }
    }
  })
  @ApiResponse({ status: 400, description: 'Guest already converted or invalid PIN' })
  @ApiResponse({ status: 404, description: 'Guest not found' })
  convertToMember(
    @Param('id', ParseIntPipe) id: number,
    @Body() convertGuestDto: ConvertGuestDto
  ) {
    return this.guestsService.convertToMember(id, convertGuestDto);
  }

  @Delete(':id')
  @ApiOperation({
    summary: 'Delete a guest record',
    description: 'Remove a guest from the system. Only allowed for pending guests who have not been converted.'
  })
  @ApiParam({
    name: 'id',
    type: 'number',
    description: 'Guest ID to delete',
    example: 1
  })
  @ApiResponse({ status: 200, description: 'Guest successfully deleted' })
  @ApiResponse({ status: 400, description: 'Cannot delete converted guest' })
  @ApiResponse({ status: 404, description: 'Guest not found' })
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.guestsService.remove(id);
  }

  @Get('stats/summary')
  @ApiOperation({
    summary: 'Get guest statistics',
    description: 'Retrieve statistics about guests including total count, pending/converted breakdown, and total revenue from guest fees.'
  })
  @ApiResponse({
    status: 200,
    description: 'Guest statistics',
    schema: {
      example: {
        total: 15,
        pending: 8,
        converted: 7,
        totalRevenue: 3250
      }
    }
  })
  getStats() {
    return this.guestsService.getStats();
  }
}
