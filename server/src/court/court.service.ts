import { Injectable } from '@nestjs/common';
import { BadGatewayException } from '@nestjs/common/exceptions';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateCourtDto } from './dto/create-court.dto';
import { ScheduleService } from 'src/schedule/schedule.service';
import { UpdateCourtDto } from './dto/update-court.dto';

@Injectable()
export class CourtService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly scheduleService: ScheduleService,
  ) {}

  async findCourtsData() {
    try {
      const courts = await this.prisma.court.findMany({
        select: {
          id: true,
          name: true,
          description: true,
          imageUrl: true,
          location: {
            select: {
              name: true,
              description: true,
            },
          },
          schedule: {
            select: {
              timeBlocks: {
                select: {
                  dayOfWeek: true,
                  capacity: true,
                  isEnabled: true,
                  startTime: true,
                  endTime: true,
                },
                orderBy: [{ dayOfWeek: 'asc' }, { startTime: 'asc' }],
              },
            },
          },
        },
      });

      if (!courts || courts.length === 0) {
        throw new BadGatewayException('No courts found');
      }

      return courts;
    } catch (e) {
      console.log(e);
      throw new BadGatewayException('Error fetching courts');
    }
  }

  async findCardsInfo() {
    try {
      const courts = await this.prisma.court.findMany({
        select: {
          id: true,
          name: true,
          description: true,
          imageUrl: true,
          location: {
            select: {
              id: true,
              name: true,
              description: true,
            },
          },
          schedule: {
            select: {
              timeBlocks: {
                select: {
                  dayOfWeek: true,
                  startTime: true,
                  endTime: true,
                },
                orderBy: [{ dayOfWeek: 'asc' }, { startTime: 'asc' }],
              },
            },
          },
        },
      });

      if (!courts || courts.length === 0) {
        throw new BadGatewayException('No courts found');
      }

      const courtsWithSchedules = courts.map((court) => {
        const scheduleByDay = court.schedule?.timeBlocks
          ? this.groupTimeBlocks(
              court.schedule.timeBlocks.map((block) => ({
                ...block,
                startTime: new Date(block.startTime),
                endTime: new Date(block.endTime),
              })),
            )
          : [];

        return {
          id: court.id,
          name: court.name,
          description: court.description,
          location: court.location,
          scheduleByDay,
        };
      });

      return courtsWithSchedules;
    } catch (e) {
      console.log(e);
      throw new BadGatewayException('Error fetching courts');
    }
  }

  async findOneById(id: string) {
    try {
      return await this.findCourtWithDetails({ id });
    } catch (e) {
      this.handleError(e, 'Error fetching court');
    }
  }

  async findOneByName(name: string) {
    try {
      return await this.findCourtWithDetails({ name });
    } catch (e) {
      this.handleError(e, 'Error fetching court');
    }
  }

  async create(courtData: CreateCourtDto, userId: string) {
    try {
      const court = await this.prisma.$transaction(async (tx) => {
        const schedule = await this.scheduleService.createSchedule(
          courtData.schedule,
        );

        const newCourt = await tx.court.create({
          data: {
            name: courtData.name,
            description: courtData.description,
            locationId: courtData.locationId,
            createdBy: userId,
            imageUrl: null,
            scheduleId: schedule.id,
          },
          include: {
            location: true,
            schedule: {
              include: {
                timeBlocks: true,
              },
            },
          },
        });

        return newCourt;
      });

      return court;
    } catch (e) {
      this.handleError(e, 'Error creating court');
    }
  }

  async updateImage(courtId: string, imageUrl: string) {
    try {
      return await this.prisma.court.update({
        where: { id: courtId },
        data: { imageUrl },
      });
    } catch (e) {
      this.handleError(e, 'Error updating court image');
    }
  }

  async update(id: string, updateData: UpdateCourtDto) {
    try {
      const court = await this.prisma.$transaction(async (tx) => {
        const existingCourt = await tx.court.findUnique({
          where: { id },
          include: { schedule: true },
        });

        if (!existingCourt) {
          throw new BadGatewayException('Court not found');
        }

        const updatedCourt = await tx.court.update({
          where: { id },
          data: {
            name: updateData.name,
            description: updateData.description,
            locationId: updateData.locationId,
          },
          include: {
            location: true,
            schedule: {
              include: {
                timeBlocks: true,
              },
            },
          },
        });

        if (updateData.schedule) {
          await this.scheduleService.updateScheduleTimeBlocks(
            existingCourt.scheduleId,
            updateData.schedule,
          );
        }

        return updatedCourt;
      });

      return court;
    } catch (e) {
      this.handleError(e, 'Error updating court');
    }
  }

  async getCourtScheduleForBooking(courtId: string, userId: string) {
    try {
      const court = await this.prisma.court.findUnique({
        where: { id: courtId },
        include: {
          schedule: {
            include: {
              timeBlocks: {
                include: {
                  ScheduledBooking: {
                    select: {
                      id: true,
                      userId: true,
                    },
                  },
                },
              },
            },
          },
        },
      });

      if (!court) {
        throw new BadGatewayException('Court not found');
      }

      const timeBlocks = court.schedule.timeBlocks.map((block) => ({
        id: block.id,
        dayOfWeek: block.dayOfWeek,
        startTime: block.startTime,
        endTime: block.endTime,
        capacity: block.capacity,
        isEnabled: block.isEnabled,
        currentBookings: block.ScheduledBooking.length,
        isUserBooked: block.ScheduledBooking.some(
          (booking) => booking.userId === userId,
        ),
      }));

      return {
        courtName: court.name,
        timeBlocks,
      };
    } catch (e) {
      this.handleError(e, 'Error fetching court schedule');
    }
  }

  async getCourtBookings(
    courtId: string,
    filters?: {
      dayOfWeek?: number;
      timeBlockId?: string;
      startDate?: Date;
      endDate?: Date;
    },
  ) {
    try {
      const court = await this.prisma.court.findUnique({
        where: { id: courtId },
        select: { scheduleId: true, name: true },
      });
      if (!court) throw new BadGatewayException('Court not found');

      const whereClause = {
        scheduleTimeBlock: {
          scheduleId: court.scheduleId,
          ...(filters?.dayOfWeek !== undefined && {
            dayOfWeek: filters.dayOfWeek,
          }),
        },
        ...(filters?.timeBlockId && {
          scheduleTimeBlockId: filters.timeBlockId,
        }),
        ...(filters?.startDate || filters?.endDate
          ? {
              bookingDate: {
                ...(filters.startDate && { gte: filters.startDate }),
                ...(filters.endDate && { lte: filters.endDate }),
              },
            }
          : {}),
      };

      const bookings = await this.prisma.scheduledBooking.findMany({
        where: whereClause,
        include: {
          user: { select: { fullName: true, email: true } },
          scheduleTimeBlock: {
            select: { startTime: true, endTime: true, dayOfWeek: true },
          },
        },
        orderBy: [
          { scheduleTimeBlock: { dayOfWeek: 'asc' } },
          { scheduleTimeBlock: { startTime: 'asc' } },
          { bookingDate: 'desc' },
        ],
      });

      return {
        courtName: court.name,
        data: bookings,
        total: bookings.length,
      };
    } catch (e) {
      this.handleError(e, 'Error fetching court bookings');
    }
  }

  async cancelUserBooking(courtId: string, bookingId: string) {
    try {
      const booking = await this.prisma.scheduledBooking.findUnique({
        where: { id: bookingId },
        include: {
          scheduleTimeBlock: { select: { scheduleId: true } },
        },
      });
      if (
        !booking ||
        !booking.scheduleTimeBlock ||
        !booking.scheduleTimeBlock.scheduleId
      ) {
        throw new BadGatewayException('Booking not found');
      }
      const court = await this.prisma.court.findUnique({
        where: { id: courtId },
        select: { scheduleId: true },
      });
      if (!court || booking.scheduleTimeBlock.scheduleId !== court.scheduleId) {
        throw new BadGatewayException('Booking does not belong to this court');
      }
      await this.prisma.scheduledBooking.delete({ where: { id: bookingId } });
      return { message: 'Booking cancelled successfully' };
    } catch (e) {
      this.handleError(e, 'Error cancelling booking');
    }
  }

  async cancelUserBookingByTimeBlock(
    courtId: string,
    timeBlockId: string,
    userId: string,
  ) {
    try {
      const court = await this.prisma.court.findUnique({
        where: { id: courtId },
        select: { scheduleId: true },
      });
      if (!court) throw new BadGatewayException('Court not found');
      const booking = await this.prisma.scheduledBooking.findFirst({
        where: {
          userId,
          scheduleTimeBlockId: timeBlockId,
          scheduleTimeBlock: { scheduleId: court.scheduleId },
        },
      });
      if (!booking) {
        throw new BadGatewayException('Booking not found for this user');
      }
      await this.prisma.scheduledBooking.delete({ where: { id: booking.id } });
      return { message: 'Booking cancelled successfully' };
    } catch (e) {
      this.handleError(e, 'Error cancelling user booking');
    }
  }

  async resetCourtBookings(
    courtId: string,
    options?: {
      dayOfWeek?: number;
      timeBlockId?: string;
      reason?: string;
    },
  ) {
    try {
      const court = await this.prisma.court.findUnique({
        where: { id: courtId },
        select: { scheduleId: true, name: true },
      });
      if (!court) throw new BadGatewayException('Court not found');

      const whereClause = {
        scheduleTimeBlock: {
          scheduleId: court.scheduleId,
          ...(options?.dayOfWeek !== undefined && {
            dayOfWeek: options.dayOfWeek,
          }),
        },
        ...(options?.timeBlockId && {
          scheduleTimeBlockId: options.timeBlockId,
        }),
      };

      const result = await this.prisma.scheduledBooking.deleteMany({
        where: whereClause,
      });

      return {
        deletedCount: result.count,
        message: `${result.count} bookings deleted successfully`,
      };
    } catch (e) {
      this.handleError(e, 'Error resetting court bookings');
    }
  }

  async createMultipleBookings(
    bookings: Array<{ scheduleTimeBlockId: string; bookingDate: string }>,
    userId: string,
  ) {
    try {
      const createdBookings = await this.prisma.$transaction(
        bookings.map((booking) =>
          this.prisma.scheduledBooking.create({
            data: {
              scheduleTimeBlockId: booking.scheduleTimeBlockId,
              userId,
              bookingDate: new Date(booking.bookingDate),
            },
          }),
        ),
      );

      return {
        message: 'Bookings created successfully',
        bookings: createdBookings,
      };
    } catch (e) {
      this.handleError(e, 'Error creating multiple bookings');
    }
  }

  async deleteCourt(id: string): Promise<{ message: string }> {
    try {
      const court = await this.prisma.court.findUnique({
        where: { id },
        select: { id: true, scheduleId: true },
      });

      if (!court) {
        throw new BadGatewayException('Court not found');
      }

      await this.prisma.$transaction(async (prisma) => {
        await prisma.court.delete({
          where: { id: court.id },
        });

        await prisma.schedule.delete({
          where: { id: court.scheduleId },
        });
      });

      return { message: 'Court deleted successfully' };
    } catch (error) {
      console.error(`Error deleting court with ID ${id}:`, error);
      this.handleError(error, 'Error deleting court');
      return { message: 'Error deleting court' }; // Return explícito en caso de error
    }
  }

  private async findCourtWithDetails(where: { id?: string; name?: string }) {
    if ((!where.id && !where.name) || (where.id && where.name)) {
      throw new BadGatewayException(
        'Must provide either id or name (exclusively)',
      );
    }
    const uniqueWhere = where.id ? { id: where.id } : { name: where.name };
    const court = await this.prisma.court.findUnique({
      where: uniqueWhere,
      include: {
        location: true,
        schedule: {
          include: {
            timeBlocks: {
              orderBy: [{ dayOfWeek: 'asc' }, { startTime: 'asc' }],
            },
          },
        },
      },
    });
    if (!court) {
      throw new BadGatewayException('Court not found');
    }
    return court;
  }

  private handleError(error: any, message: string) {
    console.error(`${message}:`, error);
    if (error instanceof BadGatewayException) {
      throw error;
    }
    throw new BadGatewayException(message);
  }

  private readonly daysMap: Record<number, string> = {
    1: 'Lunes',
    2: 'Martes',
    3: 'Miercoles',
    4: 'Jueves',
    5: 'Viernes',
    6: 'Sabado',
    7: 'Domingo',
  };

  private groupTimeBlocks(
    timeBlocks: { dayOfWeek: number; startTime: Date; endTime: Date }[],
  ): Record<string, string[]> {
    const result: Record<string, string[]> = {};

    if (!timeBlocks || timeBlocks.length === 0) {
      return result;
    }

    let currentDayKey: string | null = null;
    let mergeInProgress: { start: Date; end: Date } | null = null;

    for (const block of timeBlocks) {
      const dayName = this.daysMap[block.dayOfWeek];
      if (!result[dayName]) {
        result[dayName] = [];
      }

      if (dayName !== currentDayKey) {
        if (mergeInProgress) {
          const formattedTime = `${this.formatTime(
            mergeInProgress.start,
          )} - ${this.formatTime(mergeInProgress.end)}`;
          result[currentDayKey!].push(formattedTime);
        }

        currentDayKey = dayName;
        mergeInProgress = { start: block.startTime, end: block.endTime };
      } else {
        if (block.startTime.getTime() <= mergeInProgress!.end.getTime()) {
          if (block.endTime.getTime() > mergeInProgress!.end.getTime()) {
            mergeInProgress!.end = block.endTime;
          }
        } else {
          const formattedTime = `${this.formatTime(
            mergeInProgress!.start,
          )} - ${this.formatTime(mergeInProgress!.end)}`;
          result[currentDayKey].push(formattedTime);
          mergeInProgress = { start: block.startTime, end: block.endTime };
        }
      }
    }

    if (mergeInProgress) {
      const formattedTime = `${this.formatTime(
        mergeInProgress.start,
      )} - ${this.formatTime(mergeInProgress.end)}`;
      if (result[currentDayKey!]) {
        result[currentDayKey!].push(formattedTime);
      }
    }

    return result;
  }

  private formatTime(date: Date): string {
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');
    return `${hours}:${minutes}`;
  }
}
