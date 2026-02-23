import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsInt, IsString, Min, ValidateNested } from 'class-validator';
import { CreateWorkoutExerciseDto } from './create-workout-exercise.dto';

export class CreateWorkoutDayDto {
  @ApiProperty()
  @IsString()
  dayName: string;

  @ApiProperty()
  @IsInt()
  @Min(0)
  orderIndex: number;

  @ApiProperty({ type: [CreateWorkoutExerciseDto] })
  @ValidateNested({ each: true })
  @Type(() => CreateWorkoutExerciseDto)
  exercises: CreateWorkoutExerciseDto[];
}
