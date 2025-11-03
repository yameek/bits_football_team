import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNumber, IsEnum, IsOptional, IsString, IsNotEmpty } from 'class-validator';

export class MarkAttendanceDto {
  @ApiProperty({
    description: 'Member ID',
    example: 1,
  })
  @IsNumber()
  @IsNotEmpty()
  memberId: number;

  @ApiProperty({
    description: 'Attendance status',
    enum: ['present', 'late', 'absent'],
    example: 'present',
  })
  @IsEnum(['present', 'late', 'absent'])
  @IsNotEmpty()
  status: string;

  @ApiPropertyOptional({
    description: 'Optional notes',
    example: 'Arrived 10 minutes late',
  })
  @IsOptional()
  @IsString()
  notes?: string;
}

export class BulkAttendanceDto {
  @ApiProperty({
    description: 'Array of attendance records',
    type: [MarkAttendanceDto],
  })
  @IsNotEmpty()
  attendances: MarkAttendanceDto[];
}
