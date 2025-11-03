import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsInt, IsNumber, IsOptional, MaxLength } from 'class-validator';

export class CreateGuestDto {
  @ApiProperty({
    description: 'Full name of the guest',
    example: 'David Wilson',
    maxLength: 255,
  })
  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  name: string;

  @ApiPropertyOptional({
    description: 'Contact phone number of the guest',
    example: '+8801812345678',
    maxLength: 20,
  })
  @IsOptional()
  @IsString()
  @MaxLength(20)
  contactNumber?: string;

  @ApiProperty({
    description: 'ID of the member who brought the guest',
    example: 1,
  })
  @IsInt()
  broughtByMemberId: number;

  @ApiPropertyOptional({
    description: 'ID of the member who paid for the guest (defaults to member who brought them)',
    example: 1,
  })
  @IsOptional()
  @IsInt()
  paidByMemberId?: number;

  @ApiProperty({
    description: 'Amount paid by/for the guest',
    example: 100.00,
    default: 0,
  })
  @IsNumber()
  amountPaid: number;
}

export class ConvertGuestDto {
  @ApiPropertyOptional({
    description: 'PIN/Office ID for the new member account',
    example: 'EMP005',
    maxLength: 10,
  })
  @IsOptional()
  @IsString()
  @MaxLength(10)
  pin?: string;

  @ApiPropertyOptional({
    description: 'Initial status for the new member',
    enum: ['active', 'inactive', 'suspended'],
    default: 'active',
  })
  @IsOptional()
  @IsString()
  status?: string;
}
