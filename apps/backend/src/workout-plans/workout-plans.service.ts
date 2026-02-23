import { Injectable, ForbiddenException, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateWorkoutPlanDto } from './dto/create-workout-plan.dto';
import { UpdateWorkoutPlanDto } from './dto/update-workout-plan.dto';

@Injectable()
export class WorkoutPlansService {
  constructor(private readonly prisma: PrismaService) {}

  async create(userId: string, dto: CreateWorkoutPlanDto) {
    return this.prisma.workoutPlan.create({
      data: {
        title: dto.title,
        duration: dto.duration,
        description: dto.description ?? undefined,
        userId,
        days: {
          create: dto.days.map((day) => ({
            dayName: day.dayName,
            orderIndex: day.orderIndex,
            exercises: {
              create: day.exercises.map((ex) => ({
                exerciseName: ex.exerciseName,
                sets: ex.sets,
                reps: ex.reps,
              })),
            },
          })),
        },
      },
      include: { days: { include: { exercises: true } } },
    });
  }

  async findAllByUser(userId: string) {
    return this.prisma.workoutPlan.findMany({
      where: { userId },
      include: { days: { include: { exercises: true }, orderBy: { orderIndex: 'asc' } } },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findOne(id: string, userId: string) {
    const plan = await this.prisma.workoutPlan.findUnique({
      where: { id },
      include: { days: { include: { exercises: true }, orderBy: { orderIndex: 'asc' } } },
    });
    if (!plan) throw new NotFoundException('Workout plan not found');
    if (plan.userId !== userId) throw new ForbiddenException();
    return plan;
  }

  async update(id: string, userId: string, dto: UpdateWorkoutPlanDto) {
    await this.findOne(id, userId);
    if (dto.days) {
      await this.prisma.workoutDay.deleteMany({ where: { workoutPlanId: id } });
    }
    return this.prisma.workoutPlan.update({
      where: { id },
      data: {
        ...(dto.title != null && { title: dto.title }),
        ...(dto.duration != null && { duration: dto.duration }),
        ...(dto.description !== undefined && { description: dto.description }),
        ...(dto.days && {
          days: {
            create: dto.days.map((day) => ({
              dayName: day.dayName,
              orderIndex: day.orderIndex,
              exercises: {
                create: (day.exercises || []).map((ex) => ({
                  exerciseName: ex.exerciseName,
                  sets: ex.sets,
                  reps: ex.reps,
                })),
              },
            })),
          },
        }),
      },
      include: { days: { include: { exercises: true }, orderBy: { orderIndex: 'asc' } } },
    });
  }

  async remove(id: string, userId: string) {
    await this.findOne(id, userId);
    return this.prisma.workoutPlan.delete({ where: { id } });
  }
}
