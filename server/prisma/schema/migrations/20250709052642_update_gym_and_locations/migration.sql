/*
  Warnings:

  - Made the column `description` on table `locations` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "locations" ALTER COLUMN "description" SET NOT NULL;
