import { Controller, Get, Post, Delete, Body, Param, Query, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { User } from '@prisma/client';
import { AvailabilityService } from './availability.service';
import { CreateAvailabilityDto } from './dto/create-availability.dto';

@ApiTags('availability')
@Controller('availability')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class AvailabilityController {
  constructor(private readonly service: AvailabilityService) {}

  @Post()
  create(@CurrentUser() user: User, @Body() dto: CreateAvailabilityDto) {
    return this.service.create(user.id, dto);
  }

  @Get('open')
  findOpenSlots(
    @CurrentUser() user: User,
    @Query('from') from: string,
    @Query('to') to: string,
  ) {
    const dateFrom = from ? new Date(from) : new Date();
    const dateTo = to ? new Date(to) : new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);
    return this.service.findOpenSlots(dateFrom, dateTo, user.id);
  }

  @Get()
  findAll(@CurrentUser() user: User) {
    return this.service.findAllByUser(user.id);
  }

  @Get(':id')
  findOne(@CurrentUser() user: User, @Param('id') id: string) {
    return this.service.findOne(id, user.id);
  }

  @Delete(':id')
  remove(@CurrentUser() user: User, @Param('id') id: string) {
    return this.service.remove(id, user.id);
  }
}
