import { BadGatewayException, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class CourtService {
  constructor(private readonly prisma: PrismaService) {}

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
          ? this.groupTimeBlocks(court.schedule.timeBlocks)
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
