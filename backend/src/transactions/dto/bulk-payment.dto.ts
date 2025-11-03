import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsEnum, IsNumber, IsOptional, ArrayMinSize, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

export enum SplitType {
  EQUAL = 'equal',
  CUSTOM = 'custom',
}

export class CustomAmountDto {
  @ApiProperty({
    description: 'Member ID',
    example: 1,
  })
  @IsNumber()
  memberId: number;

  @ApiProperty({
    description: 'Custom amount for this member',
    example: 150.50,
  })
  @IsNumber()
  amount: number;
}

export class BulkPaymentDto {
  @ApiProperty({
    description: 'Array of member IDs to include in bulk payment',
    example: [1, 2, 3, 4],
    type: [Number],
  })
  @IsArray()
  @ArrayMinSize(2, { message: 'Bulk payment must include at least 2 members' })
  @IsNumber({}, { each: true })
  memberIds: number[];

  @ApiProperty({
    description: 'Total amount to split among members',
    example: 500,
  })
  @IsNumber()
  amount: number;

  @ApiProperty({
    description: 'How to split the payment: equal or custom',
    enum: SplitType,
    example: SplitType.EQUAL,
  })
  @IsEnum(SplitType)
  splitType: SplitType;

  @ApiProperty({
    description: 'Custom amounts for each member (only for splitType: custom). Total must equal amount.',
    type: [CustomAmountDto],
    required: false,
    example: [
      { memberId: 1, amount: 150 },
      { memberId: 2, amount: 200 },
      { memberId: 3, amount: 150 },
    ],
  })
  @IsOptional()
  @IsArray()
  customAmounts?: CustomAmountDto[];

  @ApiProperty({
    description: 'Optional notes for this bulk payment',
    example: 'Equipment purchase',
    required: false,
  })
  @IsOptional()
  notes?: string;
}
