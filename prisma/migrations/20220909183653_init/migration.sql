-- CreateTable
CREATE TABLE "Habit" (
    "id" BIGSERIAL NOT NULL,
    "habitName" TEXT NOT NULL,

    CONSTRAINT "Habit_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "HabitEntry" (
    "id" BIGSERIAL NOT NULL,
    "habitId" BIGINT NOT NULL,
    "entryDate" DATE NOT NULL DEFAULT CURRENT_DATE,

    CONSTRAINT "HabitEntry_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Habit_habitName_key" ON "Habit"("habitName");

-- CreateIndex
CREATE UNIQUE INDEX "HabitEntry_habitId_entryDate_key" ON "HabitEntry"("habitId", "entryDate");

-- AddForeignKey
ALTER TABLE "HabitEntry" ADD CONSTRAINT "HabitEntry_habitId_fkey" FOREIGN KEY ("habitId") REFERENCES "Habit"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
