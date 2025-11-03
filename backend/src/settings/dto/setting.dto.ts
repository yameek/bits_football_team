import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsNotEmpty, MaxLength, IsOptional } from 'class-validator';

export class CreateSettingDto {
  @ApiProperty({
    description: 'Unique setting key identifier',
    example: 'max_guests_per_session',
    minLength: 1,
    maxLength: 100,
    required: true,
  })
  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  key: string;

  @ApiProperty({
    description: 'Setting value (stored as text)',
    example: '5',
    required: true,
  })
  @IsString()
  @IsNotEmpty()
  value: string;

  @ApiPropertyOptional({
    description: 'Human-readable description of the setting',
    example: 'Maximum number of guests allowed per session',
    required: false,
  })
  @IsOptional()
  @IsString()
  description?: string;
}

export class UpdateSettingDto {
  @ApiProperty({
    description: 'New value for the setting',
    example: '6000',
    required: true,
  })
  @IsString()
  @IsNotEmpty()
  value: string;
}
