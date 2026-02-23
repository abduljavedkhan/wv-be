import { Injectable, ForbiddenException, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateAvailabilityDto } from './dto/create-availability.dto';

@Injectable()
export class AvailabilityService {
  constructor(private readonly prisma: PrismaService) {}

  async create(userId: string, dto: CreateAvailabilityDto) {
    return this.prisma.availability.create({
      data: {
        userId,
        date: new Date(dto.date),
        startTime: new Date(dto.startTime),
        endTime: new Date(dto.endTime),
        repeatSession: dto.repeatSession ?? false,
        repeatUntilDate: dto.repeatUntilDate ? new Date(dto.repeatUntilDate) : null,
        sessionName: dto.sessionName,
      },
    });
  }

  async findAllByUser(userId: string) {
    return this.prisma.availability.findMany({
      where: { userId },
      include: { bookings: true },
      orderBy: { date: 'asc' },
    });
  }

  async findOne(id: string, userId: string) {
    const avail = await this.prisma.availability.findUnique({
      where: { id },
      include: { bookings: true },
    });
    if (!avail) throw new NotFoundException('Availability not found');
    if (avail.userId !== userId) throw new ForbiddenException();
    return avail;
  }

  async remove(id: string, userId: string) {
    await this.findOne(id, userId);
    return this.prisma.availability.delete({ where: { id } });
  }

  /** Open slots from other users (for booking as a client) */
  async findOpenSlots(dateFrom: Date, dateTo: Date, excludeUserId: string) {
    return this.prisma.availability.findMany({
      where: {
        userId: { not: excludeUserId },
        date: { gte: dateFrom, lte: dateTo },
      },
      include: { createdBy: { select: { id: true, name: true, email: true } } },
      orderBy: [{ date: 'asc' }, { startTime: 'asc' }],
    });
  }
}
