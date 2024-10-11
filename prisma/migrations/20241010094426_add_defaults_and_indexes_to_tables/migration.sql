/*
  Warnings:

  - The primary key for the `orders` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The `id` column on the `orders` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The primary key for the `users` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The `id` column on the `users` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - A unique constraint covering the columns `[id]` on the table `orders` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[id]` on the table `users` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `updated_at` to the `orders` table without a default value. This is not possible if the table is not empty.
  - Changed the type of `size` on the `orders` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Added the required column `updated_at` to the `users` table without a default value. This is not possible if the table is not empty.

*/
-- CreateExtension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- CreateEnum
CREATE TYPE "assessment"."enum_order_size" AS ENUM ('Small', 'Medium', 'Large');

-- DropForeignKey
ALTER TABLE "assessment"."orders" DROP CONSTRAINT "orders_id_fkey";

-- AlterTable
ALTER TABLE "assessment"."orders" DROP CONSTRAINT "orders_pkey",
ADD COLUMN     "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "updated_at" TIMESTAMP(3) NOT NULL,
DROP COLUMN "id",
ADD COLUMN     "id" UUID NOT NULL DEFAULT gen_random_uuid(),
DROP COLUMN "size",
ADD COLUMN     "size" "assessment"."enum_order_size" NOT NULL;

-- AlterTable
ALTER TABLE "assessment"."users" DROP CONSTRAINT "users_pkey",
ADD COLUMN     "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "updated_at" TIMESTAMP(3) NOT NULL,
DROP COLUMN "id",
ADD COLUMN     "id" UUID NOT NULL DEFAULT gen_random_uuid();

-- DropEnum
DROP TYPE "assessment"."enum_size";

-- CreateTable
CREATE TABLE "assessment"."user_auth" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "name" VARCHAR(100) NOT NULL,
    "username" VARCHAR(100) NOT NULL,
    "password" TEXT NOT NULL,
    "email" VARCHAR(100) NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "user_auth_id_key" ON "assessment"."user_auth"("id");

-- CreateIndex
CREATE UNIQUE INDEX "user_auth_username_key" ON "assessment"."user_auth"("username");

-- CreateIndex
CREATE UNIQUE INDEX "user_auth_email_key" ON "assessment"."user_auth"("email");

-- CreateIndex
CREATE INDEX "user_auth_id_idx" ON "assessment"."user_auth"("id");

-- CreateIndex
CREATE INDEX "user_auth_username_idx" ON "assessment"."user_auth"("username");

-- CreateIndex
CREATE INDEX "user_auth_email_idx" ON "assessment"."user_auth"("email");

-- CreateIndex
CREATE UNIQUE INDEX "orders_id_key" ON "assessment"."orders"("id");

-- CreateIndex
CREATE INDEX "orders_id_idx" ON "assessment"."orders"("id");

-- CreateIndex
CREATE UNIQUE INDEX "users_id_key" ON "assessment"."users"("id");

-- CreateIndex
CREATE INDEX "users_id_idx" ON "assessment"."users"("id");

-- AddForeignKey
ALTER TABLE "assessment"."orders" ADD CONSTRAINT "orders_id_fkey" FOREIGN KEY ("id") REFERENCES "assessment"."users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
