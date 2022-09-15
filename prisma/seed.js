const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

async function seed() {
    // Clean db
    await prisma.habitEntry.deleteMany();
    await prisma.habit.deleteMany();
    await prisma.user.deleteMany();

    // Create a user
    await prisma.user.createMany({
      data: [
        { email: "lucilletibbetts@gmail.com", passwordHash: "xyz" }
      ]
    })

    // Create a couple habits
    await prisma.habit.createMany({
        data: [
            { habitName: "Yoga" },
            { habitName: "Cook dinner" },
            { habitName: "Run" }
        ]
    });

    // Create a couple habit entries
    const yoga = await prisma.habit.findUniqueOrThrow({ where: { habitName: "Yoga"}});
    const dinner = await prisma.habit.findUniqueOrThrow({ where: { habitName: "Cook dinner"}});

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