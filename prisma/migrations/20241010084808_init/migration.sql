-- CreateSchema
CREATE SCHEMA IF NOT EXISTS "assessment";

-- CreateEnum
CREATE TYPE "assessment"."Size" AS ENUM ('Small', 'Medium', 'Large');

-- CreateTable
CREATE TABLE "assessment"."User" (
    "id" INTEGER NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "assessment"."Order" (
    "id" INTEGER NOT NULL,
    "user_id" INTEGER NOT NULL,

    CONSTRAINT "Order_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "assessment"."Order" ADD CONSTRAINT "Order_id_fkey" FOREIGN KEY ("id") REFERENCES "assessment"."User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
