-- CreateTable
CREATE TABLE "UserMetaData" (
    "userId" INTEGER NOT NULL,
    "ip" TEXT NOT NULL,
    "city" TEXT,
    "region" TEXT,
    "country" TEXT,
    "timezone" TEXT,
    "lastSeen" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "UserMetaData_pkey" PRIMARY KEY ("userId")
);

-- AddForeignKey
ALTER TABLE "UserMetaData" ADD CONSTRAINT "UserMetaData_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE NO ACTION;
