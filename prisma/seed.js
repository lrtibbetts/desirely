const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

async function seed() {
    // Clean db
    await prisma.habitEntry.deleteMany();
    await prisma.habit.deleteMany();
    await prisma.user.deleteMany();

    // Create a user
    const email = "lucilletibbetts@gmail.com";
    await prisma.user.createMany({
      data: [
        { email: email,
          passwordHash: "$2b$10$K7L1OJ45/4Y2nIvhRVpCe.FSmhDdWoXehVzJptJ/op0lSsvqNu/1u",
          firstName: "Lucy",
          lastName: "Tibbetts",
        }
      ]
    });

    // Fetch user
    const me = await prisma.user.findUniqueOrThrow({ where: { email: email }});
    // Create a couple habits
    await prisma.habit.createMany({
        data: [
            { userId: me.id, habitName: "Yoga" },
            { userId: me.id, habitName: "Cook dinner" },
            { userId: me.id, habitName: "Run" }
        ]
    });

    // Create a couple habit entries
    const yoga = await prisma.habit.findUniqueOrThrow({ 
      where: { 
        userId_habitName: {
          userId: me.id,
          habitName: "Yoga"
        }}});
    const dinner = await prisma.habit.findUniqueOrThrow({ 
      where: { 
        userId_habitName: {
          userId: me.id,
          habitName: "Cook dinner"
        }}});

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