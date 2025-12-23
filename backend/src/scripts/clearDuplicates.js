const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

async function clearDuplicates() {
  console.log("🧹 Clearing duplicate cart and wishlist items...");

  try {
    // Clear all cart items
    const deletedCartItems = await prisma.cartItem.deleteMany({});
    console.log(`✅ Deleted ${deletedCartItems.count} cart items`);

    // Clear all wishlist items
    const deletedWishlistItems = await prisma.wishlist.deleteMany({});
    console.log(`✅ Deleted ${deletedWishlistItems.count} wishlist items`);

    console.log("\n✨ Database cleaned! You can now add items fresh.");
  } catch (error) {
    console.error("❌ Error:", error);
  } finally {
    await prisma.$disconnect();
  }
}

clearDuplicates();