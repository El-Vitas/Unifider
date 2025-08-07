import { Injectable } from '@nestjs/common';
import { BadGatewayException } from '@nestjs/common/exceptions';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateGymDto } from './dto/create-gym.dto';
import { ScheduleService } from 'src/schedule/schedule.service';
import { UpdateGymDto } from './dto/update-gym.dto';

@Injectable()
export class GymService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly scheduleService: ScheduleService,
  ) {}

  async findGymsData() {
    try {
      const gyms = await this.prisma.gym.findMany({
        select: {
          id: true,
          name: true,
          description: true,
          equipment: true,
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

      if (!gyms || gyms.length === 0) {
        throw new BadGatewayException('No gyms found');
      }

      return gyms;
    } catch (e) {
      console.log(e);
      throw new BadGatewayException('Error fetching courts');
    }
  }

  async findOneById(id: string) {
    try {
      const gym = await this.prisma.gym.findUnique({
        where: { id },
        select: {
          id: true,
          name: true,
          description: true,
          equipment: {
            select: {
              equipment: {
                select: {
                  id: true,
                  name: true,
                  description: true,
                },
              },
            },
          },
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

      if (!gym) {
        throw new BadGatewayException('Gym not found');
      }

      return {
        ...gym,
        equipment: gym.equipment.map((data) => data.equipment),
      };
    } catch (e) {
      console.log(e);
      throw new BadGatewayException('Error fetching gym');
    }
  }

  async findOneByName(name: string) {
    try {
      const gym = await this.prisma.gym.findUnique({
        where: { name },
        select: {
          id: true,
          name: true,
          description: true,
          equipment: {
            select: {
              equipment: {
                select: {
                  id: true,
                  name: true,
                  description: true,
                },
              },
            },
          },
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

      if (!gym) {
        throw new BadGatewayException('Gym not found');
      }

      return {
        ...gym,
        equipment: gym.equipment.map((data) => data.equipment),
      };
    } catch (e) {
      console.log(e);
      throw new BadGatewayException('Error fetching gym');
    }
  }

  async create(gymData: CreateGymDto, userId: string) {
    try {
      const gym = await this.prisma.$transaction(async (tx) => {
        const schedule = await this.scheduleService.createSchedule(
          gymData.schedule,
        );

        const newGym = await tx.gym.create({
          data: {
            name: gymData.name,
            description: gymData.description,
            locationId: gymData.locationId,
            createdBy: userId,
            imageUrl: null,
            scheduleId: schedule.id,
            equipment: {
              create: gymData.equipment.map((equipmentId) => ({
                equipmentId,
                quantity: 1,
              })),
            },
          },
          include: {
            location: true,
            equipment: {
              include: {
                equipment: true,
              },
            },
            schedule: {
              include: {
                timeBlocks: true,
              },
            },
          },
        });

        return newGym;
      });

      return gym;
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : 'Unknown error';
      throw new Error(`Error creating gym: ${errorMessage}`);
    }
  }

  async updateImage(gymId: string, imageUrl: string) {
    try {
      const gym = await this.prisma.gym.update({
        where: { id: gymId },
        data: { imageUrl },
        select: {
          id: true,
          name: true,
          imageUrl: true,
        },
      });

      return gym;
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : 'Unknown error';
      throw new Error(`Error updating gym image: ${errorMessage}`);
    }
  }

  async update(gymId: string, gymData: UpdateGymDto) {
    try {
      const gym = await this.prisma.$transaction(async (tx) => {
        const currentGym = await tx.gym.findUnique({
          where: { id: gymId },
          select: { scheduleId: true },
        });

        if (!currentGym) {
          throw new Error('Gym not found');
        }

        const updateData = {
          name: gymData.name,
          description: gymData.description,
          locationId: gymData.locationId,
          ...(gymData.equipment && {
            equipment: {
              deleteMany: {},
              create: gymData.equipment.map((equipmentId) => ({
                equipmentId,
                quantity: 1,
              })),
            },
          }),
        };

        const updatedGym = await tx.gym.update({
          where: { id: gymId },
          data: updateData,
          include: {
            location: true,
            equipment: {
              include: {
                equipment: true,
              },
            },
            schedule: {
              include: {
                timeBlocks: true,
              },
            },
          },
        });

        if (gymData.schedule) {
          await this.scheduleService.updateScheduleTimeBlocks(
            currentGym.scheduleId,
            gymData.schedule,
          );
        }

        return updatedGym;
      });

      return gym;
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : 'Unknown error';
      throw new Error(`Error updating gym: ${errorMessage}`);
    }
  }

  async getGymBookings(
    gymId: string,
    filters?: {
      dayOfWeek?: number;
      timeBlockId?: string;
      startDate?: Date;
      endDate?: Date;
    },
  ) {
    try {
      const gym = await this.prisma.gym.findUnique({
        where: { id: gymId },
        select: { scheduleId: true, name: true },
      });

      if (!gym) {
        throw new Error('Gym not found');
      }

      const whereClause = {
        scheduleTimeBlock: {
          scheduleId: gym.scheduleId,
          ...(filters?.dayOfWeek !== undefined && {
            dayOfWeek: filters.dayOfWeek,
          }),
        },
        ...(filters?.timeBlockId && {
          scheduleTimeBlockId: filters.timeBlockId,
        }),
        ...(filters?.startDate || filters?.endDate
          ? {
              createdAt: {
                ...(filters.startDate && { gte: filters.startDate }),
                ...(filters.endDate && { lte: filters.endDate }),
              },
            }
          : {}),
      };

      const bookings = await this.prisma.scheduledBooking.findMany({
        where: whereClause,
        include: {
          user: {
            select: {
              id: true,
              fullName: true,
              email: true,
            },
          },
          scheduleTimeBlock: {
            select: {
              id: true,
              dayOfWeek: true,
              startTime: true,
              endTime: true,
              capacity: true,
            },
          },
        },
        orderBy: [
          { scheduleTimeBlock: { dayOfWeek: 'asc' } },
          { scheduleTimeBlock: { startTime: 'asc' } },
          { createdAt: 'desc' },
        ],
      });

      return {
        gymName: gym.name,
        data: bookings,
        total: bookings.length,
      };
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : 'Unknown error';
      throw new Error(`Error fetching gym bookings: ${errorMessage}`);
    }
  }

  async cancelUserBooking(gymId: string, bookingId: string) {
    try {
      const booking = await this.prisma.scheduledBooking.findUnique({
        where: { id: bookingId },
        include: {
          user: {
            select: { id: true, fullName: true, email: true },
          },
          scheduleTimeBlock: {
            select: {
              dayOfWeek: true,
              startTime: true,
              endTime: true,
              scheduleId: true,
            },
          },
        },
      });

      if (!booking) {
        throw new Error('Booking not found');
      }

      const gym = await this.prisma.gym.findFirst({
        where: {
          id: gymId,
          scheduleId: booking.scheduleTimeBlock.scheduleId,
        },
      });

      if (!gym) {
        throw new Error('Booking does not belong to this gym');
      }

      await this.prisma.scheduledBooking.delete({
        where: { id: bookingId },
      });

      return {
        success: true,
        cancelledBooking: booking,
      };
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : 'Unknown error';
      throw new Error(`Error cancelling user booking: ${errorMessage}`);
    }
  }

  async cancelUserBookingByTimeBlock(
    gymId: string,
    timeBlockId: string,
    userId: string,
  ) {
    try {
      const booking = await this.prisma.scheduledBooking.findFirst({
        where: {
          scheduleTimeBlockId: timeBlockId,
          userId: userId,
        },
        include: {
          user: {
            select: { id: true, fullName: true, email: true },
          },
          scheduleTimeBlock: {
            select: {
              dayOfWeek: true,
              startTime: true,
              endTime: true,
              scheduleId: true,
            },
          },
        },
      });

      if (!booking) {
        throw new Error('Booking not found for this user and time block');
      }

      const gym = await this.prisma.gym.findFirst({
        where: {
          id: gymId,
          scheduleId: booking.scheduleTimeBlock.scheduleId,
        },
      });

      if (!gym) {
        throw new Error('Booking does not belong to this gym');
      }

      await this.prisma.scheduledBooking.delete({
        where: { id: booking.id },
      });

      return {
        success: true,
        cancelledBooking: booking,
      };
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : 'Unknown error';
      throw new Error(`Error cancelling user booking: ${errorMessage}`);
    }
  }

  async resetGymBookings(
    gymId: string,
    options?: {
      dayOfWeek?: number;
      timeBlockId?: string;
      reason?: string;
    },
  ) {
    try {
      const gym = await this.prisma.gym.findUnique({
        where: { id: gymId },
        select: { scheduleId: true, name: true },
      });

      if (!gym) {
        throw new Error('Gym not found');
      }

      const whereClause = {
        scheduleTimeBlock: {
          scheduleId: gym.scheduleId,
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
        success: true,
        deletedCount: result.count,
      };
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : 'Unknown error';
      throw new Error(`Error resetting gym bookings: ${errorMessage}`);
    }
  }

  async deleteGym(id: string): Promise<{ message: string }> {
    try {
      const gym = await this.prisma.gym.findUnique({
        where: { id },
        select: { id: true, scheduleId: true },
      });

      if (!gym) {
        throw new BadGatewayException('Gym not found');
      }

      await this.prisma.$transaction(async (prisma) => {
        await prisma.gym.delete({
          where: { id: gym.id },
        });

        await prisma.schedule.delete({
          where: { id: gym.scheduleId },
        });
      });

      return { message: 'Gym deleted successfully' };
    } catch (error) {
      console.log(error);
      throw new BadGatewayException('Error deleting gym');
    }
  }

  async getGymEquipment(gymName: string) {
    try {
      const gym = await this.prisma.gym.findUnique({
        where: { name: gymName },
        select: {
          id: true,
          name: true,
          equipment: {
            select: {
              equipment: {
                select: {
                  id: true,
                  name: true,
                  description: true,
                  imageUrl: true,
                },
              },
            },
          },
        },
      });

      if (!gym) {
        throw new BadGatewayException('Gym not found');
      }

      const equipments = gym.equipment.map(
        (gymEquipment) => gymEquipment.equipment,
      );

      return equipments;
    } catch (error) {
      console.log(error);
      throw new BadGatewayException('Error fetching gym equipment');
    }
  }

  async getGymScheduleForBooking(gymId: string, userId: string) {
    try {
      const gym = await this.prisma.gym.findUnique({
        where: { id: gymId },
        select: {
          id: true,
          name: true,
          schedule: {
            select: {
              timeBlocks: {
                select: {
                  id: true,
                  dayOfWeek: true,
                  startTime: true,
                  endTime: true,
                  capacity: true,
                  isEnabled: true,
                  _count: {
                    select: {
                      ScheduledBooking: true,
                    },
                  },
                  ScheduledBooking: {
                    where: {
                      userId: userId,
                      bookingDate: {
                        gte: new Date(),
                      },
                    },
                    select: {
                      id: true,
                      bookingDate: true,
                    },
                  },
                },
                orderBy: [{ dayOfWeek: 'asc' }, { startTime: 'asc' }],
              },
            },
          },
        },
      });

      if (!gym) {
        throw new BadGatewayException('Gym not found');
      }

      const timeBlocks = gym.schedule.timeBlocks.map((block) => ({
        id: block.id,
        dayOfWeek: block.dayOfWeek,
        startTime: block.startTime,
        endTime: block.endTime,
        capacity: block.capacity,
        isEnabled: block.isEnabled,
        currentBookings: block._count.ScheduledBooking,
        isUserBooked: block.ScheduledBooking.length > 0,
      }));

      return {
        gymName: gym.name,
        timeBlocks,
      };
    } catch (error) {
      console.log(error);
      throw new BadGatewayException('Error fetching gym schedule');
    }
  }

  async createMultipleBookings(
    bookings: Array<{ scheduleTimeBlockId: string; bookingDate: string }>,
    userId: string,
  ) {
    try {
      type CreatedBooking = {
        id: string;
        scheduleTimeBlockId: string;
        userId: string;
        bookingDate: Date;
        createdAt: Date;
        updatedAt: Date;
        scheduleTimeBlock: {
          dayOfWeek: number;
          startTime: string;
          endTime: string;
        };
      };

      const results = await this.prisma.$transaction(async (prisma) => {
        const createdBookings: CreatedBooking[] = [];

        for (const booking of bookings) {
          const timeBlock = await prisma.scheduleTimeBlock.findUnique({
            where: { id: booking.scheduleTimeBlockId },
            include: {
              _count: {
                select: {
                  ScheduledBooking: {
                    where: {
                      bookingDate: new Date(booking.bookingDate),
                    },
                  },
                },
              },
            },
          });

          if (!timeBlock) {
            throw new Error(
              `Time block ${booking.scheduleTimeBlockId} not found`,
            );
          }

          if (!timeBlock.isEnabled) {
            throw new Error(
              `Time block ${booking.scheduleTimeBlockId} is not enabled`,
            );
          }

          if (timeBlock._count.ScheduledBooking >= timeBlock.capacity) {
            throw new Error(
              `Time block ${booking.scheduleTimeBlockId} is at full capacity`,
            );
          }

          const existingBooking = await prisma.scheduledBooking.findFirst({
            where: {
              scheduleTimeBlockId: booking.scheduleTimeBlockId,
              userId: userId,
              bookingDate: new Date(booking.bookingDate),
            },
          });

          if (existingBooking) {
            throw new Error(
              `User already has a booking for this time slot on ${booking.bookingDate}`,
            );
          }

          const newBooking = await prisma.scheduledBooking.create({
            data: {
              scheduleTimeBlockId: booking.scheduleTimeBlockId,
              userId: userId,
              bookingDate: new Date(booking.bookingDate),
            },
            include: {
              scheduleTimeBlock: {
                select: {
                  dayOfWeek: true,
                  startTime: true,
                  endTime: true,
                },
              },
            },
          });

          createdBookings.push(newBooking);
        }

        return createdBookings;
      });

      return {
        success: true,
        bookings: results,
        message: `Successfully created ${results.length} booking(s)`,
      };
    } catch (error) {
      console.log(error);
      const errorMessage =
        error instanceof Error ? error.message : 'Unknown error';
      throw new BadGatewayException(`Error creating bookings: ${errorMessage}`);
    }
  }
}
