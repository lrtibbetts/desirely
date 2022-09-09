-- CreateTable
CREATE TABLE "Habit" (
    "id" BIGSERIAL NOT NULL,
    "habit_name" TEXT NOT NULL,

    CONSTRAINT "Habit_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "HabitEntry" (
    "id" BIGSERIAL NOT NULL,
    "habit_id" BIGINT NOT NULL,
    "entry_date" DATE NOT NULL DEFAULT CURRENT_DATE,

    CONSTRAINT "HabitEntry_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Habit_habit_name_key" ON "Habit"("habit_name");

-- CreateIndex
CREATE UNIQUE INDEX "HabitEntry_habit_id_entry_date_key" ON "HabitEntry"("habit_id", "entry_date");

-- AddForeignKey
ALTER TABLE "HabitEntry" ADD CONSTRAINT "HabitEntry_habit_id_fkey" FOREIGN KEY ("habit_id") REFERENCES "Habit"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
