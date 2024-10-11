/*
  Warnings:

  - You are about to drop the `Order` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `User` table. If the table is not empty, all the data it contains will be lost.

*/
-- CreateEnum
CREATE TYPE "assessment"."enum_size" AS ENUM ('Small', 'Medium', 'Large');

-- DropForeignKey
ALTER TABLE "assessment"."Order" DROP CONSTRAINT "Order_id_fkey";

-- DropTable
DROP TABLE "assessment"."Order";

-- DropTable
DROP TABLE "assessment"."User";

-- DropEnum
DROP TYPE "assessment"."Size";

-- CreateTable
CREATE TABLE "assessment"."users" (
    "id" INTEGER NOT NULL,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "assessment"."orders" (
    "id" INTEGER NOT NULL,
    "size" "assessment"."enum_size" NOT NULL,
    "user_id" INTEGER NOT NULL,

    CONSTRAINT "orders_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "assessment"."orders" ADD CONSTRAINT "orders_id_fkey" FOREIGN KEY ("id") REFERENCES "assessment"."users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
