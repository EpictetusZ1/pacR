-- CreateEnum
CREATE TYPE "Terrain" AS ENUM ('road', 'trail', 'track', 'unknown', 'treadmill');

-- CreateEnum
CREATE TYPE "MetricType" AS ENUM ('elevation', 'distance', 'pace', 'latitude', 'heart_rate', 'calories', 'steps', 'nikefuel', 'speed', 'descent', 'ascent', 'longitude', 'horizontal_accuracy', 'vertical_accuracy', 'stars', 'rpe');

-- CreateEnum
CREATE TYPE "Units" AS ENUM ('KM', 'STEP', 'KCAL', 'KMH', 'MKM', 'BPM', 'M', 'DD', 'FUEL', 'STAR', 'RATING');

-- CreateTable
CREATE TABLE "Run" (
    "id" TEXT NOT NULL,
    "start_epoch_ms" TIMESTAMPTZ(6) NOT NULL,
    "end_epoch_ms" TIMESTAMPTZ(6) NOT NULL,
    "active_duration_ms" BIGINT NOT NULL,
    "distance" DOUBLE PRECISION NOT NULL,
    "pace" DOUBLE PRECISION NOT NULL,
    "tagId" TEXT NOT NULL,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) NOT NULL,

    CONSTRAINT "Run_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Summary" (
    "id" SERIAL NOT NULL,
    "run_id" TEXT NOT NULL,
    "metric_type" "MetricType" NOT NULL,
    "summary" TEXT,
    "source" TEXT NOT NULL,
    "value" DOUBLE PRECISION NOT NULL,

    CONSTRAINT "Summary_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Tags" (
    "id" TEXT NOT NULL,
    "name" TEXT,
    "goal_type" TEXT,
    "original_activity_id" TEXT,
    "recording_app_version" TEXT,
    "recording_source" TEXT,
    "sync_app_version" TEXT,
    "sync_source" TEXT,
    "temperature" DOUBLE PRECISION,
    "weather" TEXT,
    "location" TEXT DEFAULT 'outdoors',
    "note" TEXT,
    "rpe" INTEGER,
    "shoe_id" TEXT,
    "terrain" "Terrain" DEFAULT 'unknown',

    CONSTRAINT "Tags_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Metric" (
    "id" SERIAL NOT NULL,
    "run_id" TEXT NOT NULL,
    "type" "MetricType" NOT NULL,
    "unit" "Units" NOT NULL,
    "source" TEXT NOT NULL,
    "values" JSONB NOT NULL,

    CONSTRAINT "Metric_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Moment" (
    "id" SERIAL NOT NULL,
    "run_id" TEXT NOT NULL,
    "key" TEXT NOT NULL,
    "value" TEXT NOT NULL,
    "timestamp" TIMESTAMPTZ(6) NOT NULL,
    "source" TEXT NOT NULL,

    CONSTRAINT "Moment_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Metric_run_id_idx" ON "Metric"("run_id");

-- CreateIndex
CREATE INDEX "Moment_run_id_idx" ON "Moment"("run_id");

-- AddForeignKey
ALTER TABLE "Run" ADD CONSTRAINT "Run_tagId_fkey" FOREIGN KEY ("tagId") REFERENCES "Tags"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Summary" ADD CONSTRAINT "Summary_run_id_fkey" FOREIGN KEY ("run_id") REFERENCES "Run"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Metric" ADD CONSTRAINT "Metric_run_id_fkey" FOREIGN KEY ("run_id") REFERENCES "Run"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Moment" ADD CONSTRAINT "Moment_run_id_fkey" FOREIGN KEY ("run_id") REFERENCES "Run"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
