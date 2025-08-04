/*
  Warnings:

  - You are about to drop the column `scheduledTimeBlockId` on the `scheduled_bookings` table. All the data in the column will be lost.
  - You are about to drop the `gyms` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `scheduled_time_blocks` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `schedules` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[scheduleId]` on the table `courts` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[scheduleTimeBlockId,userId,bookingDate]` on the table `scheduled_bookings` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `scheduleId` to the `courts` table without a default value. This is not possible if the table is not empty.
  - Added the required column `scheduleTimeBlockId` to the `scheduled_bookings` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "gym_equipment" DROP CONSTRAINT "gym_equipment_gymId_fkey";

-- DropForeignKey
ALTER TABLE "gyms" DROP CONSTRAINT "gyms_createdBy_fkey";

-- DropForeignKey
ALTER TABLE "gyms" DROP CONSTRAINT "gyms_locationId_fkey";

-- DropForeignKey
ALTER TABLE "scheduled_bookings" DROP CONSTRAINT "scheduled_bookings_scheduledTimeBlockId_fkey";

-- DropForeignKey
ALTER TABLE "scheduled_time_blocks" DROP CONSTRAINT "scheduled_time_blocks_scheduleId_fkey";

-- DropForeignKey
ALTER TABLE "schedules" DROP CONSTRAINT "schedules_courtId_fkey";

-- DropForeignKey
ALTER TABLE "schedules" DROP CONSTRAINT "schedules_createdBy_fkey";

-- DropForeignKey
ALTER TABLE "schedules" DROP CONSTRAINT "schedules_gymId_fkey";

-- DropIndex
DROP INDEX "scheduled_bookings_scheduledTimeBlockId_userId_bookingDate_key";

-- AlterTable
ALTER TABLE "courts" ADD COLUMN     "scheduleId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "scheduled_bookings" DROP COLUMN "scheduledTimeBlockId",
ADD COLUMN     "scheduleTimeBlockId" TEXT NOT NULL;

-- DropTable
DROP TABLE "gyms";

-- DropTable
DROP TABLE "scheduled_time_blocks";

-- DropTable
DROP TABLE "schedules";

-- CreateTable
CREATE TABLE "Gym" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "locationId" TEXT NOT NULL,
    "createdBy" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "imageUrl" TEXT,
    "scheduleId" TEXT NOT NULL,

    CONSTRAINT "Gym_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "schedule_time_blocks" (
    "id" TEXT NOT NULL,
    "scheduleId" TEXT NOT NULL,
    "dayOfWeek" INTEGER NOT NULL,
    "startTime" TIMESTAMP(3) NOT NULL,
    "endTime" TIMESTAMP(3) NOT NULL,
    "capacity" INTEGER NOT NULL DEFAULT 0,
    "isEnabled" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "schedule_time_blocks_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Schedule" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Schedule_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Gym_name_key" ON "Gym"("name");

-- CreateIndex
CREATE UNIQUE INDEX "Gym_scheduleId_key" ON "Gym"("scheduleId");

-- CreateIndex
CREATE UNIQUE INDEX "courts_scheduleId_key" ON "courts"("scheduleId");

-- CreateIndex
CREATE UNIQUE INDEX "scheduled_bookings_scheduleTimeBlockId_userId_bookingDate_key" ON "scheduled_bookings"("scheduleTimeBlockId", "userId", "bookingDate");

-- AddForeignKey
ALTER TABLE "courts" ADD CONSTRAINT "courts_scheduleId_fkey" FOREIGN KEY ("scheduleId") REFERENCES "Schedule"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "gym_equipment" ADD CONSTRAINT "gym_equipment_gymId_fkey" FOREIGN KEY ("gymId") REFERENCES "Gym"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Gym" ADD CONSTRAINT "Gym_createdBy_fkey" FOREIGN KEY ("createdBy") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Gym" ADD CONSTRAINT "Gym_locationId_fkey" FOREIGN KEY ("locationId") REFERENCES "locations"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Gym" ADD CONSTRAINT "Gym_scheduleId_fkey" FOREIGN KEY ("scheduleId") REFERENCES "Schedule"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "scheduled_bookings" ADD CONSTRAINT "scheduled_bookings_scheduleTimeBlockId_fkey" FOREIGN KEY ("scheduleTimeBlockId") REFERENCES "schedule_time_blocks"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "schedule_time_blocks" ADD CONSTRAINT "schedule_time_blocks_scheduleId_fkey" FOREIGN KEY ("scheduleId") REFERENCES "Schedule"("id") ON DELETE CASCADE ON UPDATE CASCADE;
