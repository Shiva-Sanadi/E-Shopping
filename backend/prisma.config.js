// require("dotenv").config();
// const { defineConfig } = require("prisma/config");

// module.exports = defineConfig({
//   schema: "prisma/schema.prisma",
//   datasource: {
//     provider: "mysql",
//     url: process.env.DATABASE_URL,
//   },
// });


require("dotenv").config();
const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient({
  adapter: {
    provider: "mysql",
    url: process.env.DATABASE_URL,
  },
});

module.exports = { prisma };
