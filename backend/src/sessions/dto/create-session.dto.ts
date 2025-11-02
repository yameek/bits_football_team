import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsEnum, IsNumber, IsOptional, IsDateString, Min, MaxLength } from 'class-validator';

export class CreateSessionDto {
  @ApiProperty({
    description: 'Field ID where session will take place',
    example: 1,
  })
  @IsNumber()
  @IsNotEmpty()
  fieldId: number;

  @ApiPropertyOptional({
    description: 'Optional session name',
    example: 'Weekend Practice',
    maxLength: 255,
  })
  @IsOptional()
  @IsString()
  @MaxLength(255)
  name?: string;

  @ApiProperty({
    description: 'Session start date and time',
    example: '2025-11-10T14:00:00Z',
  })
  @IsDateString()
  @IsNotEmpty()
  scheduledStart: string;

  @ApiPropertyOptional({
    description: 'Session end date and time',
    example: '2025-11-10T16:00:00Z',
  })
  @IsOptional()
  @IsDateString()
  scheduledEnd?: string;

  @ApiProperty({
    description: 'Session type',
    enum: ['practice', 'match'],
    example: 'practice',
  })
  @IsEnum(['practice', 'match'])
  @IsNotEmpty()
  sessionType: string;

  @ApiPropertyOptional({
    description: 'Field rental cost',
    example: 100.00,
    minimum: 0,
    default: 0,
  })
  @IsOptional()
  @IsNumber()
  @Min(0)
  fieldCost?: number;

  @ApiPropertyOptional({
    description: 'Transportation cost',
    example: 50.00,
    minimum: 0,
    default: 0,
  })
  @IsOptional()
  @IsNumber()
  @Min(0)
  transportCost?: number;

  @ApiPropertyOptional({
    description: 'Drinks and refreshments cost',
    example: 30.00,
    minimum: 0,
    default: 0,
  })
  @IsOptional()
  @IsNumber()
  @Min(0)
  drinksCost?: number;

  @ApiPropertyOptional({
    description: 'Emergency fund allocation',
    example: 10.00,
    minimum: 0,
    default: 0,
  })
  @IsOptional()
  @IsNumber()
  @Min(0)
  emergencyFund?: number;

  @ApiPropertyOptional({
    description: 'Other miscellaneous costs',
    example: 5.00,
    minimum: 0,
    default: 0,
  })
  @IsOptional()
  @IsNumber()
  @Min(0)
  otherCosts?: number;

  @ApiPropertyOptional({
    description: 'Session notes',
    example: 'Bring water bottles',
  })
  @IsOptional()
  @IsString()
  notes?: string;
}
