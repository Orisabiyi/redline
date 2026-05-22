-- CreateEnum
CREATE TYPE "Category" AS ENUM ('JDM', 'SUPERCAR', 'CLASSIC');

-- CreateTable
CREATE TABLE "Car" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "make" TEXT NOT NULL,
    "model" TEXT NOT NULL,
    "year" INTEGER NOT NULL,
    "endYear" INTEGER,
    "category" "Category" NOT NULL,
    "engine" TEXT NOT NULL,
    "displacement" DOUBLE PRECISION,
    "horsepower" INTEGER,
    "torque" INTEGER,
    "transmission" TEXT,
    "drivetrain" TEXT,
    "weight" INTEGER,
    "zeroToSixty" DOUBLE PRECISION,
    "topSpeed" INTEGER,
    "unitsProduced" INTEGER,
    "tagline" TEXT,
    "story" TEXT,
    "funFacts" TEXT[],
    "tags" TEXT[],
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Car_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Image" (
    "id" TEXT NOT NULL,
    "carId" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "source" TEXT NOT NULL,
    "attribution" TEXT,
    "isPrimary" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "Image_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Variant" (
    "id" TEXT NOT NULL,
    "carId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "horsepower" INTEGER,
    "notes" TEXT,

    CONSTRAINT "Variant_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Car_slug_key" ON "Car"("slug");

-- AddForeignKey
ALTER TABLE "Image" ADD CONSTRAINT "Image_carId_fkey" FOREIGN KEY ("carId") REFERENCES "Car"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Variant" ADD CONSTRAINT "Variant_carId_fkey" FOREIGN KEY ("carId") REFERENCES "Car"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
