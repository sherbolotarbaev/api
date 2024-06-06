-- CreateTable
CREATE TABLE "GuestBookMessage" (
    "id" SERIAL NOT NULL,
    "message" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "image" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "GuestBookMessage_pkey" PRIMARY KEY ("id")
);
