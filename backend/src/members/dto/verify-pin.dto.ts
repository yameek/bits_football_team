import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, MaxLength } from 'class-validator';

export class VerifyPinDto {
  @ApiProperty({
    description: 'Member PIN/Office ID to verify',
    example: 'EMP001',
    minLength: 1,
    maxLength: 10,
    required: true,
  })
  @IsString()
  @IsNotEmpty()
  @MaxLength(10)
  pin: string;
}
