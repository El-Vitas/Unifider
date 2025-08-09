import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { timeBlock } from './domain/timeblock';
import { CreateScheduleDto } from './dto/create-schedule.dto';
@Injectable()
export class ScheduleService {
  constructor(private readonly prisma: PrismaService) {}

  getDefaultTimeBlock() {
    return timeBlock;
  }

  async createSchedule(scheduleData: CreateScheduleDto) {
    try {
      const schedule = await this.prisma.schedule.create({
        data: {},
      });

      await this.prisma.scheduleTimeBlock.createMany({
        data: scheduleData.timeBlocks.map((block) => ({
          scheduleId: schedule.id,
          dayOfWeek: block.dayOfWeek,
          capacity: block.isEnabled ? block.capacity : 0,
          isEnabled: block.isEnabled,
          startTime: block.startTime,
          endTime: block.endTime,
        })),
      });

      return schedule;
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : 'Unknown error';
      throw new Error(`Error creating schedule: ${errorMessage}`);
    }
  }

  async findScheduleById(id: string) {
    try {
      const schedule = await this.prisma.schedule.findUnique({
        where: { id },
        include: {
          timeBlocks: {
            include: {
              ScheduledBooking: true,
            },
          },
        },
      });

      if (!schedule) {
        throw new Error('Schedule not found');
      }

      return schedule;
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : 'Unknown error';
      throw new Error(`Error fetching schedule by ID: ${errorMessage}`);
    }
  }

  async updateScheduleTimeBlocks(
    scheduleId: string,
    scheduleData: CreateScheduleDto,
  ) {
    try {
      const existingTimeBlocks = await this.prisma.scheduleTimeBlock.findMany({
        where: { scheduleId },
      });

      const timeBlockMap = new Map<string, (typeof existingTimeBlocks)[0]>();
      existingTimeBlocks.forEach((block) => {
        const startTime = block.startTime.toString().slice(0, 5);
        const endTime = block.endTime.toString().slice(0, 5);
        const key = `${block.dayOfWeek}-${startTime}-${endTime}`;
        timeBlockMap.set(key, block);
      });

      const updatePromises = scheduleData.timeBlocks
        .map((newBlock) => {
          const key = `${newBlock.dayOfWeek}-${newBlock.startTime}-${newBlock.endTime}`;
          const existingBlock = timeBlockMap.get(key);

          if (existingBlock) {
            return this.prisma.scheduleTimeBlock.update({
              where: { id: existingBlock.id },
              data: {
                capacity: newBlock.isEnabled ? newBlock.capacity : 0,
                isEnabled: newBlock.isEnabled,
              },
            });
          }
          return null;
        })
        .filter(Boolean);

      await Promise.all(updatePromises);

      return { success: true, updatedCount: updatePromises.length };
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : 'Unknown error';
      throw new Error(`Error updating schedule time blocks: ${errorMessage}`);
    }
  }

  async deleteSchedule(id: string) {
    try {
      await this.prisma.schedule.delete({
        where: { id },
      });
      return { success: true };
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : 'Unknown error';
      throw new Error(`Error deleting schedule: ${errorMessage}`);
    }
  }
}
