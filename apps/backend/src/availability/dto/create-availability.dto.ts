import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsBoolean, IsDateString, IsOptional, IsString } from 'class-validator';

export class CreateAvailabilityDto {
  @ApiProperty({ example: '2024-07-24' })
  @IsDateString()
  date: string;

  @ApiProperty({ example: '2024-07-24T08:30:00.000Z' })
  @IsDateString()
  startTime: string;

  @ApiProperty({ example: '2024-07-24T11:00:00.000Z' })
  @IsDateString()
  endTime: string;

  @ApiPropertyOptional({ default: false })
  @IsOptional()
  @IsBoolean()
  repeatSession?: boolean;

  @ApiPropertyOptional()
  @IsOptional()
  @IsDateString()
  repeatUntilDate?: string;

  @ApiProperty()
  @IsString()
  sessionName: string;
}
