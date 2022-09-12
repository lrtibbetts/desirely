const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

async function seed() {
    // Clean db
    await prisma.habitEntry.deleteMany();
    await prisma.habit.deleteMany();

    // Create a couple habits
    await prisma.habit.createMany({
        data: [
            { habitName: "yoga" },
            { habitName: "cook dinner" },
            { habitName: "run" }
        ]
    });

    // Create a couple habit entries
    const yoga = await prisma.habit.findUniqueOrThrow({ where: { habitName: "yoga"}});
    const dinner = await prisma.habit.findUniqueOrThrow({ where: { habitName: "cook dinner"}});

    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    await prisma.habitEntry.createMany({
        data: [
            { habitId: yoga.id,  entryDate: today },
            { habitId: yoga.id, entryDate: tomorrow },
            { habitId: dinner.id, entryDate: today }
        ]
    });

    console.log(`Database has been seeded. 🌱`);
}

seed()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });