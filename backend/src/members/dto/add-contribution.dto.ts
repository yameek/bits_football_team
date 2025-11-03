import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNumber, IsEnum, IsOptional, IsString, Min, MaxLength } from 'class-validator';

export class AddContributionDto {
  @ApiProperty({
    description: 'Contribution amount',
    example: 50.00,
    minimum: 0.01,
  })
  @IsNumber()
  @Min(0.01)
  amount: number;

  @ApiProperty({
    description: 'Payment method',
    enum: ['cash', 'bank', 'mobile'],
    example: 'cash',
  })
  @IsEnum(['cash', 'bank', 'mobile'])
  method: string;

  @ApiPropertyOptional({
    description: 'Category ID for this contribution',
    example: 1,
  })
  @IsOptional()
  @IsNumber()
  categoryId?: number;

  @ApiPropertyOptional({
    description: 'Payment reference number',
    example: 'TXN123456',
    maxLength: 100,
  })
  @IsOptional()
  @IsString()
  @MaxLength(100)
  reference?: string;

  @ApiPropertyOptional({
    description: 'Additional notes',
    example: 'Monthly contribution for November',
  })
  @IsOptional()
  @IsString()
  notes?: string;
}
