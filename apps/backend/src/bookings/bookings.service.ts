import { Injectable, ForbiddenException, NotFoundException, ConflictException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateBookingDto } from './dto/create-booking.dto';

@Injectable()
export class BookingsService {
  constructor(private readonly prisma: PrismaService) {}

  async create(userId: string, dto: CreateBookingDto) {
    const availability = await this.prisma.availability.findUnique({
      where: { id: dto.availabilityId },
      include: { bookings: true },
    });
    if (!availability) throw new NotFoundException('Availability not found');
    // Optional: check slot not already booked for same time
    const overlapping = await this.prisma.bookedSlot.findFirst({
      where: {
        availabilityId: dto.availabilityId,
        selectedDate: new Date(dto.selectedDate),
        OR: [
          {
            startTime: { lt: new Date(dto.endTime) },
            endTime: { gt: new Date(dto.startTime) },
          },
        ],
      },
    });
    if (overlapping) throw new ConflictException('Slot already booked for this time');
    return this.prisma.bookedSlot.create({
      data: {
        availabilityId: dto.availabilityId,
        userId,
        selectedDate: new Date(dto.selectedDate),
        startTime: new Date(dto.startTime),
        endTime: new Date(dto.endTime),
      },
      include: { availability: true },
    });
  }

  async findMyBookings(userId: string) {
    return this.prisma.bookedSlot.findMany({
      where: { userId },
      include: { availability: true },
      orderBy: { selectedDate: 'asc' },
    });
  }

  async findOne(id: string, userId: string) {
    const booking = await this.prisma.bookedSlot.findUnique({
      where: { id },
      include: { availability: true, user: true },
    });
    if (!booking) throw new NotFoundException('Booking not found');
    if (booking.userId !== userId) throw new ForbiddenException();
    return booking;
  }

  async remove(id: string, userId: string) {
    await this.findOne(id, userId);
    return this.prisma.bookedSlot.delete({ where: { id } });
  }
}
