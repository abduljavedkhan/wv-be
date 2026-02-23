import { ApiProperty } from '@nestjs/swagger';
import { IsDateString, IsUUID } from 'class-validator';

export class CreateBookingDto {
  @ApiProperty()
  @IsUUID()
  availabilityId: string;

  @ApiProperty({ example: '2025-02-15' })
  @IsDateString()
  selectedDate: string;

  @ApiProperty({ example: '2025-02-15T10:00:00.000Z' })
  @IsDateString()
  startTime: string;

  @ApiProperty({ example: '2025-02-15T13:00:00.000Z' })
  @IsDateString()
  endTime: string;
}
