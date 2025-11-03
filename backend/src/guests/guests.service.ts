import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Guest } from '../entities/guest.entity';
import { Member } from '../entities/member.entity';
import { Session, SessionStatus } from '../entities/session.entity';
import { CreateGuestDto, ConvertGuestDto } from './dto/guest.dto';

@Injectable()
export class GuestsService {
  constructor(
    @InjectRepository(Guest)
    private readonly guestRepository: Repository<Guest>,
    @InjectRepository(Member)
    private readonly memberRepository: Repository<Member>,
    @InjectRepository(Session)
    private readonly sessionRepository: Repository<Session>,
  ) {}

  /**
   * Add a guest to a session
   */
  async create(sessionId: number, createGuestDto: CreateGuestDto): Promise<Guest> {
    // Verify session exists
    const session = await this.sessionRepository.findOne({ where: { id: sessionId } });
    if (!session) {
      throw new NotFoundException(`Session with ID ${sessionId} not found`);
    }

    // Verify session is not finalized
    if (session.status === SessionStatus.COMPLETED) {
      throw new BadRequestException('Cannot add guest to finalized session');
    }

    // Verify member who brought guest exists
    const broughtByMember = await this.memberRepository.findOne({
      where: { id: createGuestDto.broughtByMemberId }
    });
    if (!broughtByMember) {
      throw new NotFoundException(
        `Member with ID ${createGuestDto.broughtByMemberId} not found`
      );
    }

    // If paidByMemberId provided, verify it exists
    if (createGuestDto.paidByMemberId) {
      const paidByMember = await this.memberRepository.findOne({
        where: { id: createGuestDto.paidByMemberId }
      });
      if (!paidByMember) {
        throw new NotFoundException(
          `Member with ID ${createGuestDto.paidByMemberId} not found`
        );
      }
    }

    const guest = this.guestRepository.create({
      name: createGuestDto.name,
      contact_number: createGuestDto.contactNumber,
      session_id: sessionId,
      brought_by_member_id: createGuestDto.broughtByMemberId,
      paid_by_member_id: createGuestDto.paidByMemberId || createGuestDto.broughtByMemberId,
      amount_paid: createGuestDto.amountPaid,
      converted_to_member: false,
    });

    return this.guestRepository.save(guest);
  }

  /**
   * Get all guests for a session
   */
  async findBySession(sessionId: number): Promise<Guest[]> {
    return this.guestRepository.find({
      where: { session_id: sessionId },
      relations: ['brought_by', 'paid_by', 'converted_member'],
      order: { created_at: 'ASC' },
    });
  }

  /**
   * Get a single guest by ID
   */
  async findOne(id: number): Promise<Guest> {
    const guest = await this.guestRepository.findOne({
      where: { id },
      relations: ['session', 'session.field', 'brought_by', 'paid_by', 'converted_member'],
    });

    if (!guest) {
      throw new NotFoundException(`Guest with ID ${id} not found`);
    }

    return guest;
  }

  /**
   * Convert a guest to a member
   */
  async convertToMember(id: number, convertGuestDto: ConvertGuestDto): Promise<{
    guest: Guest;
    member: Member;
  }> {
    const guest = await this.findOne(id);

    // Check if already converted
    if (guest.converted_to_member) {
      throw new BadRequestException('Guest has already been converted to member');
    }

    // Create new member with guest's information
    const member = this.memberRepository.create({
      name: guest.name,
      contact_number: guest.contact_number,
      pin: convertGuestDto.pin,
      balance: guest.amount_paid, // Credit the amount they paid as a guest
      consecutive_absences: 0,
      status: convertGuestDto.status || 'active',
    });

    const savedMember = await this.memberRepository.save(member);

    // Update guest record
    guest.converted_to_member = true;
    guest.converted_member_id = savedMember.id;
    const updatedGuest = await this.guestRepository.save(guest);

    return {
      guest: updatedGuest,
      member: savedMember,
    };
  }

  /**
   * Delete a guest
   */
  async remove(id: number): Promise<void> {
    const guest = await this.findOne(id);

    if (guest.converted_to_member) {
      throw new BadRequestException('Cannot delete guest that has been converted to member');
    }

    await this.guestRepository.remove(guest);
  }

  /**
   * Get guest statistics
   */
  async getStats(): Promise<{
    total: number;
    converted: number;
    unconverted: number;
  }> {
    const guests = await this.guestRepository.find();

    return {
      total: guests.length,
      converted: guests.filter(g => g.converted_to_member).length,
      unconverted: guests.filter(g => !g.converted_to_member).length,
    };
  }
}
