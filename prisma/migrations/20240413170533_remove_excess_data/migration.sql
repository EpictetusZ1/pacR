/*
  Warnings:

  - The values [horizontal_accuracy,vertical_accuracy] on the enum `MetricType` will be removed. If these variants are still used in the database, this will fail.
  - The values [FUEL] on the enum `Units` will be removed. If these variants are still used in the database, this will fail.
  - You are about to drop the column `source` on the `Metric` table. All the data in the column will be lost.
  - You are about to drop the column `source` on the `Moment` table. All the data in the column will be lost.
  - You are about to drop the column `source` on the `Summary` table. All the data in the column will be lost.
  - You are about to drop the column `recording_app_version` on the `Tags` table. All the data in the column will be lost.
  - You are about to drop the column `recording_source` on the `Tags` table. All the data in the column will be lost.
  - You are about to drop the column `sync_app_version` on the `Tags` table. All the data in the column will be lost.
  - You are about to drop the column `sync_source` on the `Tags` table. All the data in the column will be lost.
  - The primary key for the `User` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - Added the required column `userId` to the `Run` table without a default value. This is not possible if the table is not empty.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "MetricType_new" AS ENUM ('elevation', 'distance', 'pace', 'latitude', 'heart_rate', 'calories', 'steps', 'nikefuel', 'speed', 'descent', 'ascent', 'longitude', 'stars', 'rpe');
ALTER TABLE "Summary" ALTER COLUMN "metric_type" TYPE "MetricType_new" USING ("metric_type"::text::"MetricType_new");
ALTER TABLE "Metric" ALTER COLUMN "type" TYPE "MetricType_new" USING ("type"::text::"MetricType_new");
ALTER TYPE "MetricType" RENAME TO "MetricType_old";
ALTER TYPE "MetricType_new" RENAME TO "MetricType";
DROP TYPE "MetricType_old";
COMMIT;

-- AlterEnum
BEGIN;
CREATE TYPE "Units_new" AS ENUM ('KM', 'STEP', 'KCAL', 'KMH', 'MKM', 'BPM', 'M', 'DD', 'STAR', 'RATING');
ALTER TABLE "Metric" ALTER COLUMN "unit" TYPE "Units_new" USING ("unit"::text::"Units_new");
ALTER TYPE "Units" RENAME TO "Units_old";
ALTER TYPE "Units_new" RENAME TO "Units";
DROP TYPE "Units_old";
COMMIT;

-- DropForeignKey
ALTER TABLE "Account" DROP CONSTRAINT "Account_userId_fkey";

-- DropForeignKey
ALTER TABLE "Session" DROP CONSTRAINT "Session_userId_fkey";

-- AlterTable
ALTER TABLE "Account" ALTER COLUMN "userId" SET DATA TYPE TEXT;

-- AlterTable
ALTER TABLE "Metric" DROP COLUMN "source";

-- AlterTable
ALTER TABLE "Moment" DROP COLUMN "source";

-- AlterTable
ALTER TABLE "Run" ADD COLUMN     "userId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Session" ALTER COLUMN "userId" SET DATA TYPE TEXT;

-- AlterTable
ALTER TABLE "Summary" DROP COLUMN "source";

-- AlterTable
ALTER TABLE "Tags" DROP COLUMN "recording_app_version",
DROP COLUMN "recording_source",
DROP COLUMN "sync_app_version",
DROP COLUMN "sync_source";

-- AlterTable
ALTER TABLE "User" DROP CONSTRAINT "User_pkey",
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ADD CONSTRAINT "User_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "User_id_seq";

-- AddForeignKey
ALTER TABLE "Run" ADD CONSTRAINT "Run_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Account" ADD CONSTRAINT "Account_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Session" ADD CONSTRAINT "Session_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
