/*
  Warnings:

  - You are about to drop the `user_auth` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[username]` on the table `users` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[email]` on the table `users` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `name` to the `orders` table without a default value. This is not possible if the table is not empty.
  - Added the required column `value` to the `orders` table without a default value. This is not possible if the table is not empty.
  - Changed the type of `user_id` on the `orders` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Added the required column `email` to the `users` table without a default value. This is not possible if the table is not empty.
  - Added the required column `name` to the `users` table without a default value. This is not possible if the table is not empty.
  - Added the required column `password` to the `users` table without a default value. This is not possible if the table is not empty.
  - Added the required column `username` to the `users` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "assessment"."orders" DROP CONSTRAINT "orders_id_fkey";

-- AlterTable
ALTER TABLE "assessment"."orders" ADD COLUMN     "name" TEXT NOT NULL,
ADD COLUMN     "value" INTEGER NOT NULL,
DROP COLUMN "user_id",
ADD COLUMN     "user_id" UUID NOT NULL;

-- AlterTable
ALTER TABLE "assessment"."users" ADD COLUMN     "deleted" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "email" VARCHAR(100) NOT NULL,
ADD COLUMN     "name" VARCHAR(100) NOT NULL,
ADD COLUMN     "password" TEXT NOT NULL,
ADD COLUMN     "username" VARCHAR(100) NOT NULL;

-- DropTable
DROP TABLE "assessment"."user_auth";

-- CreateIndex
CREATE INDEX "orders_user_id_idx" ON "assessment"."orders"("user_id");

-- CreateIndex
CREATE UNIQUE INDEX "users_username_key" ON "assessment"."users"("username");

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "assessment"."users"("email");

-- CreateIndex
CREATE INDEX "users_username_idx" ON "assessment"."users"("username");

-- CreateIndex
CREATE INDEX "users_email_idx" ON "assessment"."users"("email");

-- AddForeignKey
ALTER TABLE "assessment"."orders" ADD CONSTRAINT "orders_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "assessment"."users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
