import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsInt, IsOptional, IsString, Min, ValidateNested } from 'class-validator';
import { CreateWorkoutDayDto } from './create-workout-day.dto';

export class CreateWorkoutPlanDto {
  @ApiProperty()
  @IsString()
  title: string;

  @ApiProperty()
  @IsInt()
  @Min(1)
  duration: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({ type: [CreateWorkoutDayDto] })
  @ValidateNested({ each: true })
  @Type(() => CreateWorkoutDayDto)
  days: CreateWorkoutDayDto[];
}
