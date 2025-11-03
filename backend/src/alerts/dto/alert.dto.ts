import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsEnum, IsInt, IsOptional, IsString } from 'class-validator';

export enum AlertType {
  TREASURY_LOW = 'treasury_low',
  MEMBER_LOW_BALANCE = 'member_low_balance',
  FINE_APPLIED = 'fine_applied',
  CONSECUTIVE_ABSENCE = 'consecutive_absence',
}

export class CreateAlertDto {
  @ApiProperty({
    description: 'Type of alert',
    enum: AlertType,
    example: AlertType.MEMBER_LOW_BALANCE,
  })
  @IsEnum(AlertType)
  alert_type: AlertType;

  @ApiPropertyOptional({
    description: 'Member ID associated with the alert (if applicable)',
    example: 3,
    required: false,
  })
  @IsOptional()
  @IsInt()
  member_id?: number;

  @ApiProperty({
    description: 'Alert message describing the issue',
    example: 'Member balance (200 BDT) below threshold (250 BDT)',
  })
  @IsString()
  message: string;
}

export class ResolveAlertDto {
  @ApiPropertyOptional({
    description: 'Optional notes about how the alert was resolved',
    example: 'Member added 500 BDT contribution, balance now sufficient',
    required: false,
  })
  @IsOptional()
  @IsString()
  notes?: string;
}
