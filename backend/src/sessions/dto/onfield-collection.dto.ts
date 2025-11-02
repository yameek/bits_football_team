import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNumber, IsEnum, IsOptional, IsString, IsNotEmpty, Min } from 'class-validator';

export class OnFieldCollectionDto {
  @ApiPropertyOptional({
    description: 'Member ID (if payment is from a member)',
    example: 1,
  })
  @IsOptional()
  @IsNumber()
  memberId?: number;

  @ApiPropertyOptional({
    description: 'Guest name (if payment is from a guest)',
    example: 'John Doe',
  })
  @IsOptional()
  @IsString()
  guestName?: string;

  @ApiProperty({
    description: 'Payment amount',
    example: 15.00,
    minimum: 0.01,
  })
  @IsNumber()
  @IsNotEmpty()
  @Min(0.01)
  amount: number;

  @ApiProperty({
    description: 'Payment method',
    enum: ['cash', 'bank', 'mobile'],
    example: 'cash',
  })
  @IsEnum(['cash', 'bank', 'mobile'])
  @IsNotEmpty()
  method: string;

  @ApiPropertyOptional({
    description: 'Payment notes',
    example: 'Paid for guest entry',
  })
  @IsOptional()
  @IsString()
  notes?: string;
}
