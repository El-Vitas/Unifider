-- DropForeignKey
ALTER TABLE "public"."Gym" DROP CONSTRAINT "Gym_scheduleId_fkey";

-- DropForeignKey
ALTER TABLE "public"."courts" DROP CONSTRAINT "courts_scheduleId_fkey";

-- CreateTable
CREATE TABLE "public"."teams" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "instructor" TEXT,
    "contact" TEXT,
    "imageUrl" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "teams_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "teams_name_key" ON "public"."teams"("name");

-- AddForeignKey
ALTER TABLE "public"."courts" ADD CONSTRAINT "courts_scheduleId_fkey" FOREIGN KEY ("scheduleId") REFERENCES "public"."Schedule"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Gym" ADD CONSTRAINT "Gym_scheduleId_fkey" FOREIGN KEY ("scheduleId") REFERENCES "public"."Schedule"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
