/*
  Warnings:

  - You are about to drop the column `razorpayOrderId` on the `Order` table. All the data in the column will be lost.
  - You are about to drop the column `razorpayPaymentId` on the `Order` table. All the data in the column will be lost.
  - You are about to drop the column `razorpaySignature` on the `Order` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Order" DROP COLUMN "razorpayOrderId",
DROP COLUMN "razorpayPaymentId",
DROP COLUMN "razorpaySignature",
ADD COLUMN     "cfOrderId" TEXT,
ADD COLUMN     "cfPaymentId" TEXT;
