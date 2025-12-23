// const { PrismaClient } = require("@prisma/client");

// const prisma = new PrismaClient();

// const connectDB = async () => {
//   try {
//     await prisma.$connect();
//     console.log("✅ MySQL connected via Prisma");
//   } catch (err) {
//     console.error("❌ DB connection failed", err);
//     process.exit(1);
//   }
// };

// module.exports = { prisma, connectDB };



const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient({
  log: ['error', 'warn'],
});

const connectDB = async () => {
  try {
    await prisma.$connect();
    console.log("✅ MySQL connected via Prisma");
  } catch (err) {
    console.error("❌ DB connection failed", err);
    process.exit(1);
  }
};

process.on('beforeExit', async () => {
  await prisma.$disconnect();
});

module.exports = { prisma, connectDB };