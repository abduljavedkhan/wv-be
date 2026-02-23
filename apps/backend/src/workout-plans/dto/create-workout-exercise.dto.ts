import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsOptional, IsString, Min } from 'class-validator';

export class CreateWorkoutExerciseDto {
  @ApiProperty()
  @IsString()
  exerciseName: string;

  @ApiProperty()
  @IsInt()
  @Min(1)
  sets: number;

  @ApiProperty()
  @IsInt()
  @Min(1)
  reps: number;
}
